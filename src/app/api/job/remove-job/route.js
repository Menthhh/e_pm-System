
import { NextResponse } from 'next/server.js';
import { JobTemplateActivate } from "@/lib/models/AE/JobTemplateActivate";
import { JobItemTemplateActivate } from "@/lib/models/AE/JobItemTemplateActivate.js";
import { Job } from "@/lib/models/Job.js";
import { JobItem } from "@/lib/models/JobItem.js";

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

export const DELETE = async (req, res) => {
    await connectToDb();
    const body = await req.json();  
    const { job_id } = body;

    try {
        const jobTemplateActivate = await JobTemplateActivate.findOneAndDelete({ JOB_ID: job_id });
        
        //find list of job_item_id from job_item where job_id = job_id
        const jobItems = await JobItem.find({ JOB_ID: job_id });
        //remove all job_item_template_activate where job_item_id equals to job_item_id
        jobItems.forEach(async (jobItem) => {
            await JobItemTemplateActivate.findOneAndDelete({ JOB_ITEM_ID: jobItem._id });
        });

        // Remove job items
        await JobItem.deleteMany({ JOB_ID: job_id });

        // Remove job
        const job = await Job.findByIdAndDelete(job_id);
        
        return NextResponse.json({ status: 200, job });
    } catch (err) {
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }
};

    

