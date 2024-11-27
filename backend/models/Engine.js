import mongoose from 'mongoose';

const EngineSchema = new mongoose.Schema({
  engine_id: { type: String, required: true, unique: true },
  engine_name: { type: String, required: true },
});

const Engine = mongoose.model('Engine', EngineSchema);
export default Engine;
