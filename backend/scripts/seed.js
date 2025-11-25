const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const BlogPost = require('../models/BlogPost');
require('dotenv').config();

// Sample data
const sampleProjects = [
    {
        title: 'E-Commerce Platform',
        description: 'A full-stack e-commerce platform with payment integration, user authentication, and admin dashboard.',
        image: '🛒',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        projectUrl: 'https://example.com',
        githubUrl: 'https://github.com/example',
        featured: true,
        order: 1
    },
    {
        title: 'Task Management App',
        description: 'A collaborative task management application with real-time updates and team features.',
        image: '✅',
        technologies: ['Vue.js', 'Firebase', 'Tailwind CSS'],
        projectUrl: 'https://example.com',
        githubUrl: 'https://github.com/example',
        featured: true,
        order: 2
    },
    {
        title: 'Weather Dashboard',
        description: 'A beautiful weather dashboard with forecasts, maps, and location-based alerts.',
        image: '🌤️',
        technologies: ['HTML/CSS', 'JavaScript', 'Weather API'],
        projectUrl: 'https://example.com',
        githubUrl: 'https://github.com/example',
        featured: false,
        order: 3
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany();
        await Project.deleteMany();
        await BlogPost.deleteMany();

        console.log('🗑️  Cleared existing data');

        // Create admin user
        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin'
        });

        console.log('👤 Created admin user');
        console.log('   Email: admin@example.com');
        console.log('   Password: admin123');

        // Create sample projects
        await Project.insertMany(sampleProjects);
        console.log(`📁 Created ${sampleProjects.length} sample projects`);

        // Create sample blog post
        const samplePost = await BlogPost.create({
            title: 'Welcome to My Blog',
            content: `# Welcome to My Blog

This is my first blog post! I'm excited to share my journey in web development and technology.

## What to Expect

In this blog, I'll be sharing:

- **Tutorials** on web development
- **Project showcases** and case studies
- **Tech insights** and industry trends
- **Personal experiences** and lessons learned

## Stay Connected

Make sure to check back regularly for new content. Feel free to reach out if you have any questions or suggestions!

Happy coding! 🚀`,
            excerpt: 'Welcome to my blog! Here I share my journey in web development and technology.',
            author: adminUser._id,
            category: 'General',
            tags: ['welcome', 'introduction'],
            published: true,
            publishedAt: new Date()
        });

        console.log('📝 Created sample blog post');

        console.log('\n✨ Database seeded successfully!');
        console.log('\n🔐 Admin Login Credentials:');
        console.log('   Email: admin@example.com');
        console.log('   Password: admin123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
