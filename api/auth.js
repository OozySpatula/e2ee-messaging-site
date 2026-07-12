import argon2 from "argon2";
import crypto from "crypto";

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

    console.time("total request");


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

                  memoryCost: 19456, // ~19 MB
                  timeCost: 2,
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

            console.time("supabase query");
            const { data: user } =
                await supabase
                    .from("users")
                    .select("*")
                    .eq("username", username)
                    .maybeSingle();

            console.timeEnd("supabase query");

            console.time("total request");

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



            const token =
                crypto.randomBytes(32)
                    .toString("hex");



            const tokenHash =
                crypto
                    .createHash("sha256")
                    .update(token)
                    .digest("hex");



            await supabase
                .from("sessions")
                .insert({

                    user_id: user.id,

                    token_hash:
                        tokenHash,

                    expires_at:
                        new Date(
                            Date.now()
                            + 1000 * 60 * 60 * 24 * 7
                        )

                });



            res.cookie(
                "session",
                token,
                {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge:
                        1000 *
                        60 *
                        60 *
                        24 *
                        7
                }
            );



            return res.json({

                message:
                    "Logged in"

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