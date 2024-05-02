"use server";
import mongoose from "mongoose";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import nextConfig from "../../../next.config.mjs";
import { Role } from "./Role";
import { NextResponse } from "next/server";

const secretKey = process.env.SECRET_KEY;
const key = new TextEncoder().encode(secretKey);
const db_url = process.env.MONGODB_URI;

const connection = {};

export const connectToDb = async () => {
  console.log("Connecting to DB");
  try {
    if (connection.isConnected) {
      console.log("Using existing connection");
      return;
    }
    const db = await mongoose.connect(db_url);
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
    .setExpirationTime("7d")
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

  const res = await fetch(`${nextConfig.host}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  const data = await res.json();
  if (data.status === 200) {
    cookies().set("token", data.token, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    console.log(data.user.Role)
    const path = routing(data.user.Role);
    redirect(path);

  } else{
    return { message: "Wrong credential Please try again" };
  }
}

const routing = (role_id) => {
  switch (role_id) {
    case process.env.SA_ROLE_ID:
      return  "/pages/SA/create-role";
    case process.env.ADMIN_GROUP_ROLE_ID:
      return  "/pages/dashboard";
    default:
      //have error
      console.log("redirecting to denied page");
      return  "/pages/denied";
  }
}

export async function register(prevState, formData) {
  await connectToDb();
  const empNumber = formData.get("employeeNumber");
  const empName = formData.get("employeeName");
  const email = formData.get("email");
  const username = formData.get("username");
  const password = formData.get("password");
  const team = formData.get("team");

  const res = await fetch(`${nextConfig.host}/api/auth/register`, {
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
      team: team,
    }),
  });
  const data = await res.json();
  if (data.status === 500) {
    return { message: data.error };
  }

  return { message: "User registered successfully" };
}

export async function logout() {
  console.log("logging out")
  cookies().set("token", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("token")?.value;
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

export async function getRoleName(role_id) {
  await connectToDb();
  const role = await Role.findById(role_id);
  return role ? role.ROLE_NAME : "No role";
}
