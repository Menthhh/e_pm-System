import { connectToDb } from "@/lib/utils/utils";
import { JobTemplate } from "@/lib/models/JobTemplate";
import { JobTemplateActivate } from "@/lib/models/AE/JobTemplateActivate";
import { NextResponse } from 'next/server';

export const GET = async (req, { params }) => {
    await connectToDb();
    const { workgroup_id } = params;
    try {
        // Find all job templates that have the same workgroup_id
        const jobTemplates = await JobTemplate.find({ WORKGROUP_ID: workgroup_id });


       const jobActivated = await JobTemplateActivate.find();
       

       //filter if jobtemplate id not in jobactivated which consist of jobtemplate id then remove it
        const data = jobTemplates.filter(jobTemplate => !jobActivated.find(job => job.JOB_TEMPLATE_ID == jobTemplate._id));

        return NextResponse.json({ status: 200, jobTemplates: data });
    } catch (err) {
        return NextResponse.json({ status: 500, error: err.message });
    }
}
