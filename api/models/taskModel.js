import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true, enum: ['Done', 'To Do'], default: 'To Do' },
});

export default mongoose.model('Task', taskSchema);
