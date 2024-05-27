
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
export const POST = async (req, res) => {
    await connectToDb();
    const body = await req.json();
    const { ROLE_NAME } = body;
    try {
        const role = await Role.create({ ROLE_NAME });
        return NextResponse.json({ message: "Role created successfully", role });
    } catch(err) {
        return NextResponse.json({ message: "Role creation failed", file: __filename, error: err.message });
    }
};
