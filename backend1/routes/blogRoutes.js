const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

// Create Blog (Admin only)
router.post('/create', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { title, content } = req.body;

        const newBlog = new Blog({ title, content });
        await newBlog.save();

        res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
    } catch (error) {
        res.status(500).json({ message: 'Error creating blog', error: error.message });
    }
});

// Get All Blogs (Public)
router.get('/all', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blogs', error: error.message });
    }
});

// Delete Blog by ID (Admin only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
    try {
        const blogId = req.params.id;

        const deletedBlog = await Blog.findByIdAndDelete(blogId);

        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting blog', error: error.message });
    }
});

// Update Blog by ID (Admin only)
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
    try {
        const blogId = req.params.id;
        const { title, content } = req.body;

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { title, content },
            { new: true } // Return the updated document
        );

        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
    } catch (error) {
        res.status(500).json({ message: 'Error updating blog', error: error.message });
    }
});


module.exports = router;
