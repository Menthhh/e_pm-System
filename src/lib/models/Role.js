import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    ROLE_NAME: { type: String, required: true },
    ACTION_LIST: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Action', default: []}]
}, { timestamps: true });

export const Role = mongoose.models?.Role || mongoose.model('Role', roleSchema)
