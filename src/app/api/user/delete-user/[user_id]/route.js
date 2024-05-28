
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
    throw new Error(error);
  }
};
export const DELETE = async (req, {params}) => {
    await connectToDb();
    const { user_id } = params;
    try {
        const user = await User.findByIdAndDelete(user_id);
        if (!user) {
            return NextResponse.json({ message: "User not found", file: __filename });
        }
        return NextResponse.json({ status: 200, user });
    } catch (err) {
        return NextResponse.json({status: 500, file: __filename, error: err.message});
    }

};
