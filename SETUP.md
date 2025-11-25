# Backend Setup & Testing Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)
- A web browser

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment

The `.env` file has already been created with default settings:
- MongoDB: `mongodb://localhost:27017/personal-blog`
- Server Port: `5000`
- JWT Secret: (change in production!)

### Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas**
Update `MONGODB_URI` in `backend/.env` with your Atlas connection string

### Step 4: Seed the Database

```bash
npm run seed
```

This will create:
- Admin user (email: `admin@example.com`, password: `admin123`)
- 3 sample projects
- 1 sample blog post

### Step 5: Start the Backend Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

Server will run at: `http://localhost:5000`

### Step 6: Open the Frontend

Open `index.html` in your browser using Live Server or similar tool.

**Important**: The frontend needs to be served (not just opened as a file) for the API calls to work properly.

### Step 7: Access Admin Dashboard

Navigate to `admin.html` and login with:
- Email: `admin@example.com`
- Password: `admin123`

## 📡 API Endpoints

### Health Check
```bash
GET http://localhost:5000/api/health
```

### Authentication
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Projects (Public)
```bash
GET http://localhost:5000/api/projects
```

### Blog Posts (Public)
```bash
GET http://localhost:5000/api/blog
```

### Contact Form (Public)
```bash
POST http://localhost:5000/api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello!"
}
```

## 🧪 Testing Checklist

### Backend Tests
- [ ] Server starts successfully
- [ ] Database connection established
- [ ] Health check endpoint responds
- [ ] Login with admin credentials works
- [ ] Can create/edit/delete projects (admin)
- [ ] Can create/edit/delete blog posts (admin)
- [ ] Contact form submission works
- [ ] File upload works (admin)

### Frontend Tests
- [ ] Main website loads correctly
- [ ] Projects load dynamically from API
- [ ] Contact form submits successfully
- [ ] Admin dashboard login works
- [ ] Can manage projects in admin dashboard
- [ ] Can manage blog posts in admin dashboard
- [ ] Can view contact submissions

### Integration Tests
- [ ] Projects created in admin appear on main site
- [ ] Contact form submissions appear in admin dashboard
- [ ] Authentication persists across page refreshes
- [ ] Logout works correctly

## 🔧 Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas, verify connection string and network access

### "CORS Error"
- Update `CLIENT_URL` in `backend/.env` to match your frontend URL
- If using Live Server, it's usually `http://127.0.0.1:5500`

### "API not loading projects"
- Check browser console for errors
- Verify backend server is running
- Check `API_BASE_URL` in `api.js` matches your backend URL

### "Cannot login to admin"
- Verify you ran `npm run seed`
- Check credentials: `admin@example.com` / `admin123`
- Check browser console for errors

## 📁 Project Structure

```
personal-blog/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & error handling
│   ├── scripts/         # Seed script
│   ├── server.js        # Main server file
│   ├── package.json
│   └── .env            # Environment variables
├── index.html          # Main website
├── admin.html          # Admin dashboard
├── api.js              # API client
├── api-integration.js  # Frontend API integration
├── script.js           # Main website scripts
├── admin.js            # Admin dashboard scripts
├── styles.css          # Styles
└── README.md
```

## 🎯 Next Steps

1. **Change Admin Password**: Login and create a new admin user with a secure password
2. **Add Your Projects**: Use the admin dashboard to add your actual projects
3. **Customize Content**: Update the about section and personal information
4. **Write Blog Posts**: Create your first blog post
5. **Deploy**: Deploy backend to Heroku/Railway and frontend to Netlify/Vercel

## 🔐 Security Notes

⚠️ **Before deploying to production:**
- Change `JWT_SECRET` to a strong random string
- Update admin credentials
- Set `NODE_ENV=production`
- Enable HTTPS
- Configure proper CORS origins
- Implement rate limiting

## 📚 Additional Resources

- [Backend README](backend/README.md) - Detailed backend documentation
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [JWT Authentication](https://jwt.io/)

---

Built with 💜 Node.js, Express, MongoDB, and vanilla JavaScript
