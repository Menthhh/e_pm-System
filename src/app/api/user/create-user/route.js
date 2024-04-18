import { connectToDb } from "@/lib/utils/utils.js";
import {User} from "@/lib/models/User.js";
import { NextResponse } from 'next/server';

export const POST = async (req, res) => {
    await connectToDb();
    const body = await req.json();
    const { EMP_NUMBER, EMP_NAME, TEAM, POSITION, EMAIL, SEC, PASSWORD } = body;
    try {
        const user = new User({
            EMP_NUMBER,
            EMP_NAME,
            TEAM,
            POSITION,
            EMAIL,
            SEC,
            PASSWORD
        });
        await user.save();
        return NextResponse.json({ message: "User created successfully", file: __filename});
    } catch(err) {
        return NextResponse.json({ message: "User creation failed", file: __filename, error: err.message});
    }
};
