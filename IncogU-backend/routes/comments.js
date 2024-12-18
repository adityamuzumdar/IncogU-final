// routes/comments.js
const express = require('express');
const Comment = require('../models/Comment');
const Question = require('../models/Question');

const router = express.Router();

// Post a new comment
router.post('/add', async (req, res) => {
  const { questionId, content, user } = req.body;

  if (!questionId || !content || !user) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newComment = new Comment({
      questionId,
      content,
      user,
    });

    await newComment.save();
    res.status(200).json({ message: 'Comment added successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add comment.' });
  }
});

// Get comments for a specific question
router.get('/:questionId', async (req, res) => {
  const { questionId } = req.params;

  try {
    const comments = await Comment.find({ questionId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch comments.' });
  }
});

module.exports = router;