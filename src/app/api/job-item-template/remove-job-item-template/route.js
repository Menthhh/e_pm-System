
import { JobItemTemplate } from "@/lib/models/JobItemTemplate.js";
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
    
  }
};

export const DELETE = async (req, res) => {
    await connectToDb();
    const body = await req.json();  
    const {jobItemTemplate_id} = body;

    try {
        const jobItemTemplate = await JobItemTemplate.findByIdAndDelete(jobItemTemplate_id);
        return NextResponse.json({ status: 200, jobItemTemplate });
    } catch (err) {
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }
};
    

