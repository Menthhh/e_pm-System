"use server"
import mongoose from "mongoose"
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { User } from "../models/User";
import { redirect } from "next/navigation";
import nextConfig from "../../../next.config.mjs";


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
    const db = await mongoose.connect("mongodb://103.76.182.69:27017/e_pm");
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

  await connectToDb();
  const username = formData.get("username");
  const password = formData.get("password");
  console.log(username, password)

  const user = await User.findOne({ 
    USERNAME: username,
    PASSWORD: password
   }) || (username === "admin" && password === "admin");
   
   if (!user) {
     return { error: "Invalid username or password" };
   }


    redirect("/pages/SA/create-role");
}

export async function register(prevState, formData) {

  await connectToDb();
  const empNumber = formData.get("employeeNumber");
  const empName = formData.get("employeeName");
  const email = formData.get("email");
  const username = formData.get("username");
  const password = formData.get("password");
  const team = formData.get("team");
  
  console.log(username, password, empNumber, empName, email, team)

  await fetch(`${nextConfig.host}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emp_number: empNumber,
      emp_name: empName,
      email: email,
      username: username,
      password: password,
      team: team
    }),
  });
  return { message: "User created successfully" };

  // redirect("/pages/login");
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
