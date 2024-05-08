import mongoose from 'mongoose';

const jobTemplateSchema = new mongoose.Schema({
    AUTHOR_ID: { type: String, required: true },
    JOB_TEMPLATE_NAME: { type: String, required: true },
    DOC_NUMBER: { type: String, required: true },
    DUE_DATE: { type: Date, required: true },
    CHECKLIST_VERSION: { type: String, required: true },
    MACHINE_ID: { type: String, required: true },
    WORKGROUP_ID: { type: String, required: true },
    JobTemplateCreateID: { type: String, required: true },
}, { timestamps: true });

export const JobTemplate = mongoose.models?.JobTemplate || mongoose.model('JobTemplate', jobTemplateSchema);



