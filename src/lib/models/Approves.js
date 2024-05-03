import mongoose from 'mongoose';

const approvesSchema = new mongoose.Schema({
    JOB_TEMPLATE_ID: { type: String, required: true },
    USER_ID: { type: String, required: true },
    JOB_ID: { type: String, default: null }, //waiting to be active from job template to job
}, { timestamps: true });

export const Approves = mongoose.models?.Approves || mongoose.model('Approves', approvesSchema);



