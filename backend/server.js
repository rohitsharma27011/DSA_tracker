import express from 'express';
import cors from 'cors';
import topicsRouter from './routes/topics.js';
import { topicQuestionsRouter, questionsRouter } from './routes/questions.js';
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/topics', topicsRouter);
app.use('/api/topics', topicQuestionsRouter);
app.use('/api', questionsRouter);

console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB error:", err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`DSA Tracker backend running on http://localhost:${PORT}`);
});
