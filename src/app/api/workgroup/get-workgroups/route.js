import { connectToDb } from "@/lib/utils/utils.js";
import { Workgroup } from "@/lib/models/Workgroup.js";
import { NextResponse } from 'next/server';

export const GET = async (req) => {
    await connectToDb();
    try {
        const workgroups = await Workgroup.find();
        return NextResponse.json({ message: "Read all workgroups successful", workgroups });
    } catch (err) {
        return NextResponse.json({ message: "Read all workgroups failed", file: __filename, error: err.message });
    }
};
