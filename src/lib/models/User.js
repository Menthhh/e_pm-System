import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    EMP_NUMBER: { type: String, required: true },
    EMP_NAME: { type: String, required: true },
    TEAM: String,
    POSITION: String,
    EMAIL: { type: String, required: true },
    SEC: String,
    PASSWORD: { type: String, required: true },
    DEPARTMENT: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    ROLE: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    JOB_LIST: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    JOB_TEMPLATE_TRANSACTION_LIST: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobTemplateTransaction' }],
    NOTIFIED_GROUP_LIST: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NotifiedGroup' }],
    SCHEDULE_LIST: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' }],
    WORKGROUP_LIST: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workgroup' }],
    APPROVE_LIST: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ApproveList' }]
});

export const User = mongoose.models?.User || mongoose.model('User', userSchema) 


