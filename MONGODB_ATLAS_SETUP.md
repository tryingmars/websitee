# MongoDB Atlas Configuration Guide

Your MongoDB Atlas connection string has been provided. Follow these steps to configure it:

## Step 1: Update the Connection String

Replace the placeholders in your connection string:

**Original:**
```
mongodb+srv://<db_username>:<db_password>@cluster0.ewkqacn.mongodb.net/?appName=Cluster0
```

**Updated (example):**
```
mongodb+srv://admin:YourSecurePassword123@cluster0.ewkqacn.mongodb.net/personal-blog?retryWrites=true&w=majority&appName=Cluster0
```

**Important changes:**
1. Replace `<db_username>` with your MongoDB Atlas username
2. Replace `<db_password>` with your MongoDB Atlas password
3. Add `/personal-blog` after `.mongodb.net` to specify the database name
4. Add `retryWrites=true&w=majority` for better reliability

## Step 2: Create .env File

Since `.env` is gitignored, you need to create it manually:

1. Navigate to the `backend` folder
2. Create a new file named `.env` (copy from `.env.example`)
3. Update the `MONGODB_URI` with your Atlas connection string

**Example .env file:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - MongoDB Atlas
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.ewkqacn.mongodb.net/personal-blog?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret (Change this to a random string in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# CORS
CLIENT_URL=http://127.0.0.1:5500

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

## Step 3: MongoDB Atlas Setup Checklist

Make sure you've completed these steps in MongoDB Atlas:

✅ **Database User Created**
- Go to Database Access
- Create a user with username and password
- Grant "Read and write to any database" permissions

✅ **Network Access Configured**
- Go to Network Access
- Add your IP address (or use 0.0.0.0/0 for testing - not recommended for production)

✅ **Database Created**
- The database `personal-blog` will be created automatically when you run the seed script

## Step 4: Test the Connection

Once configured, test the connection:

```bash
cd backend
npm install
npm run seed
```

You should see:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
👤 Created admin user
📁 Created 3 sample projects
📝 Created sample blog post
✨ Database seeded successfully!
```

## Step 5: Start the Server

```bash
npm start
```

You should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.ewkqacn.mongodb.net
🚀 Server running in development mode on port 5000
```

## Troubleshooting

**Error: "Authentication failed"**
- Double-check your username and password
- Make sure there are no special characters that need URL encoding
- If password has special characters, encode them (e.g., @ becomes %40)

**Error: "IP not whitelisted"**
- Add your IP address in MongoDB Atlas Network Access
- Or temporarily use 0.0.0.0/0 for testing

**Error: "Connection timeout"**
- Check your internet connection
- Verify the cluster URL is correct
- Check firewall settings

## Security Notes

⚠️ **Important:**
- Never commit `.env` file to git (it's already in .gitignore)
- Use a strong password for your MongoDB Atlas user
- In production, whitelist only specific IP addresses
- Change the JWT_SECRET to a strong random string

## Next Steps

After successful connection:
1. Run `npm run seed` to populate the database
2. Start the server with `npm start`
3. Access admin dashboard at `admin.html`
4. Login with: admin@example.com / admin123

Your data will now be stored in MongoDB Atlas cloud instead of a local database! 🎉
