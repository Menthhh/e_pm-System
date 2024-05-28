
import { Job } from "@/lib/models/Job";
import { NextResponse } from 'next/server';

import { Status } from "@/lib/models/Status";
import { addHours, addDays, addMonths } from 'date-fns';

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

const convertTimeout = async (timeout, createdAt) => {
    const startDate = new Date(createdAt);
    switch (timeout) {
        case "12 hrs":
            return addHours(startDate, 12);
        case "1 days":
            return addDays(startDate, 1);
        case "7 days":
            return addDays(startDate, 7);
        case "15 days":
            return addDays(startDate, 15);
        case "30 days":
            return addDays(startDate, 30);
        case "3 months":
            return addMonths(startDate, 3);
        case "6 months":
            return addMonths(startDate, 6);
        case "12 months":
            return addMonths(startDate, 12);
        default:
            return addHours(startDate, 12);
    }
}

export const GET = async (req, res) => {
    await connectToDb();

    try {
        const jobs = await Job.find();
        const now = new Date();

        const overdueStatus = await Status.findOne({ status_name: 'overdue' });
        const newStatus = await Status.findOne({ status_name: 'new' });

        const activaterPromises = jobs.map(async (job) => {
            const status = await Status.findOne({ _id: job.JOB_STATUS_ID });
            const statusName = status?.status_name || 'Unknown';

            const jobCreationTime = new Date(job.createdAt);
            const jobExpiryTime = await convertTimeout(job.TIMEOUT, job.createdAt);

            //check if job is overdue
            if (now > jobExpiryTime && statusName !== 'overdue') {
                job.JOB_STATUS_ID = overdueStatus._id;
                await job.save();
            }

            //change if job status is plan and its created date is equal to today date then change status to new
            if (statusName === 'plan' && jobCreationTime.toDateString() === now.toDateString()) {
                job.JOB_STATUS_ID = newStatus._id;
                await job.save();
            }

            const finalStatus = await  Status.findOne({ _id: job.JOB_STATUS_ID });
            const finalStatusName = finalStatus?.status_name || 'Unknown';

            return {
                jobID: job._id,
                jobName: job.JOB_NAME,
                STATUS_NAME: finalStatusName
            };
        });

        let jobsWithActivater = await Promise.all(activaterPromises);

        return NextResponse.json({ status: 200, jobs: jobsWithActivater });
    } catch (err) {
        return NextResponse.json({ status: 500, error: err.message });
    }
}
