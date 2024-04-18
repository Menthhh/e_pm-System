import { connectToDb } from "@/lib/utils/utils.js";
import { Department } from "@/lib/models/Department.js";
import { NextResponse } from 'next/server';

export const GET = async (req, {params}) => {
    await connectToDb();
    const { department_id } = params;
    try {
        const department = await Department.findById(department_id);
        if (!department) {
            return NextResponse.json({ message: "Department not found", file: __filename });
        }
        return NextResponse.json({ message: "Department found", department });
    } catch (err) {
        return NextResponse.json({ message: "Department retrieval failed", file: __filename, error: err.message });
    }

};
