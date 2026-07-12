import argon2 from "argon2";
import { supabase } from "./supabase.js";


function validateUsername(username) {

    return /^[a-zA-Z0-9_]{3,20}$/.test(username);

}


function validatePassword(password) {

    return (
        typeof password === "string" &&
        password.length >= 12 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
    );

}



export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            message: "Method not allowed"
        });

    }



    const {
        action,
        username,
        password
    } = req.body;



    try {


        if (action === "register") {


            if (!validateUsername(username)) {

                return res.status(400).json({
                    message: "Invalid username"
                });

            }


            if (!validatePassword(password)) {

                return res.status(400).json({
                    message:
                        "Password does not meet requirements"
                });

            }



            const { data: existing } =
                await supabase
                    .from("users")
                    .select("id")
                    .eq("username", username)
                    .maybeSingle();



            if (existing) {

                return res.status(409).json({
                    message:
                        "Username already exists"
                });

            }



            const passwordHash =
            await argon2.hash(password, {
                type: argon2.argon2id,
                memoryCost: 65536, // 32 MB
                timeCost: 3,
                parallelism: 1
            });

            const { error } =
                await supabase
                    .from("users")
                    .insert({

                        username,

                        password_hash:
                            passwordHash

                    });



            if (error) {

                console.error(error);

                return res.status(500).json({
                    message:
                        "Could not create account"
                });

            }



            return res.status(201).json({

                message:
                    "Account created"

            });

        }



        if (action === "login") {

            const { data: user } =
                await supabase
                    .from("users")
                    .select("*")
                    .eq("username", username)
                    .maybeSingle();

            if (!user) {

                return res.status(401).json({
                    message:
                        "Invalid credentials"
                });

            }



            const valid =
                await argon2.verify(
                    user.password_hash,
                    password
                );



            if (!valid) {

                return res.status(401).json({
                    message:
                        "Invalid credentials"
                });

            }

            return res.json({

                message:
                    "Logged in",
                user: {
                    id: user.id,
                    username: user.username
                }
            });

        }



        return res.status(400).json({

            message:
                "Invalid action"

        });



    } catch(error) {

        console.error(error);


        return res.status(500).json({

            message:
                "Server error"

        });

    }

}