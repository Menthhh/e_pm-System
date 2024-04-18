import { getSession, login } from "@/lib/utils/utils.js";
import { NextResponse } from 'next/server';


export const GET = async (req, res) => {
    const session = await getSession();
   
    try {
        if (!session) {
            return NextResponse.json({ message: "User not logged in", file: __filename });
        }
        return NextResponse.json({ message: "User logged in", session });
        
    } catch (err) {
        return NextResponse.json({ message: "Get session failed", file: __filename, error: err.message });
    }
};
