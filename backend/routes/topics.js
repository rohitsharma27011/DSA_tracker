import { Router } from "express";
import Topic from "../models/Topic.js";

const router = Router();

// GET /api/topics — all topics with progress counts
router.get("/", async (req, res) => {
  const topics = await Topic.find();

  const formatted = topics.map((topic) => {
    const totalCount = topic.questions.length;
    const completedCount = topic.questions.filter((q) => q.completed).length;

    return {
      _id: topic._id,
      name: topic.name,
      totalCount,
      completedCount,
    };
  });

  res.json(formatted);
});

// GET /api/topics/:id — get topic with questions
router.get("/:id", async (req, res) => {
  const topic = await Topic.findById(req.params.id);

  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }

  res.json(topic);
});

// POST /api/topics — create topic
router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Topic name is required" });
  }

  const newTopic = new Topic({
    name: name.trim(),
    questions: [],
  });

  await newTopic.save();

  res.status(201).json({
    _id: newTopic._id,
    name: newTopic.name,
    totalCount: 0,
    completedCount: 0,
  });
});

// PUT /api/topics/:id — rename topic
router.put("/:id", async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Topic name is required" });
  }

  const topic = await Topic.findById(req.params.id);

  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }

  topic.name = name.trim();
  await topic.save();

  const totalCount = topic.questions.length;
  const completedCount = topic.questions.filter((q) => q.completed).length;

  res.json({
    _id: topic._id,
    name: topic.name,
    totalCount,
    completedCount,
  });
});

// DELETE /api/topics/:id — delete topic
router.delete("/:id", async (req, res) => {
  const topic = await Topic.findById(req.params.id);

  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }

  await Topic.findByIdAndDelete(req.params.id);

  res.json({ success: true });
});

export default router;