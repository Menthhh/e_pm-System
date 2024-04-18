import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    ROLE_NAME: { type: String, required: true },
    ACTION_LIST: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Action' }]
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
