# Deployment Guide - quranic management system

## Vercel Deployment

This guide will help you deploy your quranic management system to Vercel.

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Environment Variables**: Prepare your environment variables

### Step 1: Environment Variables Setup

Create a `.env` file in your root directory with the following variables:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Frontend URL (for CORS)
FRONTEND_URL=https://your-app-name.vercel.app

# Node Environment
NODE_ENV=production

# Optional: Cloudinary (if using file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Step 2: Vercel Configuration

The project includes a `vercel.json` file that handles:
- Backend API routes (`/api/*`)
- Frontend static files
- SPA routing (all routes serve `index.html`)

### Step 3: Deploy to Vercel

#### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

#### Option B: Deploy via GitHub Integration

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the following settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (root of your project)
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/dist`

### Step 4: Environment Variables in Vercel

1. In your Vercel project dashboard, go to "Settings" → "Environment Variables"
2. Add all the environment variables from your `.env` file
3. Make sure to set them for "Production" environment

### Step 5: Build Configuration

The deployment uses the following build process:

1. **Backend**: Uses `@vercel/node` to run the Express server
2. **Frontend**: Uses `@vercel/static-build` to build the React app

### Step 6: Verify Deployment

After deployment, verify:

1. **API Endpoints**: Visit `https://your-app.vercel.app/api` - should show API status
2. **Frontend**: Visit `https://your-app.vercel.app` - should show your React app
3. **Database Connection**: Check if your app can connect to MongoDB

### Troubleshooting

#### Common Issues:

1. **Build Failures**:
   - Check if all dependencies are in `package.json`
   - Ensure Node.js version is compatible (>=18.0.0)

2. **API Routes Not Working**:
   - Verify environment variables are set in Vercel
   - Check MongoDB connection string
   - Ensure CORS is properly configured

3. **Frontend Not Loading**:
   - Check if the build output is in `frontend/dist`
   - Verify routing configuration in `vercel.json`

4. **Environment Variables**:
   - Make sure all required env vars are set in Vercel dashboard
   - Check if variable names match exactly

#### Debug Commands:

```bash
# Check build locally
npm run build

# Test API locally
cd backend && npm start

# Test frontend locally
cd frontend && npm run dev
```

### File Structure for Deployment

```
/
├── vercel.json              # Vercel configuration
├── .vercelignore           # Files to exclude from deployment
├── package.json            # Root package.json
├── backend/
│   ├── index.js           # Main server file
│   ├── package.json       # Backend dependencies
│   └── ...                # Backend files
└── frontend/
    ├── package.json       # Frontend dependencies
    ├── vite.config.js     # Vite configuration
    ├── dist/              # Build output (generated)
    └── ...                # Frontend files
```

### Performance Optimization

1. **Enable Caching**: Vercel automatically caches static assets
2. **CDN**: Vercel provides global CDN for faster loading
3. **Serverless Functions**: API routes run as serverless functions

### Monitoring

1. **Vercel Analytics**: Enable in project settings
2. **Function Logs**: Check Vercel dashboard for API logs
3. **Performance**: Monitor Core Web Vitals in Vercel dashboard

### Security

1. **Environment Variables**: Never commit sensitive data
2. **CORS**: Properly configured for production
3. **Rate Limiting**: Implemented in backend
4. **Helmet**: Security headers enabled

### Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally first
4. Check MongoDB connection
5. Review CORS configuration

For more help, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
