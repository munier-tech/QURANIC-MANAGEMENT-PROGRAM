# Troubleshooting Guide - Vercel Deployment Issues

## Login Failed After Deployment

If you're experiencing login failures after deploying to Vercel, follow this troubleshooting guide.

### 🔍 **Step 1: Check Environment Variables**

Make sure these environment variables are set in your Vercel dashboard:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Frontend URL (important!)
FRONTEND_URL=https://your-app-name.vercel.app

# Environment
NODE_ENV=production

# Optional: Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 🔍 **Step 2: Test API Connection**

1. Visit your deployed app
2. Open browser developer tools (F12)
3. Go to the **Console** tab
4. Look for API connection logs
5. Test the API endpoint: `https://your-app.vercel.app/api`

You should see a response like:
```json
{
  "message": "quranic management system API is running!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### 🔍 **Step 3: Check CORS Issues**

If you see CORS errors in the console:

1. **Check the CORS configuration** in `backend/index.js`
2. **Verify your domain** is in the allowed origins list
3. **Add your Vercel URL** to the allowed origins

### 🔍 **Step 4: Debug API Calls**

Add the API test component to your app temporarily:

1. Import the `ApiTest` component in your main page
2. Add it to your component to see connection status
3. Check the console for detailed error messages

### 🔍 **Step 5: Common Issues and Solutions**

#### Issue 1: "Network Error" or "Failed to fetch"
**Cause**: Frontend can't reach the backend API
**Solution**: 
- Check if the API routes are properly configured in `vercel.json`
- Verify the backend is deployed correctly
- Check Vercel function logs

#### Issue 2: "CORS Error"
**Cause**: Backend not allowing requests from frontend domain
**Solution**:
- Update CORS configuration in `backend/index.js`
- Add your Vercel domain to allowed origins
- Check environment variables

#### Issue 3: "401 Unauthorized"
**Cause**: Authentication issues
**Solution**:
- Check JWT_SECRET environment variable
- Verify MongoDB connection
- Check auth routes are working

#### Issue 4: "500 Internal Server Error"
**Cause**: Backend server error
**Solution**:
- Check Vercel function logs
- Verify MongoDB connection string
- Check all environment variables are set

### 🔍 **Step 6: Vercel Function Logs**

1. Go to your Vercel dashboard
2. Click on your project
3. Go to **Functions** tab
4. Check the logs for any errors

### 🔍 **Step 7: Test Locally First**

Before deploying, test locally:

```bash
# Start backend
cd backend && npm start

# Start frontend (in another terminal)
cd frontend && npm run dev

# Test login functionality
```

### 🔍 **Step 8: Environment Variable Debugging**

Add this to your frontend to debug environment variables:

```javascript
console.log('Environment Variables:');
console.log('MODE:', import.meta.env.MODE);
console.log('VITE_REACT_APP_API_URL:', import.meta.env.VITE_REACT_APP_API_URL);
console.log('Current URL:', window.location.origin);
```

### 🔍 **Step 9: API Base URL Issues**

The frontend should use relative URLs in production:

```javascript
// ✅ Correct for Vercel
const BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'

// ❌ Wrong for Vercel
const BASE_URL = 'https://your-backend.vercel.app/api'
```

### 🔍 **Step 10: Redeploy After Changes**

After making changes:

1. Commit and push your changes
2. Redeploy on Vercel
3. Clear browser cache
4. Test again

### 🔍 **Step 11: Check Network Tab**

1. Open browser developer tools
2. Go to **Network** tab
3. Try to login
4. Look for failed requests
5. Check request/response details

### 🔍 **Step 12: Common Error Messages**

| Error Message | Likely Cause | Solution |
|---------------|--------------|----------|
| "Failed to fetch" | Network/CORS issue | Check API routes and CORS |
| "401 Unauthorized" | Auth issue | Check JWT and credentials |
| "500 Internal Server Error" | Server error | Check Vercel logs |
| "CORS error" | Origin not allowed | Update CORS configuration |

### 🔍 **Step 13: Final Checklist**

- [ ] Environment variables set in Vercel
- [ ] MongoDB connection string is correct
- [ ] JWT_SECRET is set
- [ ] FRONTEND_URL is set correctly
- [ ] CORS configuration includes your domain
- [ ] API routes are working (`/api` endpoint)
- [ ] No console errors in browser
- [ ] Vercel function logs show no errors

### 🔍 **Step 14: Get Help**

If issues persist:

1. Check Vercel documentation
2. Review this troubleshooting guide
3. Check GitHub issues
4. Contact support with specific error messages

### 🔍 **Step 15: Alternative Testing**

Use curl to test API directly:

```bash
# Test API endpoint
curl https://your-app.vercel.app/api

# Test login endpoint
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

This should help you identify and fix the connection issues between your frontend and backend on Vercel.
