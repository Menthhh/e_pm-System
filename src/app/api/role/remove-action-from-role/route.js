
import { NextResponse } from "next/server";
import { RoleHasAction } from "@/lib/models/RoleHasAction";
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
export const DELETE = async (req, res) => {
  await connectToDb();
  const body = await req.json();
  const { role_id, actions_id } = body;

  try {
    const removeRoleHasAction = actions_id.map(async (action_id) => {
      await RoleHasAction.deleteOne({ ROLE_ID: role_id, ACTION_ID: action_id });
    });
    return NextResponse.json({ status: 200 });
  } catch (err) {
    return NextResponse.json({
      message: "Action removal from role failed",
      file: __filename,
      error: err.message,
      status: 500,
    });
  }
};
