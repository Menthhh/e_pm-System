// jobData: {
//     JobID: jobData.JobID,
//     wd_tag: wdTag,

import { Job } from "@/lib/models/Job";
import { JobItem } from "@/lib/models/JobItem";
import { connectToDb } from "@/lib/utils/utils";
import { NextResponse } from 'next/server';



export const PUT = async (req, res) => {
    await connectToDb();
    const body = await req.json();
    const { jobData, jobItemsData } = body;
    try {

        await Promise.all(jobItemsData.map(async (jobItemData) => {
           
            const jobItem = await JobItem.findOne({ _id: jobItemData.jobItemID });
            jobItem.ACTUAL_VALUE = jobItemData.value || jobItem.ACTUAL_VALUE;
            jobItem.COMMENT = jobItemData.Comment || jobItem.COMMENT;
            jobItem.BEFORE_VALUE = jobItemData.BeforeValue || jobItem.BEFORE_VALUE;
            await jobItem.save();
        }));

        const job = await Job.findOne({ _id: jobData.JobID });
        job.WD_TAG = jobData.wd_tag;
       

        await job.save();

        return NextResponse.json({ status: 200 });
    } catch (err) {
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }
};
