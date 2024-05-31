import mongoose from 'mongoose';

const jobApprovesSchema = new mongoose.Schema({
    JOB_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    USER_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    IS_APPROVE: { type: Boolean, required: true },
    COMMENT: { type: String, default: null }
}, { timestamps: true });


export const JobApproves = mongoose.models?.JobApproves || mongoose.model('JobApproves', jobApprovesSchema);



