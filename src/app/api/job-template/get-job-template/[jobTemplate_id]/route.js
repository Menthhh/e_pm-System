import { connectToDb } from "@/lib/utils/utils.js";
import { JobTemplate } from "@/lib/models/JobTemplate.js";
import { NextResponse } from 'next/server';
import { Machine } from "@/lib/models/Machine";


export const GET = async (req, { params }) => {
    await connectToDb();
    const { jobTemplate_id } = params;

    try {
        const jobTemplate = await JobTemplate.findById(jobTemplate_id);
        const machines = await Machine.find({ _id: jobTemplate.MACHINE_ID });
        const machineName = machines.length > 0 ? machines[0].MACHINE_NAME : null;
        const createdAt = new Date(jobTemplate.createdAt).toLocaleString();
        const data = {
            _id: jobTemplate._id,
            AUTHOR_ID: jobTemplate.AUTHOR_ID,
            JOB_TEMPLATE_NAME: jobTemplate.JOB_TEMPLATE_NAME,
            DOC_NUMBER: jobTemplate.DOC_NUMBER,
            DUE_DATE: jobTemplate.DUE_DATE,
            CHECKLIST_VERSION: jobTemplate.CHECKLIST_VERSION,
            MACHINE_ID: jobTemplate.MACHINE_ID,
            MACHINE_NAME: machineName,
            WORKGROUP_ID: jobTemplate.WORKGROUP_ID,
            createdAt: createdAt,
        };
        
        return NextResponse.json({ status: 200, jobTemplate: data }); 
    }
    catch(err) {
        return NextResponse.json({status: 500, file: __filename, error: err.message});
    }
};


    

