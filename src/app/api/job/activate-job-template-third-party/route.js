import { connectToDb } from "@/lib/utils/utils.js";
import { NextResponse } from 'next/server.js';
import { JobTemplateActivate } from "@/lib/models/AE/JobTemplateActivate";
import { JobItemTemplateActivate } from "@/lib/models/AE/JobItemTemplateActivate.js";
import { Approves } from "@/lib/models/Approves.js";
import { Job } from "@/lib/models/Job.js";
import { JobItem } from "@/lib/models/JobItem.js";
import { JobItemTemplate } from "@/lib/models/JobItemTemplate.js";
import { JobTemplate } from "@/lib/models/JobTemplate.js";
import { NextRequest } from "next/server.js";
import { Workgroup } from "@/lib/models/Workgroup";
import { Machine } from "@/lib/models/Machine";
import { User } from "@/lib/models/User";
import { config } from "@/config/config.js";

export const GET = async (req, res) => {
    await connectToDb();
    const searchParams = req.nextUrl.searchParams;
    const JobTemplateID = searchParams.get("jobTemID");
    const JobTemplateCreateID = searchParams.get("jobTemCreateID");
    const ACTIVATER_ID = searchParams.get("actID");


    try {
        //1 create job
        //1.1 find job template where jobtemplateid = jobtemplateid and jobtemplatecreateid = jobtemplatecreateid
        const jobTemplate = await JobTemplate.findOne({ _id: JobTemplateID, JobTemplateCreateID: JobTemplateCreateID });
        if (!jobTemplate) {
            return NextResponse.json({ status: 404, file: __filename, error: "Job template not found" });
        }
        //1.2 find approvers where jobtemplateid = jobtemplateid and jobtemplatecreateid = jobtemplatecreateid  1 job template can have multiple approvers
        const approvers = await Approves.find({ JobTemplateID: JobTemplateID, JobTemplateCreateID: JobTemplateCreateID });
        if (!approvers) {
            return NextResponse.json({ status: 404, file: __filename, error: "Approvers not found" });
        }
        //1.3 create job
        const job = new Job({
            JOB_NAME: jobTemplate.JOB_TEMPLATE_NAME,
            DOC_NUMBER: jobTemplate.DOC_NUMBER,
            CHECKLIST_VERSION: jobTemplate.CHECKLIST_VERSION,
            MACHINE_ID: jobTemplate.MACHINE_ID,
            WORKGROUP_ID: jobTemplate.WORKGROUP_ID,
            ACTIVATE_USER: ACTIVATER_ID,
            JOB_APPROVERS: approvers.map((approver) => approver.USER_ID),
        });
        await job.save();

        //2 update to jobtemplateactivate
        console.log("jobID", jobTemplate._id);
        const jobTemplateActivate = new JobTemplateActivate({
            JobTemplateID: jobTemplate._id,
            JobTemplateCreateID: JobTemplateCreateID,
            JOB_ID: job._id,
        });
        await jobTemplateActivate.save();

        //3 create job item
        //3.1 find job item template where jobtemplateid = jobtemplateid and jobtemplatecreateid = jobtemplatecreateid
        const jobItemTemplates = await JobItemTemplate.find({ JOB_TEMPLATE_ID: JobTemplateID, JobTemplateCreateID: JobTemplateCreateID });
        if (!jobItemTemplates) {
            return NextResponse.json({ status: 404, file: __filename, error: "Job item templates not found" });
        }

        //3.2 create job item
        for (const jobItemTemplate of jobItemTemplates) {
            const jobItem = new JobItem({
                JOB_ID: job._id,
                JOB_ITEM_TITLE: jobItemTemplate.JOB_ITEM_TEMPLATE_TITLE,
                JOB_ITEM_NAME: jobItemTemplate.JOB_ITEM_TEMPLATE_NAME,
                UPPER_SPEC: jobItemTemplate.UPPER_SPEC,
                LOWER_SPEC: jobItemTemplate.LOWER_SPEC,
                TEST_METHOD: jobItemTemplate.TEST_METHOD,
            });
            await jobItem.save();
            //4 update approves jobitemtemplateactivate
            const jobItemTemplateActivate = new JobItemTemplateActivate({
                JOB_ITEM_TEMPLATE_ID: jobItemTemplate._id,
                JobItemTemplateCreateID: jobItemTemplate.JobItemTemplateCreateID,
                JOB_ITEM_ID: jobItem._id,
            });
            await jobItemTemplateActivate.save();
        }
        const link = `${config.host}/api/job/get-job-value?job_id=${job._id}`;
        return NextResponse.json({ status: 200, JobID: job._id, ToSeeData: link});
    } catch (err) {
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }
};

