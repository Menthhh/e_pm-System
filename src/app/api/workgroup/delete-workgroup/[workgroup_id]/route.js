
import { Workgroup } from "@/lib/models/Workgroup.js";
import { User } from "@/lib/models/User.js";
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
export const DELETE = async (req, {params}) => {
    await connectToDb();
    const { workgroup_id } = params;
    try {
        const workgroup = await Workgroup.findByIdAndDelete(workgroup_id);
        // 1 user can be in multiple workgroups
        // 1 workgroup can have multiple users
        if (!workgroup) {
            return NextResponse.json({ message: "Workgroup not found", file: __filename });
        }
        return NextResponse.json({ message: "Workgroup deleted successfully", workgroup });
    } catch (err) {
        return NextResponse.json({ message: "Workgroup deletion failed", file: __filename, error: err.message });
    }

};
