import mongoose from 'mongoose';

const actionSchema = new mongoose.Schema({
  ACTION_NAME: { type: String, required: true }
});

export const Action = mongoose.models?.Action || mongoose.model('Action', actionSchema);


