import { connectToDb } from "@/lib/utils/utils.js";
import { Role } from "@/lib/models/Role.js";
import { NextResponse } from 'next/server';


export const POST = async (req, res) => {
    await connectToDb();
    const body = await req.json();
    const { ROLE_NAME } = body;
    try {
        const role = await Role.create({ ROLE_NAME });
        return NextResponse.json({ message: "Role created successfully", role });
    } catch(err) {
        return NextResponse.json({ message: "Role creation failed", file: __filename, error: err.message });
    }
};
