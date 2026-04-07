import { Router } from "express";
import Topic from "../models/Topic.js";

const router = Router();

// GET all questions for a topic
router.get("/:topicId", async (req, res) => {
  const topic = await Topic.findById(req.params.topicId);

  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }

  res.json(topic.questions);
});

// ADD question
router.post("/:topicId", async (req, res) => {
  const { title, link } = req.body;

  const topic = await Topic.findById(req.params.topicId);

  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }

  const newQuestion = {
    title,
    link,
    done: false,
  };

  topic.questions.push(newQuestion);
  await topic.save();

  res.status(201).json(topic.questions);
});

// TOGGLE done
router.patch("/:topicId/:questionId", async (req, res) => {
  const topic = await Topic.findById(req.params.topicId);

  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }

  const question = topic.questions.id(req.params.questionId);

  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  question.done = !question.done;

  await topic.save();

  res.json(question);
});

// DELETE question
router.delete("/:topicId/:questionId", async (req, res) => {
  const topic = await Topic.findById(req.params.topicId);

  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }

  topic.questions = topic.questions.filter(
    (q) => q._id.toString() !== req.params.questionId
  );

  await topic.save();

  res.json({ success: true });
});

export default router;