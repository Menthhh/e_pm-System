import { connectToDb } from "@/lib/utils/utils.js";
import { JobTemplate } from "@/lib/models/JobTemplate.js";
import { NextResponse } from 'next/server';

// import mongoose from 'mongoose';

// const jobTemplateSchema = new mongoose.Schema({
//     AUTHOR_ID: { type: String, required: true },
//     JOB_TEMPLATE_NAME: { type: String, required: true },
//     DOC_NUMBER: { type: String, required: true },
//     DUE_DATE: { type: Date, required: true },
//     CHECKLIST_VERSION: { type: String, required: true },
//     WORKGROUP_ID: { type: String, required: true },
// }, { timestamps: true });

// export const JobTemplate = mongoose.models?.JobTemplate || mongoose.model('JobTemplate', jobTemplateSchema);

export const GET = async (req, res) => {
    await connectToDb();

    try {
        const jobTemplates = await JobTemplate.find();
        return NextResponse.json({ status: 200, jobTemplates });
    }
    catch(err) {
        return NextResponse.json({status: 500, file: __filename, error: err.message});
    }
};
    

