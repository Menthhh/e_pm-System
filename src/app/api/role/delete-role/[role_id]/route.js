import { connectToDb } from "@/lib/utils/utils.js";
import { Role } from "@/lib/models/Role.js";
import { NextResponse } from 'next/server';

export const DELETE = async (req, {params}) => {
    await connectToDb();
    const { role_id } = params;
    try {
        await Role.findByIdAndDelete(role_id);
        return NextResponse.json({ message: "Role deleted successfully" });
    } catch (err) {
        return NextResponse.json({ message: "Role deletion failed", file: __filename, error: err.message });
    }

};
