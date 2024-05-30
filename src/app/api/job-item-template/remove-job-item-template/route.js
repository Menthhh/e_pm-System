
import { JobItemTemplate } from "@/lib/models/JobItemTemplate.js";
import { NextResponse } from 'next/server';
import { connectToDb } from "@/app/api/mongo/index.js";

export const DELETE = async (req, res) => {
    await connectToDb();
    const body = await req.json();  
    const {jobItemTemplate_id} = body;

    try {
        const jobItemTemplate = await JobItemTemplate.findByIdAndDelete(jobItemTemplate_id);
        return NextResponse.json({ status: 200, jobItemTemplate });
    } catch (err) {
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }
};
    

