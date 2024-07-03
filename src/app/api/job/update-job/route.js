// jobData: {
//     JobID: jobData.JobID,
//     wd_tag: wdTag,

import { JobItemTemplateActivate } from "@/lib/models/AE/JobItemTemplateActivate";
import { Job } from "@/lib/models/Job";
import { JobItem } from "@/lib/models/JobItem";
import { Status } from "@/lib/models/Status";
import { NextResponse } from 'next/server';
import { connectToDb } from "@/app/api/mongo/index.js";
import { getRevisionNo } from "@/lib/utils/utils";
import { User } from "@/lib/models/User";

export const PUT = async (req, res) => {
    await connectToDb();
    const body = await req.json();
    const { jobData, jobItemsData } = body;
    try {
        const job = await Job.findOne({ _id: jobData.JobID });
        const submitteduser = await User.findById(jobData.submittedBy);
        const latestDocNo = await getRevisionNo(job.DOC_NUMBER);
        if (latestDocNo.message){
            console.log("Doc number error")
            return NextResponse.json({ status: 455, message: latestDocNo.message });
        }
        else if (job.CHECKLIST_VERSION !== latestDocNo) {
            return NextResponse.json({ status: 455, message: "This Checklist does not has the latest revision" });
        }


        await Promise.all(jobItemsData.map(async (jobItemData) => {
            const jobItem = await JobItem.findOne({ _id: jobItemData.jobItemID });
            jobItem.ACTUAL_VALUE = jobItemData.value || jobItem.ACTUAL_VALUE;
            jobItem.COMMENT = jobItemData.Comment || jobItem.COMMENT;
            jobItem.BEFORE_VALUE = jobItem.BEFORE_VALUE || jobItemData.BeforeValue;
            await jobItem.save();

        }));

        await Promise.all(jobItemsData.map(async (jobItemData) => {
            const jobItemTemplateActivate = await JobItemTemplateActivate.findOne({ JOB_ITEM_ID: jobItemData.jobItemID });
            const jobItemTemplateId = jobItemTemplateActivate.JOB_ITEM_TEMPLATE_ID;
            const jobItemTemplatesAcivate = await JobItemTemplateActivate.find({ JOB_ITEM_TEMPLATE_ID: jobItemTemplateId });
            const jobItemTemplatesAcivateFiltered = jobItemTemplatesAcivate.filter((item) => !item.JOB_ITEM_ID.equals(jobItemData.jobItemID));
            for (const item of jobItemTemplatesAcivateFiltered) {
                const jobItemUpdate = await JobItem.findOne({ _id: item.JOB_ITEM_ID });
                if (!jobItemUpdate.ACTUAL_VALUE && !jobItemUpdate.BEFORE_VALUE) {
                    jobItemUpdate.BEFORE_VALUE = jobItemData.value;
                }

                if (jobItemUpdate.BEFORE_VALUE && jobItemUpdate.BEFORE_VALUE !== jobItemData.value && !jobItemUpdate.ACTUAL_VALUE) {
                    jobItemUpdate.BEFORE_VALUE = jobItemData.value;
                }

                await jobItemUpdate.save();
            }
        }))

        job.WD_TAG = jobData.wd_tag;
        const waiting_status = await Status.findOne({ status_name: 'waiting for approval' });
        job.JOB_STATUS_ID = waiting_status._id
        job.SUBMITTED_BY = submitteduser;
        
        await job.save();
        return NextResponse.json({ status: 200 });
    } catch (err) {
        console.error("Error occurred:", err); // Log the error
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }
};
