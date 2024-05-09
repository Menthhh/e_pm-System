import { connectToDb } from "@/lib/utils/utils";
import { Job } from "@/lib/models/Job";
import { NextResponse } from 'next/server';
import { User } from "@/lib/models/User";

export const GET = async (req, { params }) => {
    await connectToDb();
    const { workgroup_id } = params;
    try {
        // Find all jobs where workgroup_id = workgroup_id
        const jobs = await Job.find({ WORKGROUP_ID: workgroup_id });

        // Fetch activater name for each job
        const activaterPromises = jobs.map(async (job) => {
            const user = await User.findOne({ _id: job.ACTIVATE_USER });
            console.log(user?.EMP_NAME); // Check if EMP_NAME is fetched correctly
            const activaterName = user?.EMP_NAME || 'Unknown'; // Use optional chaining and provide a default value if user is null
            return { ...job.toObject(), ACTIVATER_NAME: activaterName }; // Merge activaterName into the job object
        });

        // Await all activater name promises
        const jobsWithActivater = await Promise.all(activaterPromises);

        // Return JSON response with jobs including activater names
        return NextResponse.json({ status: 200, jobs: jobsWithActivater });
    } catch (err) {
        return NextResponse.json({ status: 500, error: err.message });
    }
}
