import mongoose from "mongoose";

const JobTemplateActivateSchema = new mongoose.Schema({
    JobTemplateID: { type: mongoose.Schema.Types.ObjectId, ref: "JobTemplate" },
    ACTIVATER_ID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    JobTemplateCreateID: { type: String, required: true },

   
}, { timestamps: true });

export const JobTemplateActivate = mongoose.models?.JobTemplateActivate || mongoose.model("JobTemplateActivate", JobTemplateActivateSchema);

    
