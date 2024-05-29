
import { Workgroup } from "@/lib/models/Workgroup.js";
import { User } from "@/lib/models/User.js";
import { NextResponse } from 'next/server';
import { Role } from "@/lib/models/Role";
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
export const GET = async (req, {params}) => {
    await connectToDb();
    const { workgroup_id } = params;
    try {
        const workgroup = await Workgroup.findById(workgroup_id);
        if (!workgroup) {
            return NextResponse.json({ message: "Workgroup not found", file: __filename });
        }
        let users = []
        for (let i = 0; i < workgroup.USER_LIST.length; i++) {
            const user = await User.findById(workgroup.USER_LIST[i]);
            let role_name
            if (!user.ROLE){
               role_name = "No Role"
            }
            const role = await Role.findById(user.ROLE);
            if (role){
                role_name = role.ROLE_NAME;
            }
            users.push(
                {
                    _id: user._id,
                    emp_number: user.EMP_NUMBER,
                    email: user.EMAIL,
                    name: user.EMP_NAME,
                    role: role_name
                    
                }
            );
        }
        return NextResponse.json({ status: 200, users });
    } catch (err) {
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }

};
