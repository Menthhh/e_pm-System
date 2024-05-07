import { connectToDb } from "@/lib/utils/utils.js";
import { JobTemplate } from "@/lib/models/JobTemplate.js";
import { NextResponse } from 'next/server';


export const DELETE = async (req, res) => {
    await connectToDb();
    const body = await req.json();  
    const {jobTemplate_id} = body;

    try {
        const jobTemplate = await JobTemplate.findByIdAndDelete(jobTemplate_id);
        return NextResponse.json({ status: 200, jobTemplate });
    } catch (err) {
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }
};
    

