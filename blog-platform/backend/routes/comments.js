const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/authMiddleware');

// Get all comments for a blog
router.get('/:blogId', async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a comment (protected)
router.post('/:blogId', auth, async (req, res) => {
  try {
    const comment = await Comment.create({
      blog:    req.params.blogId,
      author:  req.user.id,
      content: req.body.content
    });
    const populated = await comment.populate('author', 'username');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a comment (protected - only author)
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;