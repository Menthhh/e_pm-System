import { connectToDb } from "@/lib/utils/utils.js";
import { Role } from "@/lib/models/Role.js";
import { NextResponse } from 'next/server';

export const GET = async (req) => {
    await connectToDb();
    try {
        const roles = await Role.find();
        return NextResponse.json({ message: "Read all roles successful", roles });
    } catch (err) {
        return NextResponse.json({ message: "Read all roles failed", file: __filename, error: err.message });
    }
};
