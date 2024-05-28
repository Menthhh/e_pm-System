import { NextResponse } from 'next/server.js';
import { Job } from "@/lib/models/Job.js";
import { JobItem } from "@/lib/models/JobItem.js";
import { Machine } from "@/lib/models/Machine";
import { Workgroup } from "@/lib/models/Workgroup";
import { User } from "@/lib/models/User.js";
import { TestLocation } from "@/lib/models/TestLocation";
import { Status } from "@/lib/models/Status";

import mongoose from "mongoose";
const connection = {};
const db_url = process.env.MONGODB_URI;
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

export const GET = async (req, res) => {
    await connectToDb();
    const searchParams = req.nextUrl.searchParams;
    const JobID = searchParams.get("job_id");
    try {
        const job = await Job.findOne({ _id: JobID });
        const jobItems = await JobItem.find({ JOB_ID: JobID });
        const machine = await Machine.findOne({ _id: job.MACHINE_ID });
        const machineName = machine ? machine.MACHINE_NAME : null;
        const workgroup = await Workgroup.findOne({ _id: job.WORKGROUP_ID });
        const workgroupName = workgroup ? workgroup.WORKGROUP_NAME : null;
        const user = await User.findOne({ _id: job ? job.ACTIVATE_USER : null });
        const activatedBy = user ? user.EMP_NAME : null;
        const status = await Status.findOne({ _id: job.JOB_STATUS_ID });
        const statusName = status ? status.status_name : null;

        const jobData = {
            "JobID": JobID,
            "Status": statusName,
            "Timeout": job.TIMEOUT,
            "Name": job.JOB_NAME,
            "DocumentNo": job.DOC_NUMBER,
            "ChecklistVer": job.CHECKLIST_VERSION,
            "MachineName": machineName,
            "WDtag": job.WD_TAG,
            "WorkgroupName": workgroupName,
            "ActivatedBy": activatedBy,
            "ActivatedAt": job.createdAt.toLocaleString(),
            "LastestUpdate": job.updatedAt.toLocaleString(),
            "Status": statusName,
        }

        const jobItemData = await Promise.all(jobItems.map(async (jobItem) => {
            const location = await TestLocation.findById(jobItem.TEST_LOCATION_ID);

           
            return {
                "JobItemID": jobItem._id,
                "JobItemTitle": jobItem.JOB_ITEM_TITLE,
                "JobItemName": jobItem.JOB_ITEM_NAME,
                "UpperSpec": jobItem.UPPER_SPEC,
                "LowerSpec": jobItem.LOWER_SPEC,
                "TestMethod": jobItem.TEST_METHOD,
                "BeforeValue": jobItem.BEFORE_VALUE,
                "ActualValue": jobItem.ACTUAL_VALUE,
                "Comment": jobItem.COMMENT,
                "TestLocationName": location ? location.LocationName : "",
                "ExecuteDate": jobItem.EXECUTE_DATE,
                "LastestUpdate": jobItem.updatedAt.toLocaleString(),
            };
        }));

        return NextResponse.json({ status: 200, jobData: jobData, jobItemData: jobItemData });
    } catch (err) {
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }
};
