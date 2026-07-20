import crypto from "crypto";
import { supabase } from "./supabase.js";


export async function authenticate(req) {

    const cookie =
        req.headers.cookie;


    if (!cookie) {
        return null;
    }


    const sessionCookie =
        cookie
            .split(";")
            .find(c =>
                c.trim().startsWith("session=")
            );


    if (!sessionCookie) {
        return null;
    }


    const token =
        sessionCookie
            .split("=")[1];


    const tokenHash =
        crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");


    const { data: session } =
        await supabase
            .from("sessions")
            .select("user_id, expires_at")
            .eq("token_hash", tokenHash)
            .maybeSingle();


    if (!session) {
        return null;
    }


    if (new Date(session.expires_at) < new Date()) {

        await supabase
            .from("sessions")
            .delete()
            .eq("token_hash", tokenHash);

        return null;
    }


    return session.user_id;
}