
import { JobTemplate } from "@/lib/models/JobTemplate.js";
import { NextResponse } from 'next/server';
import { Machine } from "@/lib/models/Machine";
import { Approves } from "@/lib/models/Approves";
import { User } from "@/lib/models/User";
import { connectToDb } from "@/app/api/mongo/index.js";
export const dynamic = 'force-dynamic';
export const GET = async (req, { params }) => {
    await connectToDb();
    const { jobTemplate_id } = params;

    try {
        const jobTemplate = await JobTemplate.findById(jobTemplate_id);
        const machines = await Machine.find({ _id: jobTemplate.MACHINE_ID });
        const machineName = machines.length > 0 ? machines[0].MACHINE_NAME : null;
        const createdAt = new Date(jobTemplate.createdAt).toLocaleString();

        const approvers = await Approves.find({ JOB_TEMPLATE_ID: jobTemplate_id, JobTemplateCreateID: jobTemplate.JobTemplateCreateID});
        const approversUserID = approvers.map(approver => approver.USER_ID);
        const users = await Promise.all(approversUserID.map(async (approver) => {
            const user = await User.findOne({ _id: approver });
            return user;
        }));

        const data = {
            _id: jobTemplate._id,
            JobTemplateCreateID: jobTemplate.JobTemplateCreateID,
            AUTHOR_ID: jobTemplate.AUTHOR_ID,
            JOB_TEMPLATE_NAME: jobTemplate.JOB_TEMPLATE_NAME,
            DOC_NUMBER: jobTemplate.DOC_NUMBER,
            DUE_DATE: jobTemplate.DUE_DATE,
            CHECKLIST_VERSION: jobTemplate.CHECKLIST_VERSION,
            MACHINE_ID: jobTemplate.MACHINE_ID,
            MACHINE_NAME: machineName,
            WORKGROUP_ID: jobTemplate.WORKGROUP_ID,
            JobTemplateCreateID: jobTemplate.JobTemplateCreateID,
            TIMEOUT: jobTemplate.TIMEOUT,
            createdAt: createdAt,
            ApproverList: users,

        };
        
        return NextResponse.json({ status: 200, jobTemplate: data }); 
    }
    catch(err) {
        return NextResponse.json({status: 500, file: __filename, error: err.message});
    }
};


    

