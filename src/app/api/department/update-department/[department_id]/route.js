import { connectToDb } from "@/lib/utils/utils.js";
import { Department } from "@/lib/models/Department.js";
import { NextResponse } from 'next/server';

export const PUT = async (req, {params}) => {
    await connectToDb();
    const { department_id } = params;
    const body = await req.json();
    try {
        const department = await Department.findOneAndUpdate({ _id: department_id }, { $set: body }, { new: true });
        if (!department) {
            return NextResponse.json({ message: "Department not found", file: __filename });
        }
        return NextResponse.json({ message: "Department updated successfully", department });
    } catch (err) {
        return NextResponse.json({ message: "Department update failed", file: __filename, error: err.message });
    }

};
