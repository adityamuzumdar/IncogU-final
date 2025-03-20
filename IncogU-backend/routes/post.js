const express = require('express');
const Post = require('../models/Post');
const authenticate = require('../middlewares/authMiddleware');
const router = express.Router();

// Fetch all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username email university');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a post (protected route)
router.post('/', authenticate, async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = new Post({ user: req.user.id, title, content });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add a comment to a post (protected route)
router.post('/:postId/comments', authenticate, async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = {
      user: req.user.id,
      text,
      replies: [],
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add a reply to a comment (protected route)
router.post('/:postId/comments/:commentId/replies', authenticate, async (req, res) => {
  const { postId, commentId } = req.params;
  const { text } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const newReply = {
      user: req.user.id,
      text,
      createdAt: new Date()
    };

    comment.replies.push(newReply);
    await post.save();
    res.status(201).json(newReply);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add a reply to a reply (protected route)
router.post('/:postId/comments/:commentId/replies/:replyId/replies', authenticate, async (req, res) => {
  const { postId, commentId, replyId } = req.params;
  const { text } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const reply = comment.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: 'Reply not found' });

    const newReply = {
      user: req.user.id,
      text,
      createdAt: new Date(),
      replies: []
    };

    if (!reply.replies) reply.replies = [];
    reply.replies.push(newReply);
    await post.save();
    res.status(201).json(newReply);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;