# 🚀 Vercel Single Repository Deployment Guide

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be on GitHub
3. **Environment Variables**: Prepare your environment variables

## 🔧 Step-by-Step Deployment Instructions

### **Step 1: Prepare Your Repository**

1. **Ensure all files are committed and pushed to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Verify your project structure**:
   ```
   your-project/
   ├── backend/
   │   ├── index.js
   │   ├── package.json
   │   └── ...
   ├── frontend/
   │   ├── package.json
   │   ├── vite.config.js
   │   └── ...
   ├── package.json
   ├── vercel.json
   └── .vercelignore
   ```

### **Step 2: Deploy to Vercel**

#### **Option A: Deploy via Vercel Dashboard (Recommended)**

1. **Go to [vercel.com](https://vercel.com) and sign in**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave empty)
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm run install-all`

#### **Option B: Deploy via Vercel CLI**

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

### **Step 3: Configure Environment Variables**

In your Vercel project dashboard, go to **Settings > Environment Variables** and add:

#### **Backend Environment Variables**:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ACCESS_TOKEN_SECRET=your_access_token_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=production
```

#### **Frontend Environment Variables**:
```
VITE_REACT_APP_API_URL=https://your-vercel-domain.vercel.app/api
```

### **Step 4: Configure Domain (Optional)**

1. **Go to your Vercel project dashboard**
2. **Click "Settings" > "Domains"**
3. **Add your custom domain**

## 🔍 Troubleshooting Common Issues

### **Issue 1: Build Fails**
- **Solution**: Check that all dependencies are properly listed in package.json files
- **Check**: Ensure Node.js version is compatible (>=18.0.0)

### **Issue 2: API Routes Not Working**
- **Solution**: Verify that your backend routes start with `/api/`
- **Check**: Ensure vercel.json routing is correct

### **Issue 3: Environment Variables Not Loading**
- **Solution**: Redeploy after adding environment variables
- **Check**: Ensure variable names match your code

### **Issue 4: Frontend Can't Connect to Backend**
- **Solution**: Update frontend API URL to use your Vercel domain
- **Check**: Ensure CORS is properly configured in backend

## 📁 Important Files for Deployment

### **vercel.json** (Root Configuration)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/index.js"
    },
    {
      "src": "/(.*\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot))",
      "dest": "/frontend/dist/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/dist/index.html"
    }
    }
  ]
}
```

### **package.json** (Root)
```json
{
  "scripts": {
    "build": "cd frontend && npm install && npm run build",
    "install-all": "npm install && cd backend && npm install && cd ../frontend && npm install"
  }
}
```

## 🎯 Deployment Checklist

- [ ] All code committed and pushed to GitHub
- [ ] Environment variables configured in Vercel
- [ ] Build command working locally (`npm run build`)
- [ ] Backend API routes start with `/api/`
- [ ] Frontend API URL updated to production domain
- [ ] CORS configured for production domain
- [ ] Database connection string updated for production
- [ ] Cloudinary credentials configured

## 🔄 Continuous Deployment

Once deployed, Vercel will automatically redeploy when you push to your main branch.

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally first
4. Check browser console for errors

---

**Your app should now be live at: `https://your-project-name.vercel.app`**