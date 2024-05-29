
import { RoleHasAction } from "@/lib/models/RoleHasAction.js";
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
    const { role_id, actions_id } = body;

    try {
        const promises = actions_id.map(async (action_id) => {
            const existingRoleHasAction = await RoleHasAction.findOne({ ROLE_ID: role_id, ACTION_ID: action_id });

            if (existingRoleHasAction) {
                return { dupclicated: true };
            }

            const newRoleHasAction = new RoleHasAction({
                ROLE_ID: role_id,
                ACTION_ID: action_id,
            });
            await newRoleHasAction.save();

            return newRoleHasAction;
        });

        const results = await Promise.all(promises);

        return NextResponse.json({ status: 200, results });
    } catch (err) {
        return NextResponse.json({ message: "Action addition to role failed", file: __filename, error: err.message, status: 500 });
    }
};

