import mongoose,{Schema} from "mongoose";

const flowchartSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  nodes: { type: Array, required: true },
  edges: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Flowchart = mongoose.model('Flowchart', flowchartSchema);
