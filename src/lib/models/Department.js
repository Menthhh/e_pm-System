import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  DEPARTMENT_NAME: { type: String, required: true },
  USER_LIST: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
});

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
