
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
    
  }
};
export const PUT = async (req, {params}) => {
    await connectToDb();
    const { workgroup_id } = params;
    const body = await req.json();
    try {
        const workgroup = await Workgroup.findOneAndUpdate({ _id: workgroup_id }, { $set: body }, { new: true });
        if (!workgroup) {
            return NextResponse.json({ message: "Workgroup not found", file: __filename });
        }
        return NextResponse.json({ message: "Workgroup updated successfully", workgroup });
    } catch (err) {
        return NextResponse.json({ message: "Workgroup update failed", file: __filename, error: err.message });
    }
};
