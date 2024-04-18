import { NextResponse } from "next/server.js";
import { updateSession } from "./lib/utils/utils.js";

export async function middleware(request) {
    console.log("middleware");
    await updateSession(request);
    return NextResponse.next();
}
