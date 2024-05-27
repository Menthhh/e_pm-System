"use server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { config } from "../../config/config.js";

const secretKey = process.env.SECRET_KEY;
const key = new TextEncoder().encode(secretKey);


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

  const res = await fetch(`${config.host}/api/auth/login`, {
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
    if (!data.user.Role) {
      return { message: "User is not assigned role." };
    }
    const path = routing(data.user.Role);
    redirect(path);

  } else{
    return { message: "Wrong credential Please try again" };
  }
}

const routing = (role_id) => {
  switch (role_id) {
    case process.env.SA_ROLE_ID:
      return "/pages/SA/create-role";
    default:
      return "/pages/dashboard";
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

  const res = await fetch(`${config.host}/api/auth/register`, {
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



