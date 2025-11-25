# Personal Blog Backend API

A RESTful API backend for the personal blog and portfolio website built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication**: JWT-based authentication with role-based access control
- **Projects API**: CRUD operations for portfolio projects
- **Blog API**: Full blog management with pagination and filtering
- **Contact Form**: Handle contact form submissions
- **File Upload**: Image upload functionality for projects and blog posts
- **Validation**: Request validation using express-validator
- **Error Handling**: Centralized error handling middleware

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/personal-blog
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:3000
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads
   ```

5. **Create uploads directory:**
   ```bash
   mkdir uploads
   ```

## 🌱 Seed Database

To populate the database with sample data and create an admin user:

```bash
npm run seed
```

**Default Admin Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

⚠️ **Important**: Change these credentials in production!

## 🏃 Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (Admin only)
- `PUT /api/projects/:id` - Update project (Admin only)
- `DELETE /api/projects/:id` - Delete project (Admin only)

### Blog Posts
- `GET /api/blog` - Get published posts (with pagination)
- `GET /api/blog/all` - Get all posts including drafts (Admin only)
- `GET /api/blog/:slug` - Get single post by slug
- `POST /api/blog` - Create blog post (Admin only)
- `PUT /api/blog/:id` - Update blog post (Admin only)
- `DELETE /api/blog/:id` - Delete blog post (Admin only)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all submissions (Admin only)
- `GET /api/contact/:id` - Get single submission (Admin only)
- `PUT /api/contact/:id` - Update submission status (Admin only)
- `DELETE /api/contact/:id` - Delete submission (Admin only)

### Upload
- `POST /api/upload` - Upload image (Admin only)

### Health Check
- `GET /api/health` - Server health check

## 🔐 Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

To get a token, login via `/api/auth/login` endpoint.

## 📝 Example Requests

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Project (Admin)
```bash
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Awesome Project",
  "description": "A description of the project",
  "technologies": ["React", "Node.js", "MongoDB"],
  "projectUrl": "https://example.com",
  "githubUrl": "https://github.com/example",
  "featured": true
}
```

### Submit Contact Form
```bash
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'd like to discuss a project..."
}
```

## 📁 Project Structure

```
backend/
├── models/           # Mongoose models
│   ├── User.js
│   ├── Project.js
│   ├── BlogPost.js
│   └── Contact.js
├── routes/           # API routes
│   ├── auth.js
│   ├── projects.js
│   ├── blog.js
│   ├── contact.js
│   └── upload.js
├── middleware/       # Custom middleware
│   ├── auth.js
│   └── errorHandler.js
├── scripts/          # Utility scripts
│   └── seed.js
├── uploads/          # Uploaded files
├── .env.example      # Environment variables template
├── .gitignore
├── package.json
├── server.js         # Main server file
└── README.md
```

## 🚢 Deployment

### Environment Variables
Make sure to set all environment variables in your production environment:
- Use a strong `JWT_SECRET`
- Set `NODE_ENV=production`
- Use MongoDB Atlas or a production MongoDB instance
- Configure `CLIENT_URL` to your frontend domain

### Recommended Platforms
- **Heroku**: Easy deployment with MongoDB Atlas
- **Railway**: Modern deployment platform
- **DigitalOcean**: VPS with more control
- **AWS/Azure/GCP**: Enterprise solutions

## 🔒 Security Notes

1. **Change default admin credentials** after first login
2. **Use strong JWT_SECRET** in production
3. **Enable HTTPS** in production
4. **Set appropriate CORS origins** (don't use `*` in production)
5. **Implement rate limiting** for API endpoints
6. **Validate and sanitize** all user inputs

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running locally or check your MongoDB Atlas connection string
- Verify `MONGODB_URI` in `.env` file

**Port Already in Use:**
- Change the `PORT` in `.env` file
- Kill the process using the port: `npx kill-port 5000`

**File Upload Issues:**
- Ensure `uploads/` directory exists
- Check file size limits in `.env`

## 📄 License

MIT License - feel free to use this for your own projects!

---

Built with 💜 and Node.js
