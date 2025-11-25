const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const BlogPost = require('../models/BlogPost');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/blog
// @desc    Get all published blog posts
// @access  Public
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = { published: true };

        // Filter by category
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Filter by tag
        if (req.query.tag) {
            query.tags = req.query.tag;
        }

        const posts = await BlogPost.find(query)
            .populate('author', 'username')
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await BlogPost.countDocuments(query);

        res.json({
            success: true,
            count: posts.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/blog/all
// @desc    Get all blog posts (including unpublished)
// @access  Private/Admin
router.get('/all', [protect, authorize('admin')], async (req, res) => {
    try {
        const posts = await BlogPost.find()
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: posts.length,
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/blog/:slug
// @desc    Get single blog post by slug
// @access  Public
router.get('/:slug', async (req, res) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug, published: true })
            .populate('author', 'username');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        // Increment views
        post.views += 1;
        await post.save();

        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/blog
// @desc    Create new blog post
// @access  Private/Admin
router.post('/', [
    protect,
    authorize('admin'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const postData = {
            ...req.body,
            author: req.user.id
        };

        const post = await BlogPost.create(postData);

        res.status(201).json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/blog/:id
// @desc    Update blog post
// @access  Private/Admin
router.put('/:id', [
    protect,
    authorize('admin')
], async (req, res) => {
    try {
        let post = await BlogPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/blog/:id
// @desc    Delete blog post
// @access  Private/Admin
router.delete('/:id', [
    protect,
    authorize('admin')
], async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        await post.deleteOne();

        res.json({
            success: true,
            message: 'Blog post deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
