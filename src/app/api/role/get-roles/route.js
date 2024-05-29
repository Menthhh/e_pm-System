
import { Role } from "@/lib/models/Role.js";
import { NextResponse } from "next/server";
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
export const GET = async (req) => {
  await connectToDb();
  try {
    const roles = await Role.find();
    return NextResponse.json({ roles, status: 200 });
  } catch (err) {
    return NextResponse.json({
      message: "Read all roles failed",
      file: __filename,
      error: err.message,
      status: 500,
    });
  }
};
