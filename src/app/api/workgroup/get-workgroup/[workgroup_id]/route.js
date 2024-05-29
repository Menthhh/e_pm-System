
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
export const GET = async (req, {params}) => {
    await connectToDb();
    const { workgroup_id } = params;
    try {
        const workgroup = await Workgroup.findById(workgroup_id);
        if (!workgroup) {
            return NextResponse.json({ message: "Workgroup not found", file: __filename });
        }

        const data = {
            _id: workgroup._id,
            name: workgroup.WORKGROUP_NAME,
        }
        return NextResponse.json({ status: 200, workgroup:data });
    } catch (err) {
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }

};
