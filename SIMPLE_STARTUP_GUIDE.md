# 🚀 Simple Startup Guide - Get Your Project Working

## Step 1: Stop Everything and Start Fresh

```bash
# Stop all running processes
pkill -f "node"
pkill -f "vite"
```

## Step 2: Start Backend

```bash
# Go to backend folder
cd /workspace/backend

# Start the backend server
npm run dev
```

**✅ Backend should show:** 
- "MongoDB connected: cluster0.lvuu79n.mongodb.net"
- "Server running on port 5000"

## Step 3: Start Frontend (in a new terminal)

```bash
# Go to frontend folder
cd /workspace/frontend

# Start the frontend
npm run dev
```

**✅ Frontend should show:**
- "Local: http://localhost:5173"

## Step 4: Test Your Application

1. Open browser: `http://localhost:5173`
2. Login to your application
3. Go to student details page
4. Check the tabs:
   - **Exam Records** - Should show subject names
   - **Discipline Reports** - Should show discipline data

## 🎯 What We Fixed

- ✅ **examRecords tab**: Subject names now display properly
- ✅ **disciplineReports tab**: Uses correct field names (`reason` instead of `description`)
- ✅ **Backend**: Fixed Cloudinary issues and database connection

## 🆘 If Something Doesn't Work

### Backend Issues:
```bash
cd /workspace/backend
npm install
node index.js
```

### Frontend Issues:
```bash
cd /workspace/frontend
npm install
npm run dev
```

### Database Issues:
Check your `.env` file has:
```
MONGO_URI=mongodb+srv://muniry399:dr5YOsSCXh6kQ5eY@cluster0.lvuu79n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

## 📞 Quick Test Commands

**Test Backend:**
```bash
curl http://localhost:5000/api
```

**Expected Response:**
```json
{"message":"quranic management system API is running!"}
```

## ✨ Remember: Keep It Simple!

1. **Backend first** (port 5000)
2. **Frontend second** (port 5173) 
3. **Test in browser**

You've got this! 💪
