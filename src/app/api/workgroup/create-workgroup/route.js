import { connectToDb } from "@/lib/utils/utils.js";
import { Workgroup } from "@/lib/models/Workgroup.js";
import { NextResponse } from 'next/server';

export const POST = async (req, res) => {
    await connectToDb();
    const body = await req.json();
    const { WORKGROUP_NAME } = body;
    try {
        const workgroup = await Workgroup.create({ WORKGROUP_NAME });
        return NextResponse.json({ message: "Workgroup created successfully", workgroup });
    } catch(err) {
        return NextResponse.json({ message: "Workgroup creation failed", file: __filename, error: err.message });
    }
};
