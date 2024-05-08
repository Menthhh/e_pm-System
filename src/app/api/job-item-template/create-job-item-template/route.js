import { connectToDb, generateUniqueKey } from "@/lib/utils/utils.js";
import { JobItemTemplate } from "@/lib/models/JobItemTemplate.js";
import { NextResponse } from 'next/server.js';

// import { m } from 'framer-motion';
// import mongoose from 'mongoose';

// const jobItemTemplateSchema = new mongoose.Schema({
//     AUTHOR_ID: { type: String, required: true },
//     JOB_ITEM_TEMPLATE_TITLE: { type: String, required: true },
//     JOB_ITEM_TEMPLATE_NAME: { type: String, required: true },
//     UPPER_SPEC_LIMIT: { type: String, required: true },
//     LOWER_SPEC_LIMIT: { type: String, required: true },
//     TEST_METHOD: { type: String, required: true },
//     JOB_TEMPLATE_ID: { type: mongoose.Schema.Types.ObjectId, ref: "JobTemplate", required: true },
//     JobTemplateCreateID: { type: String, required: true },
//     JobItemTemplateCreateID: { type: String, required: true },
// }, { timestamps: true });

// export const JobItemTemplate = mongoose.models?.JobItemTemplate || mongoose.model('JobItemTemplate', jobItemTemplateSchema);



export const POST = async (req, res) => {
    await connectToDb();
    const JobItemTemplateCreateID = await generateUniqueKey();
    const body = await req.json();
    const {
        AUTHOR_ID,
        JOB_ITEM_TEMPLATE_TITLE,
        JOB_ITEM_TEMPLATE_NAME,
        UPPER_SPEC_LIMIT,
        LOWER_SPEC_LIMIT,
        TEST_METHOD,

        JobTemplateCreateID,
        JOB_TEMPLATE_ID,
    } = body;
    try {
        const jobItemTemplate = new JobItemTemplate({
            AUTHOR_ID,
            JOB_ITEM_TEMPLATE_TITLE,
            JOB_ITEM_TEMPLATE_NAME,
            UPPER_SPEC_LIMIT,
            LOWER_SPEC_LIMIT,
            TEST_METHOD,
            JOB_TEMPLATE_ID,
            JobTemplateCreateID,
            JobItemTemplateCreateID
        });
        await jobItemTemplate.save();

        return NextResponse.json({ status: 200, jobItemTemplate });
    }
    catch(err) {
        return NextResponse.json({status: 500, file: __filename, error: err.message});
    }
    
};
    

