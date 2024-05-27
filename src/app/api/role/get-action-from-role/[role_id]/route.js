
import { Role } from "@/lib/models/Role.js";
import { RoleHasAction } from "@/lib/models/RoleHasAction";
import { NextResponse } from 'next/server';
import { Action } from "@/lib/models/Action.js";
import { ObjectId } from "mongodb";

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
export const GET = async (req, {params}) => {
    await connectToDb();
    const { role_id } = params;
    try {
        const roleId = new ObjectId(role_id);
        const pipeline = [
            {
                $match: {
                    $expr: {
                        $eq: ["$ROLE_ID", roleId]
                    }
                }
            }
        ];

        const filteredRoleHasAction = await RoleHasAction.aggregate(pipeline);
        
        const data = await Promise.all(filteredRoleHasAction.map(async (roleHasAction) => {
            const action = await Action.findOne({ _id: roleHasAction.ACTION_ID });
            if (!action) {
                return {
                    _id: "",
                    name: "",
                };
            }
            return {
                _id: action._id.toString(),
                name: action.ACTION_NAME,
            };
        }));
        
        return NextResponse.json({ status: 200, role_actions: data });
    } catch (err) {
        return NextResponse.json({ message: "Role retrieval failed", file: __filename, error: err.message });
    }
};
