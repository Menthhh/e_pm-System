// pages/api/countJobsByUser.js
import { connectToDb } from "@/app/api/mongo/index";
import { Job } from "@/lib/models/Job";
import { User } from "@/lib/models/User";
import { NextResponse } from "next/server";

export const GET = async (req, res) => {
  try {
    await connectToDb();

    const jobCounts = await User.aggregate([
      {
        $lookup: {
          from: "jobs", // The name of the Job collection
          localField: "_id",
          foreignField: "ACTIVATE_USER",
          as: "jobs"
        }
      },
      {
        $project: {
          userName: "$EMP_NAME", // Assuming the User schema has an 'EMP_NAME' field
          jobCount: { $size: "$jobs" }
        }
      },
      {
        $sort: { jobCount: -1 } // Sort by jobCount in descending order
      }
    ]);

    return NextResponse.json(jobCounts);
  } catch (error) {
    console.error(error);
    return NextResponse.error(error);
  }
};
