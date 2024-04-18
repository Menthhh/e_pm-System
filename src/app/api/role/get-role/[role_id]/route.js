import { connectToDb } from "@/lib/utils/utils.js";
import { Role } from "@/lib/models/Role.js";
import { NextResponse } from 'next/server';

export const GET = async (req, {params}) => {
    await connectToDb();
    const { role_id } = params;
    try {
        const role = await Role.findById(role_id);
        if (!role) {
            return NextResponse.json({ message: "Role not found", file: __filename });
        }
        return NextResponse.json({ message: "Role found", role });
    } catch (err) {
        return NextResponse.json({ message: "Role retrieval failed", file: __filename, error: err.message });
    }

};
