import { connectToDb } from "@/lib/utils/utils.js";
import { NextResponse } from 'next/server.js';
import { Job } from "@/lib/models/Job.js";
import { JobItem } from "@/lib/models/JobItem.js";
import { Machine } from "@/lib/models/Machine";
import { Workgroup } from "@/lib/models/Workgroup";
import { User } from "@/lib/models/User.js";


export const GET = async (req, res) => {
    await connectToDb();
    const searchParams = req.nextUrl.searchParams;
    const JobID = searchParams.get("job_id");
    console.log(JobID)
    try {
        const job = await Job.findOne({ _id: JobID });
        console.log(job)
        const jobItems = await JobItem.find({ JOB_ID: JobID });
        const machine = await Machine.findOne({ _id: job.MACHINE_ID });
        const machineName = machine ? machine.MACHINE_NAME : null;
        const wd_tag = machine ? machine.WD_TAG : null;
        const workgroup = await Workgroup.findOne({ _id: job.WORKGROUP_ID });
        const workgroupName = workgroup ? workgroup.WORKGROUP_NAME : null;
        const user = await User.findOne({ _id: job ? job.ACTIVATE_USER : null });
        const activatedBy = user ? user.EMP_NAME : null;

        const jobData = {
            "JobID": JobID,
            "Status": job.JOB_STATUS_ID,
            "Timeout": job.TIMEOUT,
            "Name": job.JOB_NAME,
            "DocumentNo": job.DOC_NUMBER,
            "ChecklistVer": job.CHECKLIST_VERSION,
            "MachineName": machineName,
            "WDtag": wd_tag,
            "WorkgroupName": workgroupName,
            "ActivatedBy": activatedBy,
            "ActivatedAt": job.createdAt.toLocaleString(),
        }

        const jobItemData = 
        {
            "JobItems": jobItems.map(jobItem => {
                return {
                    "JobItemTitle" : jobItem.JOB_ITEM_TITLE,
                    "JobItemName": jobItem.JOB_ITEM_NAME,
                    "UpperSpec": jobItem.UPPER_SPEC,
                    "LowerSpec": jobItem.LOWER_SPEC,
                    "TestMethod": jobItem.TEST_METHOD,
                    "TestLocation": jobItem.TEST_LOCATION_ID,
                    "ActualValue": jobItem.ACTUAL_VALUE,
                    "Comment": jobItem.COMMENT,
                    "ExecuteDate": jobItem.EXECUTE_DATE,
                }
            })
        }
    

        return NextResponse.json({ status: 200, jobData: jobData, jobItemData: jobItemData });
    } catch (err) {
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }
};

