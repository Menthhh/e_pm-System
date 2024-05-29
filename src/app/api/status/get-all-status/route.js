import { Status } from "@/lib/models/Status";
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


export const GET = async (req, res) => {
    await connectToDb();
    try {
        const status = await Status.find();
        return NextResponse.json({ status: 200, status });
    } catch (error) {
        return NextResponse.json({ status: 500, error: error.message });
    }
}
