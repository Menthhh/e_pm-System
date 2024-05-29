
import { User } from "@/lib/models/User.js";
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
export const POST = async (req, res) => {
    await connectToDb();
    const { workgroup_id, user_id } = await req.json();
    try {
        const workgroup = await Workgroup.findById(workgroup_id);
        if (!workgroup) {
            return NextResponse.json({ message: "Workgroup not found" });
        }
        const user = await User.findById(user_id);
        if (!user) {
            return NextResponse.json({ message: "User not found" });
        }
        workgroup.USER_LIST.push(user_id);
        
        await user.save();
        await workgroup.save();
        return NextResponse.json({ status:200, workgroup });
    } catch (err) {
        return NextResponse.json({status: 500, file: __filename, error: err.message});
    }
};
