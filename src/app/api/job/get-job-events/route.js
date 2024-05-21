
import { connectToDb } from "@/lib/utils/utils.js";
import { NextResponse } from 'next/server.js';
import { JobTemplateActivate } from "@/lib/models/AE/JobTemplateActivate";
import { JobTemplate } from "@/lib/models/JobTemplate";
import { Job } from "@/lib/models/Job";
import { Status } from "@/lib/models/Status";

// const events = [
//     {
//       title: 'All Day Event very long title',
//       allDay: true,
//       start: new Date(2024, 3, 1),
//       end: new Date(2024, 3, 1),
//       color: '#FFD700'
//     },
//     {
//       title: 'Long Event',
//       start: new Date(2024, 3, 7),
//       end: new Date(2024, 3, 10),
//       color: '#DAF7A6'
//     },
//     {
//       title: 'Some Event',
//       start: new Date(2024, 3, 9),
//       end: new Date(2024, 3, 9),
//       color: '#FFC300'
//     },
//     {
//       title: 'Conference',
//       start: new Date(2024, 3, 11),
//       end: new Date(2024, 3, 13),
//       desc: 'Big conference for important people',
//       color: '#C70039'
//     },
//     // Add other events similarly with color property
//   ];


export const GET = async (req, res) => {
    await connectToDb();
    const searchParams = req.nextUrl.searchParams;
    const workgroup_id = searchParams.get("workgroup_id");

    try {
        // Find job templates by workgroup ID
        const jobTemplates = await JobTemplate.find({ WORKGROUP_ID: workgroup_id });
        console.log("jobTemplates", jobTemplates);

        // Find job template activations and sort them
        const jobTemplatesActivates = await Promise.all(jobTemplates.map(async (jobTemplate) => {
            return await JobTemplateActivate.find({ JobTemplateID: jobTemplate._id }).sort({ createdAt: -1 });
        }));

        // Flatten the array of arrays
        const flattenedActivates = jobTemplatesActivates.flat();

        // Create events from job template activations
        const events = flattenedActivates.map(async (jobTemplateActivate) => {
            const createdAtDate = new Date(jobTemplateActivate.createdAt);
            const job = await Job.findOne({ _id: jobTemplateActivate.JOB_ID });
            const jobName = job ? job.JOB_NAME : null;
            const status = await Status.findOne({ _id: job.JOB_STATUS_ID });
            const statusColor = status ? status.color : null;
            return {
                title: jobName,
                start: new Date(createdAtDate.getFullYear(), createdAtDate.getMonth(), createdAtDate.getDate()),
                end: new Date(createdAtDate.getFullYear(), createdAtDate.getMonth(), createdAtDate.getDate()),
                color: statusColor,
            };
        });
        
    
        const resolvedEvents = await Promise.all(events);
        

        return NextResponse.json({ status: 200, events:resolvedEvents });
    } catch (error) {
        console.error("Error fetching job events:", error);
        return NextResponse.json({ status: 404, file: __filename, error: error.message || error });
    }
}