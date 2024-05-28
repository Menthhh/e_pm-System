
import { JobTemplate } from "@/lib/models/JobTemplate.js";
import { NextResponse } from 'next/server';
import mongoose from "mongoose";
const db_url = process.env.MONGODB_URI;

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
    throw new Error(error);
  }
};

export const DELETE = async (req, res) => {
    await connectToDb();
    const body = await req.json();  
    const {jobTemplate_id} = body;

    try {
        //remove job item template where jobtemplateid = jobtemplateid 
        const approvers = await JobItemTemplate.deleteMany({ JOB_TEMPLATE_ID: jobTemplate_id });
        const jobItemTemplate = await JobItemTemplate.deleteMany({ JOB_TEMPLATE_ID: jobTemplate_id });
        const jobTemplate = await JobTemplate.findByIdAndDelete(jobTemplate_id);
        return NextResponse.json({ status: 200, jobTemplate });
    } catch (err) {
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }
};
    

