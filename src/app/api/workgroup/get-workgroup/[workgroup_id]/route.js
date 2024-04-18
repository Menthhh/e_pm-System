import { connectToDb } from "@/lib/utils/utils.js";
import { Workgroup } from "@/lib/models/Workgroup.js";
import { NextResponse } from 'next/server';

export const GET = async (req, {params}) => {
    await connectToDb();
    const { workgroup_id } = params;
    try {
        const workgroup = await Workgroup.findById(workgroup_id);
        if (!workgroup) {
            return NextResponse.json({ message: "Workgroup not found", file: __filename });
        }
        return NextResponse.json({ message: "Workgroup found", workgroup });
    } catch (err) {
        return NextResponse.json({ message: "Workgroup retrieval failed", file: __filename, error: err.message });
    }

};
