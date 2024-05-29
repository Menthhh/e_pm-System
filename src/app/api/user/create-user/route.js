
import {User} from "@/lib/models/User.js";
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
    const body = await req.json();
    const { EMP_NUMBER, EMP_NAME, USERNAME, TEAM, POSITION, EMAIL, SEC, PASSWORD } = body;
    try {
        const user = new User({
            EMP_NUMBER,
            EMP_NAME,
            USERNAME,
            TEAM,
            POSITION,
            EMAIL,
            SEC,
            PASSWORD
        });
        await user.save();
        return NextResponse.json({ status: 200, user });
    } catch(err) {
        return NextResponse.json({status: 500, file: __filename, error: err.message});
    }
};
