# 🌍 Environment Variables for Vercel Deployment

## 🔧 **Current Local Environment Variables**
```env
PORT=4000
MONGO_URI=mongodb+srv://DBUSER:dbuserpassword123@cluster0.sp1lws4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
ACCESS_TOKEN_SECRET=FDZGHJYRT123456
CLOUDINARY_CLOUD_NAME=dzeznfc99
CLOUDINARY_API_KEY=499952982913397
CLOUDINARY_API_SECRET=1N02Ht_ygu2uLp9zGIy5FRNo9PM
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## 🚀 **Vercel Production Environment Variables**
You need to set these in your Vercel dashboard:

### **Backend Environment Variables:**
```env
MONGO_URI=mongodb+srv://DBUSER:dbuserpassword123@cluster0.sp1lws4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
ACCESS_TOKEN_SECRET=FDZGHJYRT123456
CLOUDINARY_CLOUD_NAME=dzeznfc99
CLOUDINARY_API_KEY=499952982913397
CLOUDINARY_API_SECRET=1N02Ht_ygu2uLp9zGIy5FRNo9PM
FRONTEND_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

### **Frontend Environment Variables:**
```env
VITE_REACT_APP_API_URL=https://your-app-name.vercel.app/api
```

## 📋 **Important Notes**

### **Variables to Change for Production:**
- ❌ **Remove**: `PORT=4000` (Vercel sets this automatically)
- ❌ **Remove**: `FRONTEND_URL=http://localhost:5173` (use Vercel domain)
- ✅ **Change**: `NODE_ENV=development` → `NODE_ENV=production`

### **Variables to Keep the Same:**
- ✅ **Keep**: `MONGO_URI` (your MongoDB connection)
- ✅ **Keep**: `ACCESS_TOKEN_SECRET` (your JWT secret)
- ✅ **Keep**: All Cloudinary credentials

## 🔧 **How to Set in Vercel**

1. **Go to Vercel Dashboard** → Your Project → Settings
2. **Click "Environment Variables"**
3. **Add each variable** with "Production" environment selected
4. **Redeploy** after adding variables

## 🚨 **Security Warning**

⚠️ **Never commit `.env` files to Git!**
- Keep your local `.env` file for development
- Set production variables in Vercel dashboard only
- Consider rotating your database password since it's been exposed

---

**After setting these variables, your deployment should work exactly like the working `cursor/say-hello-860a` branch!** 🎉