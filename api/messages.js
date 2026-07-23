import { supabase } from "./supabase.js";
import { authenticate } from "./authenticate.js";

export default async function handler(req, res) {

    try {

        const userId = await authenticate(req);

        if (!userId) {

            return res.status(401).json({
                message: "Unauthorized"
            });

        }


        //
        // Send message
        //

        if (
            req.method === "POST" &&
            req.body.action === "send"
        ) {

            const {
                receiverId,
                ciphertext
            } = req.body;


            if (!ciphertext) {

                return res.status(400).json({
                    message: "Message cannot be empty."
                });

            }


            const { data: friendship } =
                await supabase
                    .from("friends")
                    .select("id")
                    .or(
                        `and(user1_id.eq.${userId},user2_id.eq.${receiverId}),and(user1_id.eq.${receiverId},user2_id.eq.${userId})`
                    )
                    .maybeSingle();


            if (!friendship) {

                return res.status(403).json({
                    message: "You can only message friends."
                });

            }


            const { error } =
                await supabase
                    .from("messages")
                    .insert({

                        sender_id:
                            userId,

                        receiver_id:
                            receiverId,

                        ciphertext

                    });


            if (error) {

                throw error;

            }


            return res.json({

                message:
                    "Message sent."

            });

        }


        //
        // Get conversation
        //

        if (
            req.method === "GET" &&
            req.query.action === "list"
        ) {

            const {
                friendId
            } = req.query;


            const { data: friendship } =
                await supabase
                    .from("friends")
                    .select("id")
                    .or(
                        `and(user1_id.eq.${userId},user2_id.eq.${friendId}),and(user1_id.eq.${friendId},user2_id.eq.${userId})`
                    )
                    .maybeSingle();


            if (!friendship) {

                return res.status(403).json({
                    message:
                        "You can only view conversations with friends."
                });

            }


            const { data, error } =
                await supabase
                    .from("messages")
                    .select(`
                        id,
                        sender_id,
                        receiver_id,
                        ciphertext,
                        sent_at
                    `)
                    .or(
                        `and(sender_id.eq.${userId},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${userId})`
                    )
                    .order(
                        "sent_at",
                        {
                            ascending: true
                        }
                    );


            if (error) {

                throw error;

            }


            return res.json(data);

        }


        return res.status(400).json({

            message:
                "Invalid request."

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            message:
                "Server error."

        });

    }

}