import crypto from "crypto";
import { supabase } from "./supabase.js";

function getSessionToken(req) {
  const cookie = req.headers.cookie;

  if (!cookie) {
    return null;
  }

  const sessionCookie = cookie
    .split(";")
    .find((c) => c.trim().startsWith("session="));

  if (!sessionCookie) {
    return null;
  }

  return sessionCookie.split("=")[1];
}

function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function authenticate(req) {
  const token = getSessionToken(req);

  if (!token) {
    return null;
  }

  const tokenHash = hashToken(token);

  const { data: session } = await supabase
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

export async function logout(req) {
  const token = getSessionToken(req);

  if (!token) {
    return;
  }

  const tokenHash = hashToken(token);

  await supabase
    .from("sessions")
    .delete()
    .eq("token_hash", tokenHash);
}