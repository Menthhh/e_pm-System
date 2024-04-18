import { connectToDb, getSession, login } from "@/lib/utils/utils.js";
import { User } from "@/lib/models/User.js";
import { NextResponse } from 'next/server';


export const POST = async (req, res) => {
    await connectToDb();
    const body = await req.json();
    const {username, password} = body;
   
    try {
        const user = await User.findOne({ USERNAME: username })
        if (!user) return NextResponse.json({ message: "User not found", file: __filename });

        let isPasswordMatch = false
        if (user.PASSWORD === password) {
            isPasswordMatch = true
        }

        if (!isPasswordMatch) return NextResponse.json({ message: "Password does not match", file: __filename });

        const user_id = user._id
        const session = await login(user_id)

        return NextResponse.json({ message: "User logged in successfully", session });
        
    } catch (err) {
        return NextResponse.json({ message: "User login failed", file: __filename, error: err.message });
    }
};
