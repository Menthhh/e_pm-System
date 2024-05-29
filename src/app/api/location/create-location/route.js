import { TestLocation } from "@/lib/models/TestLocation.js";
import { NextResponse } from 'next/server.js';
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
    const {
        LocationName,
        LocationTitle
    } = body;
    try {
        const testLocation = new TestLocation({
            LocationName,
            LocationTitle
        });
        
        await testLocation.save();

        return NextResponse.json({ status: 200, testLocation });
    }
    catch(err) {
        return NextResponse.json({status: 500, file: __filename, error: err.message});
    }
     
};
    

