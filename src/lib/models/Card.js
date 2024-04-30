import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    TITLE: { type: String, required: true },
    DETAIL: { type: String, default: "" },
    LINK: { type: String, required: true },
    ACTION_LIST : { type: Array, default: [] }

}, { timestamps: true });

export const Card = mongoose.models?.Card || mongoose.model('Card', cardSchema);


