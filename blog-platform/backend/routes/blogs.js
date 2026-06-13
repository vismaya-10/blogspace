const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const auth = require('../middleware/authMiddleware');

// Get all blogs
router.get('/', async (req, res) => {
  const blogs = await Blog.find().populate('author', 'username');
  res.json(blogs);
});

// Get single blog
router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author', 'username');
  res.json(blog);
});

// Create blog (protected)
router.post('/', auth, async (req, res) => {
  const { title, content } = req.body;
  try {
    const blog = await Blog.create({ title, content, author: req.user.id });
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update blog (protected)
router.put('/:id', auth, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  if (blog.author.toString() !== req.user.id)
    return res.status(403).json({ message: 'Unauthorized' });

  const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete blog (protected)
router.delete('/:id', auth, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  if (blog.author.toString() !== req.user.id)
    return res.status(403).json({ message: 'Unauthorized' });

  await blog.deleteOne();
  res.json({ message: 'Blog deleted' });
});

module.exports = router;