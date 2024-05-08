import mongoose from "mongoose";

const jobItemTemplateAcitvateSchema = new mongoose.Schema({
    JOB_ITEM_TEMPLATE_ID: { type: mongoose.Schema.Types.ObjectId, ref: "JobItemTemplate", required: true },
    ACTIVATER_ID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    JobItemTemplateCreateID: { type: String, required: true }

    
}, { timestamps: true });

export const JobItemTemplateActivate = mongoose.models?.JobItemTemplateActivate || mongoose.model('JobItemTemplateActivate', jobItemTemplateAcitvateSchema);

