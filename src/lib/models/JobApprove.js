import mongoose from 'mongoose';

const jobApprovesSchema = new mongoose.Schema({
    JOB_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    USER_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    APPROVE_STATUS: { type: String, required: true },
    COMMENT: { type: String, required: true }
}, { timestamps: true });

export const JobApproves = mongoose.models?.JobApproves || mongoose.model('JobApproves', jobApprovesSchema);



