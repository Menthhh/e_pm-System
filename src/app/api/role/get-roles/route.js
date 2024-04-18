import { connectToDb } from "@/lib/utils/utils.js";
import { User } from "@/lib/models/User.js";
import { NextResponse } from 'next/server';

export const GET = async (req) => {
    await connectToDb();
    try {
        const users = await User.find();
        return NextResponse.json({ users, file: __filename});
    } catch (err) {
        return NextResponse.json({ message: "Read all users failed ", file: __filename, error: err.message});
    }
};
