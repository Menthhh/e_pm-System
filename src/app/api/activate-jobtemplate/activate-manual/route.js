import { connectToDb } from "@/lib/utils/utils.js";
import { NextResponse } from 'next/server.js';
import { JobTemplateActivate } from "@/lib/models/AE/JobTemplateActivate";
import { JobItemTemplateActivate } from "@/lib/models/AE/JobItemTemplateActivate.js";
import { Approves } from "@/lib/models/Approves.js";
import { Job } from "@/lib/models/Job.js";
import { JobItem } from "@/lib/models/JobItem.js";
import { JobItemTemplate } from "@/lib/models/JobItemTemplate.js";
import { JobTemplate } from "@/lib/models/JobTemplate.js";


//1. update to jobtemplateactivate
//2. create job 
//3. update to jobitemtemplateactivate
//4. create job item
//5. update approves job id where JOB_TEMPLATE_ID = jobtemplate id and JobTemplateCreateID = jobtemplatecreateid and job_id = null

export const POST = async (req, res) => {
    await connectToDb();
    const body = await req.json();
    const {
        JobTemplateID,
        ACTIVATER_ID,
        JobTemplateCreateID,
    } = body;
    try {
        // const JobTemplateActivateSchema = new mongoose.Schema({
        //     JobTemplateID: { type: mongoose.Schema.Types.ObjectId, ref: "JobTemplate" },
        //     ACTIVATER_ID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        //     JobTemplateCreateID: { type: String, required: true },
        
        //     AUTHOR_ID: { type: String, required: true },
        //     JOB_TEMPLATE_NAME: { type: String, required: true },
        //     DOC_NUMBER: { type: String, required: true },
        //     DUE_DATE: { type: Date, required: true },
        //     CHECKLIST_VERSION: { type: String, required: true },
        //     MACHINE_ID: { type: String, required: true },
        //     WORKGROUP_ID: { type: String, required: true },
        //     JobTemplateCreateID: { type: String, required: true },
        // }, { timestamps: true });
        // Create JobTemplateActivate
        

        //find job templat where id = jobtemplateid
        const jobTemplate = await JobTemplate.findOne({ _id: JobTemplateID });
        console.log("jobTemplate", jobTemplate)

        const jobTemplateActivate = new JobTemplateActivate({
            JobTemplateID,
            ACTIVATER_ID,
            JobTemplateCreateID,
            AUTHOR_ID: jobTemplate.AUTHOR_ID,
            JOB_TEMPLATE_NAME: jobTemplate.JOB_TEMPLATE_NAME,
            DOC_NUMBER: jobTemplate.DOC_NUMBER,
            DUE_DATE: jobTemplate.DUE_DATE,
            CHECKLIST_VERSION: jobTemplate.CHECKLIST_VERSION,
            MACHINE_ID: jobTemplate.MACHINE_ID,
            WORKGROUP_ID: jobTemplate.WORKGROUP_ID,
        });
        await jobTemplateActivate.save();


        //fetch approvers where JOB_TEMPLATE_ID = jobtemplate id and JobTemplateCreateID = jobtemplatecreateid and job_id = null
        const approves = await Approves.find({ JOB_TEMPLATE_ID: JobTemplateID, JobTemplateCreateID });

        //create job and add each approver_id to JOB_APPROVERS
        const job = new Job({
            JOB_APPROVERS: approves.map(approve => approve.USER_ID),
            JobTemplateActiveID: jobTemplateActivate._id,
        });
        await job.save();

        // Fetch all job item templates related to the job template
        const jobItemTemplates = await JobItemTemplate.find({ JOB_TEMPLATE_ID: JobTemplateID, JobTemplateCreateID });

        // Create JobItemTemplateActivate and JobItem for each job item template
        const jobItemplateActivatePromises = jobItemTemplates.map(async (jobItemTemplate) => {
            const jobItemTemplateActivate = new JobItemTemplateActivate({
                JOB_ITEM_TEMPLATE_ID: jobItemTemplate._id,
                ACTIVATER_ID,
                JobItemTemplateCreateID: jobItemTemplate.JobItemTemplateCreateID
            });
            await jobItemTemplateActivate.save();

            // Create JobItem
            const jobItem = new JobItem({
                JOB_ID: job._id,
                JobItemTemplateActivate: jobItemTemplateActivate._id,
            });
            await jobItem.save();
        });

        // Wait for all jobItemplateActivatePromises to complete
        await Promise.all(jobItemplateActivatePromises);

      

        return NextResponse.json({ status: 200, jobTemplateActivate });
    } catch (err) {
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }
};

