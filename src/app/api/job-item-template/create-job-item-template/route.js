
import { JobItemTemplate } from "../../../../lib/models/JobItemTemplate.js";
import { NextResponse } from 'next/server.js';

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
// import mongoose from 'mongoose';

// const jobItemTemplateSchema = new mongoose.Schema({
//     AUTHOR_ID: { type: String, required: true },
//     JOB_ITEM_TEMPLATE_TITLE: { type: String, required: true },
//     JOB_ITEM_TEMPLATE_NAME: { type: String, required: true },
//     UPPER_SPEC_LIMIT: { type: String, required: true },
//     LOWER_SPEC_LIMIT: { type: String, required: true },
//     TEST_METHOD: { type: String, required: true },
// }, { timestamps: true });

// export const JobItemTemplate = mongoose.models?.JobItemTemplate || mongoose.model('JobItemTemplate', jobItemTemplateSchema);




export const POST = async (req, res) => {
    await connectToDb();
    const body = await req.json();
    const {
        AUTHOR_ID,
        JOB_ITEM_TEMPLATE_TITLE,
        JOB_ITEM_TEMPLATE_NAME,
        UPPER_SPEC_LIMIT,
        LOWER_SPEC_LIMIT,
        TEST_METHOD,
        JOB_TEMPLATE_ID
    } = body;
    try {
        const jobItemTemplate = new JobItemTemplate({
            AUTHOR_ID,
            JOB_ITEM_TEMPLATE_TITLE,
            JOB_ITEM_TEMPLATE_NAME,
            UPPER_SPEC_LIMIT,
            LOWER_SPEC_LIMIT,
            TEST_METHOD,
            JOB_TEMPLATE_ID
        });
        await jobItemTemplate.save();

        return NextResponse.json({ status: 200, jobItemTemplate });
    }
    catch(err) {
        return NextResponse.json({status: 500, file: __filename, error: err.message});
    }
    
};
    

