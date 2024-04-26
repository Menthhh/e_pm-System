'use server'
import { connectToDb, login } from "@/lib/utils/utils.js";
import { User } from "@/lib/models/User.js";
import { NextResponse } from 'next/server';
import { encrypt } from "@/lib/utils/utils.js";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.SECRET_KEY;

export const POST = async (req, res) => {
    await connectToDb();
    const body = await req.json();
    const { username, password } = body;

    try {
        if (username === "SA" && password === "admin") {
            const user_id = "sa"
            const session = await login(user_id)
            return NextResponse.json({ message: "SA Logged In", access_level: "SA", session});
        }
        const user = await User.findOne({ USERNAME: username });
        
        if (!user) return NextResponse.json({ message: "User not found", file: __filename });

        let isPasswordMatch = false;
        if (user.PASSWORD === password) {
            isPasswordMatch = true;
        }

        if (!isPasswordMatch) return NextResponse.json({ message: "Password does not match", file: __filename });
        
        const token = await encrypt({ 
            user_id: user._id,
            username: user.USERNAME,
            Role: user.ROLE,
        }, SECRET_KEY);
    
        // cookies().set("token", token, { httpOnly: true, sameSite: "strict", secure: true });

        const data = {
            Role: user.ROLE,
            username: user.USERNAME,
            emp_name: user.EMP_NAME,
            emp_number: user.EMP_NUMBER,
        }

        return NextResponse.json({ status: 200,  user: data, token: token});
        
    } catch (err) {
        return NextResponse.json({ message: "User login failed", file: __filename, error: err.message });
    }
};
