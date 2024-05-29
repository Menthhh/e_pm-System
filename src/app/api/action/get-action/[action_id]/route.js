
import { Action } from "@/lib/models/Action.js";
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
export const GET = async (req, {params}) => {
    await connectToDb();
    const { action_id } = params;
    try {
        const action = await Action.findById(action_id);
        if (!action) {
            return NextResponse.json({ message: "Action not found", file: __filename });
        }
        return NextResponse.json({ message: "Action found", action });
    } catch (err) {
        return NextResponse.json({ message: "Action retrieval failed", file: __filename, error: err.message });
    }

};
