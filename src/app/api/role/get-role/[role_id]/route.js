
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
    throw new Error(error);
  }
};
export const GET = async (req, {params}) => {
    await connectToDb();
    const { role_id } = params;
    try {
        const role = await Role.findById(role_id);
        if (!role) {
            return NextResponse.json({ message: "Role not found", file: __filename });
        }
        return NextResponse.json({ message: "Role found", name: role.ROLE_NAME, _id: role._id, actionList: role.ACTION_LIST});
    } catch (err) {
        return NextResponse.json({ message: "Role retrieval failed", file: __filename, error: err.message });
    }

};
