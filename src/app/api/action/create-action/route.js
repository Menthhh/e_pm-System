
import { Action } from "@/lib/models/Action.js";
import { NextResponse } from 'next/server';
import mongoose from "mongoose";

const connection = {};
const db_url = process.env.MONGODB_URI;

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
    const { ACTION_NAME } = body;
    try {
        const action = await Action.create({ ACTION_NAME });
        return NextResponse.json({ message: "Action created successfully", action });
    } catch(err) {
        return NextResponse.json({ message: "Action creation failed", file: __filename, error: err.message });
    }
};
