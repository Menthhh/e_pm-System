// jobData: {
//     JobID: jobData.JobID,
//     wd_tag: wdTag,

import { JobItemTemplateActivate } from "@/lib/models/AE/JobItemTemplateActivate";
import { Job } from "@/lib/models/Job";
import { JobItem } from "@/lib/models/JobItem";
import { Status } from "@/lib/models/Status";

import { NextResponse } from 'next/server';

import mongoose from "mongoose";
const connection = {};

const connectToDb = async () => {
  console.log("Connecting to DB");
  try {
    if (connection.isConnected) {
      console.log("Using existing connection");
      return;
    }
    const db = await mongoose.connect(db_url);
    connection.isConnected = db.connections[0].readyState;
    console.log("New connection");
  } catch (error) {
    console.log(error);
  }
};

export const PUT = async (req, res) => {
    await connectToDb();
    const body = await req.json();
    const { jobData, jobItemsData } = body;
    try {
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
                //or has a before value but it IS NOT equa; to latest actual value
                if (jobItemUpdate.BEFORE_VALUE && jobItemUpdate.BEFORE_VALUE !== jobItemData.value && !jobItemUpdate.ACTUAL_VALUE) {
                    jobItemUpdate.BEFORE_VALUE = jobItemData.value;
                }
               
                await jobItemUpdate.save();
            }
        }) )

        const job = await Job.findOne({ _id: jobData.JobID });
        job.WD_TAG = jobData.wd_tag;
        const complete_status = await Status.findOne({ status_name: 'complete' });
        console.log(complete_status._id)
        job.JOB_STATUS_ID = complete_status._id
        await job.save();

        return NextResponse.json({ status: 200 });
    } catch (err) {
        console.error("Error occurred:", err); // Log the error
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }
};
