import mongoose from "mongoose"
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/models/User.js";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

const connection = {};

export const connectToDb = async () => {
  try {
    if (connection.isConnected) {
      console.log("Using existing connection");
      return;
    }
    const db = await mongoose.connect("mongodb://localhost:27017/e_pm");
    connection.isConnected = db.connections[0].readyState;
    console.log("New connection");
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 minutes from now")
    .sign(key);
}

export async function decrypt(input) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(user_id) {
  await connectToDb();
  const user = await User.findById(user_id);

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);
  const expires = expirationDate
  const session = await encrypt({ user, expires });

  cookies().set("session", session, { expires, httpOnly: true });

  console.log(cookies());


  return session;
}


export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  // console.log(cookies())
  if (!session) return { message: "Session not found" };
  return await decrypt(session);
}

export async function updateSession(request) {
  const session = request.cookies.get("session")?.value;
  if (!session) return { message: "Session not found" };

  const parsed = await decrypt(session);

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);

  parsed.expires = expirationDate;

  console.log("Expires", parsed.expires);

  const res = new NextResponse();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
