import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    JOB_STATUS_ID: { type: mongoose.Schema.Types.ObjectId, ref: "JobStatus", default: null },
    JOB_APPROVED_ID: { type: mongoose.Schema.Types.ObjectId, ref: "JobApproved", default: null },
    TIMEOUT : { type: String, default: null },  
    
    JOB_APPROVERS: { type: Array, required: true },
    JOB_NAME: { type: String, required: true },
    DOC_NUMBER: { type: String, required: true },
    CHECKLIST_VERSION: { type: String, required: true },
    MACHINE_ID: { type: String, required: true },
    WORKGROUP_ID: { type: String, required: true },
    ACTIVATE_USER: {type:mongoose.Schema.Types.ObjectId, ref: "User",  required: true},
}, { timestamps: true });


export const Job = mongoose.models?.Job || mongoose.model("Job", jobSchema);