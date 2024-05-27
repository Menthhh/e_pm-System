// {
//     "activationDate": "2024-05-28",
//     "recurrence": "daily",
//     "jobTemplateID": "6645834c66167e4286abad6e",
//     "jobTemplateCreateID": "18f7f88e15c-e357ef12d244b",
//     "ACTIVATER_ID": "6632fae0a67bf44b884f39be"
// }
// import mongoose from "mongoose";

// const JobTemplateActivateSchema = new mongoose.Schema({
//     JobTemplateID: { type: mongoose.Schema.Types.ObjectId, ref: "JobTemplate" },
//     JobTemplateCreateID: { type: String, required: true },
//     JOB_ID: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
//     RECURRING_TYPE: { type: String, default: null }
// }, { timestamps: true });

// export const JobTemplateActivate = mongoose.models?.JobTemplateActivate || mongoose.model("JobTemplateActivate", JobTemplateActivateSchema);

    
import { connectToDb } from "@/lib/utils/utils.js";
import { NextResponse } from 'next/server.js';
import { JobTemplateActivate } from "@/lib/models/AE/JobTemplateActivate";
import { JobItemTemplateActivate } from "@/lib/models/AE/JobItemTemplateActivate.js";
import { Approves } from "@/lib/models/Approves.js";
import { Job } from "@/lib/models/Job.js";
import { JobItem } from "@/lib/models/JobItem.js";
import { JobItemTemplate } from "@/lib/models/JobItemTemplate.js";
import { JobTemplate } from "@/lib/models/JobTemplate.js";
import { Status } from "@/lib/models/Status";


export const POST = async (req, res) => {
    await connectToDb();
    const body = await req.json();
    
    const {
        activationDate,
        recurrence,
        jobTemplateID,
        jobTemplateCreateID,
        ACTIVATER_ID,
        endDate,
    } = body;
    
    try {
        // Find the job template
        const jobTemplate = await JobTemplate.findOne({ _id: jobTemplateID, JobTemplateCreateID: jobTemplateCreateID });
        if (!jobTemplate) {
            return NextResponse.json({ status: 404, file: __filename, error: "Job template not found" });
        }

        // Find the approvers
        const approvers = await Approves.find({ JOB_TEMPLATE_ID: jobTemplateID, JobTemplateCreateID: jobTemplateID });
        if (!approvers) {
            return NextResponse.json({ status: 404, file: __filename, error: "Approvers not found" });
        }

        // Find the plan status
        const planID = await Status.findOne({ status_name: "plan" });
        if (!planID) {
            return NextResponse.json({ status: 404, file: __filename, error: "Status not found" });
        }

        // Calculate the end date based on the recurrence type
        let endDateObj;
        if (recurrence && endDate) {
            endDateObj = new Date(endDate); // Convert endDate to a Date object
        }

        // Activate jobs until the end date based on the recurrence type
        let currentDate = new Date(activationDate);
        while (!endDateObj || currentDate <= endDateObj) {
            // Create a new job
            const AdvanceActivationDate = new Date(currentDate);
            const job = new Job({
                JOB_NAME: jobTemplate.JOB_TEMPLATE_NAME,
                JOB_STATUS_ID: planID._id,
                DOC_NUMBER: jobTemplate.DOC_NUMBER,
                CHECKLIST_VERSION: jobTemplate.CHECKLIST_VERSION,
                WORKGROUP_ID: jobTemplate.WORKGROUP_ID,
                ACTIVATE_USER: ACTIVATER_ID,
                JOB_APPROVERS: approvers.map((approver) => approver.USER_ID),
                TIMEOUT: jobTemplate.TIMEOUT,
                createdAt: AdvanceActivationDate
            });
            await job.save();

            // Update job template activate
            const jobTemplateActivate = new JobTemplateActivate({
                JobTemplateID: jobTemplate._id,
                JobTemplateCreateID: jobTemplateCreateID,
                JOB_ID: job._id,
                RECURRING_TYPE: recurrence,
                createdAt: AdvanceActivationDate
            });
            await jobTemplateActivate.save();

            // Create job items
            const jobItemTemplates = await JobItemTemplate.find({ JOB_TEMPLATE_ID: jobTemplateID});
            if (!jobItemTemplates) {
                return NextResponse.json({ status: 404, file: __filename, error: "Job item templates not found" });
            }

            await Promise.all(jobItemTemplates.map(async (jobItemTemplate) => {
                const jobItem = new JobItem({
                    JOB_ID: job._id,
                    JOB_ITEM_TITLE: jobItemTemplate.JOB_ITEM_TEMPLATE_TITLE,
                    JOB_ITEM_NAME: jobItemTemplate.JOB_ITEM_TEMPLATE_NAME,
                    UPPER_SPEC: jobItemTemplate.UPPER_SPEC,
                    LOWER_SPEC: jobItemTemplate.LOWER_SPEC,
                    TEST_METHOD: jobItemTemplate.TEST_METHOD,
                    TEST_LOCATION_ID: jobItemTemplate.TEST_LOCATION_ID,
                    JOB_ITEM_TEMPLATE_ID: jobItemTemplate._id,
                    createdAt: AdvanceActivationDate
                });
                await jobItem.save();

                // Update job item template activate
                const jobItemTemplateActivate = new JobItemTemplateActivate({
                    JOB_ITEM_TEMPLATE_ID: jobItemTemplate._id,
                    JobItemTemplateCreateID: jobItemTemplate.JobItemTemplateCreateID,
                    JOB_ITEM_ID: jobItem._id,
                    createdAt: AdvanceActivationDate
                });
                await jobItemTemplateActivate.save();
            }));

            // Increment currentDate based on the recurrence type
            if (recurrence === 'daily') {
                currentDate.setDate(currentDate.getDate() + 1); // Add one day for daily recurrence
            } else if (recurrence === 'weekly') {
                currentDate.setDate(currentDate.getDate() + 7); // Add seven days for weekly recurrence
            } else if (recurrence === 'monthly') {
                currentDate.setMonth(currentDate.getMonth() + 1); // Add one month for monthly recurrence
            } else if (recurrence === 'yearly') {
                currentDate.setFullYear(currentDate.getFullYear() + 1); // Add one year for yearly recurrence
            } else {
                break; // If recurrence type is not specified or invalid, exit the loop
            }
        }

        return NextResponse.json({ status: 200, message: 'Jobs activated successfully' });
    } catch (err) {
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }
};
