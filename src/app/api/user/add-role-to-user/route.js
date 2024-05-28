
import { User } from "@/lib/models/User.js";
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
    const { user_id, role_id } = body;
    try {
        const user = await User.findById(user_id);
        if (!user) {
            return NextResponse.json({ message: "User not found" });
        }
        const role = await Role.findById(role_id);
        if (!role) {
            return NextResponse.json({ message: "Role not found" });
        }
        const userHasRole = new UserHasRole({
            USER_ID: user_id,
            ROLE_ID: role_id,
        });
        await userHasRole.save();
        return NextResponse.json({ status: 200, userHasRole });
    } catch (err) {
        return NextResponse.json({status: 500, file: __filename, error: err.message});
    }
};
