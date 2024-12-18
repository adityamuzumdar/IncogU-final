const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Assuming you have a Post model

// Route to fetch all posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().populate('comments'); // Assuming posts have a 'comments' field
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

// Route to create a new post
router.post('/posts', async (req, res) => {
    const { content } = req.body;
    try {
        const newPost = new Post({ content });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post' });
    }
});

// Route to add a comment to a post
router.post('/:postId/comments', async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    try {
        const post = await Post.findById(postId);
        if (post) {
            post.comments.push({ content });
            await post.save();
            res.status(201).json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment' });
    }
});

module.exports = router;const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Assuming you have a Post model

// Route to fetch all posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().populate('comments'); // Assuming posts have a 'comments' field
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

// Route to create a new post
router.post('/posts', async (req, res) => {
    const { content } = req.body;
    try {
        const newPost = new Post({ content });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post' });
    }
});

// Route to add a comment to a post
router.post('/:postId/comments', async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    try {
        const post = await Post.findById(postId);
        if (post) {
            post.comments.push({ content });
            await post.save();
            res.status(201).json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment' });
    }
});

module.exports = router;