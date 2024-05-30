import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    REVIEWS: { type: mongoose.Schema.Types.ObjectId, ref: "JobApproved", default: null },
    WD_TAG: { type: String, default: null },
    JOB_STATUS_ID: { type: mongoose.Schema.Types.ObjectId, ref: "Status", required: true },


    JOB_APPROVERS: { type: Array, required: true },
    JOB_NAME: { type: String, required: true },
    DOC_NUMBER: { type: String, required: true },
    CHECKLIST_VERSION: { type: String, required: true },
    WORKGROUP_ID: { type: String, required: true },
    ACTIVATE_USER: {type:mongoose.Schema.Types.ObjectId, ref: "User",  required: true},
    TIMEOUT : { type: String, required: true }, 
}, { timestamps: true });


export const Job = mongoose.models?.Job || mongoose.model("Job", jobSchema);