// const body = {
//     STATUS_ID : "66430a7733d7f39b2f405178",
//     JOB_ID : job_id
// }

// const updateJobStatus = async () => {
//     try {
//         const response = await fetch(`${config.host}/api/job/update-job-status/${job_id}`, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(body)
//         });

//         if (!response.ok) {
//             console.log("Error:", response.statusText);
//         }
//     } catch (err) {
//         console.error("Error:", err);
//     }
// }

// updateJobStatus();
import { connectToDb } from "@/lib/utils/utils";
import { NextResponse } from 'next/server';
import { Job } from "@/lib/models/Job";



export const PUT = async (req, res) => {
    await connectToDb();
    const body = await req.json();
    const { STATUS_ID, JOB_ID } = body;
    try {
        const job = await Job.findOne({ _id: JOB_ID });
        job.JOB_STATUS_ID = STATUS_ID;
        await job.save();
        return NextResponse.json({ status: 200 });
    } catch (err) {
        console.error("Error occurred:", err); // Log the error
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }
}