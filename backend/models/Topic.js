import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  url:        { type: String, default: '' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  completed:  { type: Boolean, default: false },
});

const topicSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  questions: [questionSchema],
});

export default mongoose.model("Topic", topicSchema);
