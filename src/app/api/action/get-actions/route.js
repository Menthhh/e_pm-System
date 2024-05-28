
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
    throw new Error(error);
  }
};
export const GET = async (req) => {
    await connectToDb();
    try {
        const actions = await Action.find();
        const data = actions.map((action) => ({
            _id: action._id,
            name: action.ACTION_NAME,
           
        }));
        return NextResponse.json({ actions:data , status: "200" });
    } catch (err) {
        return NextResponse.json({ message: "Read all actions failed", file: __filename, error: err.message });
    }
};
