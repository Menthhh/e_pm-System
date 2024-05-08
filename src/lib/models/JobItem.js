import mongoose from "mongoose";

const JobItemSchema = new mongoose.Schema({
    JOB_ID: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    JobItemTemplateActivate: { type: mongoose.Schema.Types.ObjectId, ref: "JobTemplate", required: true },
    TEST_LOCATION_ID: { type: mongoose.Schema.Types.ObjectId, ref: "TestLocation", default: null },
    JOB_ITEM_PICTURE_ID: { type: mongoose.Schema.Types.ObjectId, ref: "JobItemPicture", default: null },

    ACTUAL_VALUE: { type: String, default:null },
    COMMENT: { type: String, default:null },
    JOB_ITEM_EXECUTE_DATE: { type: String, default:null },
    BEFORE_VALUE: { type: String, default:null },


    AUTHOR_ID: { type: String, required: true },
    JOB_ITEM_TITLE: { type: String, required: true },
    JOB_ITEM_NAME: { type: String, required: true },
    UPPER_SPEC_LIMIT: { type: String, required: true },
    LOWER_SPEC_LIMIT: { type: String, required: true },
    TEST_METHOD: { type: String, required: true },
    JOB_ID: { type: mongoose.Schema.Types.ObjectId, ref: "JobTemplate", required: true },

}, { timestamps: true });

export const JobItem = mongoose.models?.JobItem || mongoose.model("JobItem", JobItemSchema);