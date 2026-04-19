import { Router } from "express";
import Topic from "../models/Topic.js";

// Mounted at /api/topics — handles topic-scoped question routes
export const topicQuestionsRouter = Router();

// GET /api/topics/:topicId/questions
topicQuestionsRouter.get("/:topicId/questions", async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.topicId);
    if (!topic) return res.status(404).json({ error: "Topic not found" });
    res.json(topic.questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/topics/:topicId/questions
topicQuestionsRouter.post("/:topicId/questions", async (req, res) => {
  try {
    const { title, url, difficulty } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: "Title is required" });
    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      return res.status(400).json({ error: "Difficulty must be Easy, Medium, or Hard" });
    }

    const topic = await Topic.findById(req.params.topicId);
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    topic.questions.push({ title: title.trim(), url: url || '', difficulty, completed: false });
    await topic.save();

    const newQ = topic.questions[topic.questions.length - 1];
    res.status(201).json(newQ);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/topics/:topicId/questions/reorder
topicQuestionsRouter.put("/:topicId/questions/reorder", async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) return res.status(400).json({ error: "orderedIds must be an array" });

    const topic = await Topic.findById(req.params.topicId);
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    const questionMap = new Map(topic.questions.map((q) => [q._id.toString(), q]));
    const reordered = orderedIds.map((id) => questionMap.get(id)).filter(Boolean);

    // Keep any questions not in orderedIds at the end (safety net)
    const reorderedSet = new Set(orderedIds);
    topic.questions.forEach((q) => {
      if (!reorderedSet.has(q._id.toString())) reordered.push(q);
    });

    topic.questions = reordered;
    await topic.save();
    res.json(topic.questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mounted at /api — handles standalone question routes
export const questionsRouter = Router();

// PUT /api/questions/:questionId
questionsRouter.put("/questions/:questionId", async (req, res) => {
  try {
    const { title, url, difficulty, completed } = req.body;
    const topic = await Topic.findOne({ "questions._id": req.params.questionId });
    if (!topic) return res.status(404).json({ error: "Question not found" });

    const question = topic.questions.id(req.params.questionId);
    if (title !== undefined)      question.title      = title.trim();
    if (url !== undefined)        question.url        = url;
    if (difficulty !== undefined) question.difficulty = difficulty;
    if (completed !== undefined)  question.completed  = Boolean(completed);

    await topic.save();
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/questions/:questionId
questionsRouter.delete("/questions/:questionId", async (req, res) => {
  try {
    const topic = await Topic.findOne({ "questions._id": req.params.questionId });
    if (!topic) return res.status(404).json({ error: "Question not found" });

    topic.questions = topic.questions.filter(
      (q) => q._id.toString() !== req.params.questionId
    );
    await topic.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
