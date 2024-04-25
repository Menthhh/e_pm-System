import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    EMP_NUMBER: { type: String, required: true },
    EMP_NAME: { type: String, required: true },
    USERNAME: { type: String, required: true },
    TEAM: { type: String, required: true }, //A B C Office
    //POSITION: { type: String, required: true },
    EMAIL: { type: String, required: true },
    //SEC: { type: String, required: true },
    PASSWORD: { type: String, required: true },
    DEPARTMENT: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
    ROLE: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', default: null },
    JOB_LIST: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job', default: [] }],
    JOB_TEMPLATE_TRANSACTION_LIST: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobTemplateTransaction', default: [] }],
    NOTIFIED_GROUP_LIST: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NotifiedGroup', default: [] }],
    SCHEDULE_LIST: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', default: [] }],
    WORKGROUP_LIST: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workgroup', default: [] }],
    APPROVE_LIST: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ApproveList', default: [] }]
}, { timestamps: true });

export const User = mongoose.models?.User || mongoose.model('User', userSchema);


