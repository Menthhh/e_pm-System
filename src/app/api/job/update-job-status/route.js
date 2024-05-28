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

import { NextResponse } from 'next/server';
import { Job } from "@/lib/models/Job";
import { Status } from "@/lib/models/Status";

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
    const { JOB_ID } = body;
    try {
        const job = await Job.findOne({ _id: JOB_ID });
        const ongoing_status = await Status.findOne({ status_name: 'ongoing' });
        job.JOB_STATUS_ID = ongoing_status._id;
        await job.save();
        return NextResponse.json({ status: 200 });
    } catch (err) {
        console.error("Error occurred:", err); // Log the error
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }
}