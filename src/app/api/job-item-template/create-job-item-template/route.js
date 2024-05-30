import {  generateUniqueKey } from "@/lib/utils/utils.js";
import { JobItemTemplate } from "@/lib/models/JobItemTemplate.js";
import { NextResponse } from 'next/server.js';
import { connectToDb } from "@/app/api/mongo/index.js";

export const POST = async (req, res) => {
    await connectToDb();
    const JobItemTemplateCreateID = await generateUniqueKey();
    const body = await req.json();
    const {
        AUTHOR_ID,
        JOB_ITEM_TEMPLATE_TITLE,
        JOB_ITEM_TEMPLATE_NAME,
        UPPER_SPEC,
        LOWER_SPEC,
        TEST_METHOD,
        TEST_LOCATION_ID,
        JobTemplateCreateID,
        JOB_TEMPLATE_ID,
    } = body;
    try {
        const jobItemTemplate = new JobItemTemplate({
            AUTHOR_ID,
            JOB_ITEM_TEMPLATE_TITLE,
            JOB_ITEM_TEMPLATE_NAME,
            UPPER_SPEC,
            LOWER_SPEC,
            TEST_METHOD,
            JOB_TEMPLATE_ID,
            TEST_LOCATION_ID,
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
    

