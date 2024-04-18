import { connectToDb } from "@/lib/utils/utils.js";
import { Workgroup } from "@/lib/models/Workgroup.js";
import { NextResponse } from 'next/server';

export const DELETE = async (req, {params}) => {
    await connectToDb();
    const { workgroup_id } = params;
    try {
        const workgroup = await Workgroup.findByIdAndDelete(workgroup_id);
        if (!workgroup) {
            return NextResponse.json({ message: "Workgroup not found", file: __filename });
        }
        return NextResponse.json({ message: "Workgroup deleted successfully", workgroup });
    } catch (err) {
        return NextResponse.json({ message: "Workgroup deletion failed", file: __filename, error: err.message });
    }

};
