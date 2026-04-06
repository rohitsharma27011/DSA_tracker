import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../server.js';

const router = Router();

// GET /api/topics/:topicId/questions
router.get('/topics/:topicId/questions', (req, res) => {
  db.read();
  const topic = db.data.topics.find((t) => t.id === req.params.topicId);
  if (!topic) return res.status(404).json({ error: 'Topic not found' });
  const questions = db.data.questions.filter((q) => q.topicId === req.params.topicId);
  res.json(questions);
});

// POST /api/topics/:topicId/questions
router.post('/topics/:topicId/questions', (req, res) => {
  db.read();
  const topic = db.data.topics.find((t) => t.id === req.params.topicId);
  if (!topic) return res.status(404).json({ error: 'Topic not found' });

  const { title, url, difficulty } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });
  if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
    return res.status(400).json({ error: 'Difficulty must be Easy, Medium, or Hard' });
  }

  const question = {
    id: uuidv4(),
    topicId: req.params.topicId,
    title: title.trim(),
    url: url || '',
    difficulty,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  db.data.questions.push(question);
  db.write();
  res.status(201).json(question);
});

// PUT /api/questions/:id
router.put('/questions/:id', (req, res) => {
  db.read();
  const question = db.data.questions.find((q) => q.id === req.params.id);
  if (!question) return res.status(404).json({ error: 'Question not found' });

  const { title, url, difficulty, completed } = req.body;
  if (title !== undefined) question.title = title.trim();
  if (url !== undefined) question.url = url;
  if (difficulty !== undefined) {
    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      return res.status(400).json({ error: 'Difficulty must be Easy, Medium, or Hard' });
    }
    question.difficulty = difficulty;
  }
  if (completed !== undefined) question.completed = Boolean(completed);

  db.write();
  res.json(question);
});

// DELETE /api/questions/:id
router.delete('/questions/:id', (req, res) => {
  db.read();
  const idx = db.data.questions.findIndex((q) => q.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Question not found' });
  db.data.questions.splice(idx, 1);
  db.write();
  res.json({ success: true });
});

export default router;
