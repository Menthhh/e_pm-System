import { m } from 'framer-motion';
import mongoose from 'mongoose';

const jobItemTemplateSchema = new mongoose.Schema({
    AUTHOR_ID: { type: String, required: true },
    JOB_ITEM_TEMPLATE_TITLE: { type: String, required: true },
    JOB_ITEM_TEMPLATE_NAME: { type: String, required: true },
    UPPER_SPEC_LIMIT: { type: String, required: true },
    LOWER_SPEC_LIMIT: { type: String, required: true },
    TEST_METHOD: { type: String, required: true },
    JOB_TEMPLATE_ID: { type: mongoose.Schema.Types.ObjectId, ref: "JobTemplate", required: true },
}, { timestamps: true });

export const JobItemTemplate = mongoose.models?.JobItemTemplate || mongoose.model('JobItemTemplate', jobItemTemplateSchema);



