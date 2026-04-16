import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getJwtSecret } from "@/lib/env";

const COOKIE_NAME = "notehive_token";
const tokenSecret = new TextEncoder().encode(getJwtSecret());

export async function signAuthToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(tokenSecret);
}

export async function verifyAuthToken(token) {
  const { payload } = await jwtVerify(token, tokenSecret);
  return payload;
}

export async function getCurrentUserFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const payload = await verifyAuthToken(token);
    if (!payload?.userId || !payload?.email) return null;
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}

export async function setAuthCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });
}
