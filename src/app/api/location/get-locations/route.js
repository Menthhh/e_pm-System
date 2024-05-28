import { connectToDb } from "@/lib/utils/utils.js";
import { TestLocation } from "@/lib/models/TestLocation.js";
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


export const GET = async (req, res) => {
    await connectToDb();
    try {
        const locations = await TestLocation.find();
        return NextResponse.json({ status: 200, locations });
    }
    catch(err) {
        return NextResponse.json({status: 500, file: __filename, error: err.message});
    }
};
    

