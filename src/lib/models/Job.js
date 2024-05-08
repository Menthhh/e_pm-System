import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    JOB_APPROVERS: { type: Array, default: [] },
    JOB_STATUS_ID: { type: mongoose.Schema.Types.ObjectId, ref: "JobStatus", default: null },
    JOB_APPROVED_ID: { type: mongoose.Schema.Types.ObjectId, ref: "JobApproved", default: null },
    JobTemplateActiveID: { type: mongoose.Schema.Types.ObjectId, ref: "JobTemplateActivate", default: null },
    TIMEOUT : { type: String, default: null },

    AUTHOR_ID: { type: String, required: true },
    JOB_TEMPLATE_NAME: { type: String, required: true },
    DOC_NUMBER: { type: String, required: true },
    DUE_DATE: { type: Date, required: true },
    CHECKLIST_VERSION: { type: String, required: true },
    MACHINE_ID: { type: String, required: true },
    WORKGROUP_ID: { type: String, required: true },
    JobTemplateCreateID: { type: String, required: true },
});

export const Job = mongoose.models?.Job || mongoose.model("Job", jobSchema);