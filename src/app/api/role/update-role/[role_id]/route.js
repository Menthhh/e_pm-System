
import { Role } from "@/lib/models/Role.js";
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
    const { role_id } = params;
    const body = await req.json();
    try {
        const role = await Role.findOneAndUpdate({ _id: role_id }, { $set: body }, { new: true });
        if (!role) {
            return NextResponse.json({ message: "Role not found", file: __filename });
        }
        return NextResponse.json({ message: "Role updated successfully", role });
    } catch (err) {
        return NextResponse.json({ message: "Role update failed", file: __filename, error: err.message });
    }

};
