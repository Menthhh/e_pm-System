import { connectToDb } from "@/lib/utils/utils.js";
import { Department } from "@/lib/models/Department.js";
import { NextResponse } from 'next/server';

export const DELETE = async (req, {params}) => {
    await connectToDb();
    const { department_id } = params;
    try {
        const department = await Department.findByIdAndDelete(department_id);
        if (!department) {
            return NextResponse.json({ message: "Department not found", file: __filename });
        }
        return NextResponse.json({ message: "Department deleted successfully", department });
    } catch (err) {
        return NextResponse.json({ message: "Department deletion failed", file: __filename, error: err.message });
    }

};
