import { connectToDb } from "@/lib/utils/utils.js";
import { User } from "@/lib/models/User.js";
import { Role } from "@/lib/models/Role.js";
import { NextResponse } from 'next/server';

export const POST = async (req, res) => {
    await connectToDb();
    const { user_id, role_id } = await req.json();
    try {
        const user = await User.findById(user_id);
        if (!user) {
            return NextResponse.json({ message: "User not found" });
        }
        const role = await Role.findById(role_id);
        if (!role) {
            return NextResponse.json({ message: "Role not found" });
        }
        user.ROLE = role._id;
        await user.save();
        return NextResponse.json({ message: "Role added to user", user });
    } catch (err) {
        return NextResponse.json({ message: "Role addition failed", file: __filename, error: err.message });
    }
};
