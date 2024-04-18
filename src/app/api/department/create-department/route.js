import { connectToDb } from "@/lib/utils/utils.js";
import { Department } from "@/lib/models/Department.js";
import { NextResponse } from 'next/server';

export const POST = async (req, res) => {
    await connectToDb();
    const body = await req.json();
    const { DEPARTMENT_NAME } = body;
    try {
        const department = await Department.create({ DEPARTMENT_NAME });
        return NextResponse.json({ message: "Department created successfully", department });
    } catch(err) {
        return NextResponse.json({ message: "Department creation failed", file: __filename, error: err.message });
    }
};
