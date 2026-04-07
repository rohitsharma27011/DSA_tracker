import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: String,
  link: String,
  done: {
    type: Boolean,
    default: false,
  },
});

const topicSchema = new mongoose.Schema({
  name: String,
  questions: [questionSchema],
});

export default mongoose.model("Topic", topicSchema);