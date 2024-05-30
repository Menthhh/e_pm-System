import { User } from '@/lib/models/User.js';
import { NextResponse } from 'next/server';
import { connectToDb } from "@/app/api/mongo/index.js";

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

