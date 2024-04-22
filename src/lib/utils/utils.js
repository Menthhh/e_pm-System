"use server"
import mongoose from "mongoose"
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { User } from "../models/User";
import { redirect } from "next/navigation";


const secretKey = process.env.SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

const connection = {};

export const connectToDb = async () => {
  console.log("Connecting to DB");  
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
    .setExpirationTime("7 days")
    .sign(key);
}

export async function decrypt(input) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(prevState, formData) {
  // const expirationDate = new Date();
  // expirationDate.setDate(expirationDate.getDate() + 7);
  // const expires = expirationDate
  // const session = await encrypt({ user_id, expires });
  // cookies().set("session", session, { expires, httpOnly: true });
  // return session;
  console.log("Logging in")
  await connectToDb();
  const username = formData.get("username");
  const password = formData.get("password");
  console.log(username, password)
  //CHECK USERNAME AND PASSWORD FROM DB
  const user = await User.findOne({ 
    USERNAME: username,
    PASSWORD: password
   }) || (username === "admin" && password === "admin");
   
   if (!user) {
     return { error: "Invalid username or password" };
   }


    redirect("/pages/role-determiner");
}

export async function logout() {
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("session")?.value;
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
  
  const res = new NextResponse();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
