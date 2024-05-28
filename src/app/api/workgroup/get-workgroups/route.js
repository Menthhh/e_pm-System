
import { Workgroup } from "@/lib/models/Workgroup.js";
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
export const GET = async (req) => {
    await connectToDb();
    try {
        const workgroups = await Workgroup.find();
        return NextResponse.json({ message: "Read all workgroups successful", workgroups });
    } catch (err) {
        return NextResponse.json({ message: "Read all workgroups failed", file: __filename, error: err.message });
    }
};
