import { supabase } from "./supabase.js";
import { authenticate } from "./authenticate.js";


export default async function handler(req, res) {

    if (req.method !== "GET") {

        return res.status(405).json({
            message: "Method not allowed"
        });

    }


    const userId =
        await authenticate(req);


    if (!userId) {

        return res.status(401).json({
            message: "Not logged in"
        });

    }


    const { data: user } =
        await supabase
            .from("users")
            .select("id, username")
            .eq("id", userId)
            .single();


    return res.json({
        user
    });

}