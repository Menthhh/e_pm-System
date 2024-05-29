import { User } from '@/lib/models/User.js';
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
  const {
    emp_number,
    emp_name,
    email,
    username,
    password,
    team
  } = await req.json();

  try {
    const user = new User({
      EMP_NUMBER: emp_number,
      EMP_NAME: emp_name,
      EMAIL: email,
      USERNAME: username,
      PASSWORD: password,
      TEAM: team
    });

    await user.save();
    return NextResponse.json({ status: 200, message: 'User created successfully', user })
  } catch (err) {
    return NextResponse.json({ status: 500, file: __filename, error: err.message });
  }
}

