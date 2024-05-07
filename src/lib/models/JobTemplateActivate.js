import mongoose from "mongoose";

const JobTemplateActivateSchema = new mongoose.Schema({
    JobTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: "JobTemplate" },
    AUTHOR_ID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    JOB_TEMPLATE_NAME: { type: String, required: true },
    DOC_NUMBER: { type: String, required: true },
    DUE_DATE: { type: Date, required: true },
    CHECKLIST_VERSION: { type: String, required: true },
    MACHINE_ID: { type: String, required: true },
    WORKGROUP_ID: { type: String, required: true },
    ACTIVATER_ID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export const JobTemplateActivate = mongoose.models?.JobTemplateActivate || mongoose.model("JobTemplateActivate", JobTemplateActivateSchema);

    
