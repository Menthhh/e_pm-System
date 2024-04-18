const mongoose = require('mongoose');

const workgroupSchema = new mongoose.Schema({
  WORKGROUP_NAME: { type: String, required: true },
  USER_LIST: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Workgroup = mongoose.model('Workgroup', workgroupSchema);

module.exports = Workgroup;
