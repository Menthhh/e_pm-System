import { connectToDb } from "@/lib/utils/utils.js";
import { User } from "@/lib/models/User.js";
import { NextResponse } from 'next/server';

export const PUT = async (req, {params}) => {
    await connectToDb();
    const { user_id } = params;
    const body = await req.json();
    try {
        const user = await User.findOneAndUpdate({ _id: user_id }, { $set: body }, { new: true });
        if (!user) {
            return NextResponse.json({ message: "User not found", file: __filename });
        }
        return NextResponse.json({ message: "User updated successfully", user });
    } catch (err) {
        return NextResponse.json({ message: "User deletion failed", file: __filename, error: err.message});
    }

};
