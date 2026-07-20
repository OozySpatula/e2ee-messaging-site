import { supabase } from "./supabase.js";

export default async function handler(req, res) {

    try {

        //
        // Send friend request
        //

        if (
            req.method === "POST" &&
            req.body.action === "request"
        ) {

            const {
                senderId,
                receiverId
            } = req.body;


            if (senderId === receiverId) {

                return res.status(400).json({
                    message:
                        "You cannot add yourself."
                });

            }


            const { data: receiver } =
                await supabase
                    .from("users")
                    .select("id")
                    .eq("id", receiverId)
                    .maybeSingle();


            if (!receiver) {

                return res.status(404).json({
                    message:
                        "User not found."
                });

            }


            const { data: existingFriend } =
                await supabase
                    .from("friends")
                    .select("id")
                    .or(
                        `and(user1_id.eq.${senderId},user2_id.eq.${receiverId}),and(user1_id.eq.${receiverId},user2_id.eq.${senderId})`
                    )
                    .maybeSingle();


            if (existingFriend) {

                return res.status(409).json({
                    message:
                        "Already friends."
                });

            }


            const { data: existingRequest } =
                await supabase
                    .from("friend_requests")
                    .select("id")
                    .or(
                        `and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`
                    )
                    .maybeSingle();


            if (existingRequest) {

                return res.status(409).json({
                    message:
                        "Friend request already exists."
                });

            }


            const { error } =
                await supabase
                    .from("friend_requests")
                    .insert({

                        sender_id:
                            senderId,

                        receiver_id:
                            receiverId

                    });


            if (error) {

                throw error;

            }


            return res.json({

                message:
                    "Friend request sent."

            });

        }



        //
        // Accept request
        //

        if (
            req.method === "POST" &&
            req.body.action === "accept"
        ) {

            const {
                requestId
            } = req.body;


            const { data: request } =
                await supabase
                    .from("friend_requests")
                    .select("*")
                    .eq("id", requestId)
                    .maybeSingle();


            if (!request) {

                return res.status(404).json({
                    message:
                        "Friend request not found."
                });

            }


            await supabase
                .from("friends")
                .insert({

                    user1_id:
                        request.sender_id,

                    user2_id:
                        request.receiver_id

                });


            await supabase
                .from("friend_requests")
                .delete()
                .eq("id", requestId);


            return res.json({

                message:
                    "Friend request accepted."

            });

        }



        //
        // List requests
        //

        if (
            req.method === "GET" &&
            req.query.action === "requests"
        ) {

            const { userId } =
                req.query;


            const { data } =
                await supabase
                    .from("friend_requests")
                    .select(`
                        id,
                        sender:users!friend_requests_sender_id_fkey(
                            id,
                            username
                        )
                    `)
                    .eq("receiver_id", userId);


            return res.json(data);

        }



        //
        // List friends
        //

        if (
            req.method === "GET" &&
            req.query.action === "friends"
        ) {

            const { userId } =
                req.query;


            const { data } =
                await supabase
                    .from("friends")
                    .select(`
                        user1:users!friends_user1_id_fkey(
                            id,
                            username
                        ),
                        user2:users!friends_user2_id_fkey(
                            id,
                            username
                        )
                    `)
                    .or(
                        `user1_id.eq.${userId},user2_id.eq.${userId}`
                    );


            const friends =
                data.map(friend => {

                    return friend.user1.id === userId
                        ? friend.user2
                        : friend.user1;

                });


            return res.json(friends);

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