
import { JobTemplate } from "@/lib/models/JobTemplate.js";
import { NextResponse } from 'next/server';
import { connectToDb } from "@/app/api/mongo/index.js";
import { JobItemTemplate } from "@/lib/models/JobItemTemplate";

export const DELETE = async (req, res) => {
  await connectToDb();
  const body = await req.json();
  const { jobTemplate_id, JobTemplateCreateID } = body;
  console.log(jobTemplate_id, JobTemplateCreateID);
  try {
    const approvers = await JobItemTemplate.deleteMany(
      {
        JOB_TEMPLATE_ID: jobTemplate_id,
        JobTemplateCreateID: JobTemplateCreateID
      });
    const jobItemTemplate = await JobItemTemplate.deleteMany({ JOB_TEMPLATE_ID: jobTemplate_id });
    const jobTemplate = await JobTemplate.findByIdAndDelete(jobTemplate_id);
    return NextResponse.json({ status: 200, jobTemplate });
  } catch (err) {
    return NextResponse.json({ status: 500, file: __filename, error: err.message });
  }
};


