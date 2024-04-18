import { connectToDb } from "@/lib/utils/utils.js";
import { User } from "@/lib/models/User.js";
import { NextResponse } from 'next/server';

export const GET = async (req, {params}) => {
    await connectToDb();
    const { user_id } = params;
    try {
        const user = await User.findById(user_id);
        return NextResponse.json({ user, file: __filename});
    } catch (err) {
        return NextResponse.json({ message: "User deletion failed", file: __filename, error: err.message});
    }

};
