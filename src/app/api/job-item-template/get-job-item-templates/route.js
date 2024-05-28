

import { JobItemTemplate } from "@/lib/models/JobItemTemplate.js";
import { NextResponse } from 'next/server.js';
import { User } from "@/lib/models/User.js";
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
export const GET = async (req, res) => {
    await connectToDb();
    try {
        const jobItemTemplates = await JobItemTemplate.find({});
        const data = await Promise.all(jobItemTemplates.map(async jobItemTemplate => {
            const user = await User.findById(jobItemTemplate.AUTHOR_ID);
            const createdAt = new Date(jobItemTemplate.createdAt).toLocaleString();
            return {
                _id: jobItemTemplate._id,
                AUTHOR_ID: jobItemTemplate.AUTHOR_ID,
                AUTHOR_NAME: user ? user.EMP_NAME : "",
                JOB_ITEM_TEMPLATE_TITLE: jobItemTemplate.JOB_ITEM_TEMPLATE_TITLE,
                JOB_ITEM_TEMPLATE_NAME: jobItemTemplate.JOB_ITEM_TEMPLATE_NAME,
                UPPER_SPEC: jobItemTemplate.UPPER_SPEC,
                LOWER_SPEC: jobItemTemplate.LOWER_SPEC,
                TEST_METHOD: jobItemTemplate.TEST_METHOD,
                JOB_TEMPLATE_ID: jobItemTemplate.JOB_TEMPLATE_ID,
                createdAt: createdAt
            };
        }));
        return NextResponse.json({ status: 200, jobItemTemplates: data });
    } catch (err) {
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }
};

