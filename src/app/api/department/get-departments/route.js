import { connectToDb } from "@/lib/utils/utils.js";
import { Department } from "@/lib/models/Department.js";
import { NextResponse } from 'next/server';

export const GET = async (req) => {
    await connectToDb();
    try {
        const departments = await Department.find();
        return NextResponse.json({ message: "Read all departments successful", departments });
    } catch (err) {
        return NextResponse.json({ message: "Read all departments failed", file: __filename, error: err.message });
    }
};
