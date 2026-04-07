import express from 'express';
import cors from 'cors';
import { JSONFileSync, LowSync } from 'lowdb';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import topicsRouter from './routes/topics.js';
import questionsRouter from './routes/questions.js';
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- lowdb setup ---
const file = join(__dirname, 'data', 'db.json');
const adapter = new JSONFileSync(file);
export const db = new LowSync(adapter, { topics: [], questions: [] });
db.read();
if (!db.data) {
  db.data = { topics: [], questions: [] };
  db.write();
}

// Seed if empty
if (db.data.topics.length === 0) {
  const now = new Date().toISOString();

  const topics = [
    { id: uuidv4(), name: 'Arrays', createdAt: now },
    { id: uuidv4(), name: 'Strings', createdAt: now },
    { id: uuidv4(), name: 'Trees', createdAt: now },
    { id: uuidv4(), name: 'Dynamic Programming', createdAt: now },
    { id: uuidv4(), name: 'Graphs', createdAt: now },
    { id: uuidv4(), name: 'Linked List', createdAt: now },
  ];

  const questions = [
    // Arrays
    { id: uuidv4(), topicId: topics[0].id, title: 'Two Sum', url: 'https://leetcode.com/problems/two-sum/', difficulty: 'Easy', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[0].id, title: 'Best Time to Buy and Sell Stock', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', difficulty: 'Easy', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[0].id, title: 'Contains Duplicate', url: 'https://leetcode.com/problems/contains-duplicate/', difficulty: 'Easy', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[0].id, title: 'Product of Array Except Self', url: 'https://leetcode.com/problems/product-of-array-except-self/', difficulty: 'Medium', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[0].id, title: 'Maximum Subarray', url: 'https://leetcode.com/problems/maximum-subarray/', difficulty: 'Medium', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[0].id, title: '3Sum', url: 'https://leetcode.com/problems/3sum/', difficulty: 'Medium', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[0].id, title: 'Container With Most Water', url: 'https://leetcode.com/problems/container-with-most-water/', difficulty: 'Medium', completed: false, createdAt: now },

    // Strings
    { id: uuidv4(), topicId: topics[1].id, title: 'Valid Anagram', url: 'https://leetcode.com/problems/valid-anagram/', difficulty: 'Easy', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[1].id, title: 'Valid Palindrome', url: 'https://leetcode.com/problems/valid-palindrome/', difficulty: 'Easy', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[1].id, title: 'Longest Substring Without Repeating Characters', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', difficulty: 'Medium', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[1].id, title: 'Group Anagrams', url: 'https://leetcode.com/problems/group-anagrams/', difficulty: 'Medium', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[1].id, title: 'Longest Palindromic Substring', url: 'https://leetcode.com/problems/longest-palindromic-substring/', difficulty: 'Medium', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[1].id, title: 'Minimum Window Substring', url: 'https://leetcode.com/problems/minimum-window-substring/', difficulty: 'Hard', completed: false, createdAt: now },

    // Trees
    { id: uuidv4(), topicId: topics[2].id, title: 'Invert Binary Tree', url: 'https://leetcode.com/problems/invert-binary-tree/', difficulty: 'Easy', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[2].id, title: 'Maximum Depth of Binary Tree', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', difficulty: 'Easy', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[2].id, title: 'Same Tree', url: 'https://leetcode.com/problems/same-tree/', difficulty: 'Easy', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[2].id, title: 'Binary Tree Level Order Traversal', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', difficulty: 'Medium', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[2].id, title: 'Validate Binary Search Tree', url: 'https://leetcode.com/problems/validate-binary-search-tree/', difficulty: 'Medium', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[2].id, title: 'Binary Tree Maximum Path Sum', url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', difficulty: 'Hard', completed: false, createdAt: now },

    // Dynamic Programming
    { id: uuidv4(), topicId: topics[3].id, title: 'Climbing Stairs', url: 'https://leetcode.com/problems/climbing-stairs/', difficulty: 'Easy', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[3].id, title: 'House Robber', url: 'https://leetcode.com/problems/house-robber/', difficulty: 'Medium', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[3].id, title: 'Coin Change', url: 'https://leetcode.com/problems/coin-change/', difficulty: 'Medium', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[3].id, title: 'Longest Increasing Subsequence', url: 'https://leetcode.com/problems/longest-increasing-subsequence/', difficulty: 'Medium', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[3].id, title: 'Word Break', url: 'https://leetcode.com/problems/word-break/', difficulty: 'Medium', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[3].id, title: 'Unique Paths', url: 'https://leetcode.com/problems/unique-paths/', difficulty: 'Medium', completed: false, createdAt: now },

    // Graphs
    { id: uuidv4(), topicId: topics[4].id, title: 'Number of Islands', url: 'https://leetcode.com/problems/number-of-islands/', difficulty: 'Medium', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[4].id, title: 'Clone Graph', url: 'https://leetcode.com/problems/clone-graph/', difficulty: 'Medium', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[4].id, title: 'Course Schedule', url: 'https://leetcode.com/problems/course-schedule/', difficulty: 'Medium', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[4].id, title: 'Pacific Atlantic Water Flow', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', difficulty: 'Medium', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[4].id, title: 'Word Ladder', url: 'https://leetcode.com/problems/word-ladder/', difficulty: 'Hard', completed: false, createdAt: now },

    // Linked List
    { id: uuidv4(), topicId: topics[5].id, title: 'Reverse Linked List', url: 'https://leetcode.com/problems/reverse-linked-list/', difficulty: 'Easy', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[5].id, title: 'Merge Two Sorted Lists', url: 'https://leetcode.com/problems/merge-two-sorted-lists/', difficulty: 'Easy', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[5].id, title: 'Linked List Cycle', url: 'https://leetcode.com/problems/linked-list-cycle/', difficulty: 'Easy', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[5].id, title: 'Remove Nth Node From End of List', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', difficulty: 'Medium', completed: false, createdAt: now },
    { id: uuidv4(), topicId: topics[5].id, title: 'Merge K Sorted Lists', url: 'https://leetcode.com/problems/merge-k-sorted-lists/', difficulty: 'Hard', completed: false, createdAt: now },
  ];

  db.data.topics = topics;
  db.data.questions = questions;
  db.write();
  console.log('Database seeded with sample data.');
}

// --- Express setup ---
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/topics', topicsRouter);
app.use('/api', questionsRouter);

console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB error:", err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`DSA Tracker backend running on http://localhost:${PORT}`);
});
