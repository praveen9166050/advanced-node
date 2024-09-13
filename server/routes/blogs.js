const express = require('express');
const requireLogin = require('../middlewares/requireLogin');
const Blog = require('../models/Blog');

const router = express.Router();

router.get('/api/blogs/:id', requireLogin, async (req, res) => {
  try {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });
    res.json(blog);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/api/blogs', requireLogin, async (req, res) => {
  try {
    const blogs = await Blog.find({ _user: req.user.id });
    res.json(blogs);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/api/blogs', requireLogin, async (req, res) => {
  const { title, content } = req.body;
  const blog = new Blog({
    title,
    content,
    _user: req.user.id
  });

  try {
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;