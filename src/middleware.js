import { redirect, NextResponse } from "next/server.js";
import { getSession, updateSession } from "./lib/utils/utils.js";

export async function middleware(request) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/auth/login" || pathname === "/api/auth/register") {
        return NextResponse.next();
    }
    try {
        const session = await getSession(request);
        if (session.message === "Session not found") {
            return NextResponse.json({ message: "User not logged in"});
        }
        return NextResponse.next();
    } catch (error) {
        console.error("JWTExpired:", error.message);
        return NextResponse.json({ message: "Session has expired" }, { status: 401 });
    }
}
