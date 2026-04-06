import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../server.js';

const router = Router();

// GET /api/topics — all topics with progress counts
router.get('/', (req, res) => {
  db.read();
  const topics = db.data.topics.map((topic) => {
    const questions = db.data.questions.filter((q) => q.topicId === topic.id);
    return {
      ...topic,
      totalCount: questions.length,
      completedCount: questions.filter((q) => q.completed).length,
    };
  });
  res.json(topics);
});

// POST /api/topics — create topic
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Topic name is required' });
  }
  const topic = { id: uuidv4(), name: name.trim(), createdAt: new Date().toISOString() };
  db.data.topics.push(topic);
  db.write();
  res.status(201).json({ ...topic, totalCount: 0, completedCount: 0 });
});

// PUT /api/topics/:id — rename topic
router.put('/:id', (req, res) => {
  db.read();
  const topic = db.data.topics.find((t) => t.id === req.params.id);
  if (!topic) return res.status(404).json({ error: 'Topic not found' });
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Topic name is required' });
  }
  topic.name = name.trim();
  db.write();
  const questions = db.data.questions.filter((q) => q.topicId === topic.id);
  res.json({
    ...topic,
    totalCount: questions.length,
    completedCount: questions.filter((q) => q.completed).length,
  });
});

// DELETE /api/topics/:id — delete topic and all its questions
router.delete('/:id', (req, res) => {
  db.read();
  const idx = db.data.topics.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Topic not found' });
  db.data.topics.splice(idx, 1);
  db.data.questions = db.data.questions.filter((q) => q.topicId !== req.params.id);
  db.write();
  res.json({ success: true });
});

export default router;
