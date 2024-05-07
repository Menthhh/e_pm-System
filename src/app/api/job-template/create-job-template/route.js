import { connectToDb } from "../../../../lib/utils/utils.js";
import { JobTemplate } from "../../../../lib/models/JobTemplate.js";
import { NextResponse } from 'next/server.js';
import { Approves } from "../../../../lib/models/Approves.js";


export const POST = async (req, res) => {
    await connectToDb();
    const body = await req.json();
    const {
        AUTHOR_ID,
        JOB_TEMPLATE_NAME,
        DOC_NUMBER,
        DUE_DATE,
        CHECKLIST_VERSION,
        MACHINE_ID,
        WORKGROUP_ID,
        APPROVERS_ID 
    } = body;
    try {
        const jobTemplate = new JobTemplate({
            AUTHOR_ID,
            JOB_TEMPLATE_NAME,
            DOC_NUMBER,
            DUE_DATE,
            CHECKLIST_VERSION,
            MACHINE_ID,
            WORKGROUP_ID
        });
        await jobTemplate.save();

        const approvers = APPROVERS_ID.map(approver => {
            return new Approves({
                JOB_TEMPLATE_ID: jobTemplate._id,
                USER_ID: approver
            });
        });
        await Approves.insertMany(approvers);

        return NextResponse.json({ status: 200, jobTemplate });
    }catch(err) {
        return NextResponse.json({status: 500, file: __filename, error: err.message});
    }
};
    

