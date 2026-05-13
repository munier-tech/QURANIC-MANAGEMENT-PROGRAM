#!/bin/bash

# Test Deployment Script for quranic management system
# Run this after deployment to verify everything is working

echo "🚀 Testing quranic management system Deployment"
echo "=================================================="

# Get the deployment URL from user input
read -p "Enter your Vercel deployment URL (e.g., https://your-app.vercel.app): " DEPLOYMENT_URL

if [ -z "$DEPLOYMENT_URL" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

echo ""
echo "🔍 Testing Frontend..."
echo "Testing: $DEPLOYMENT_URL/health"

# Test frontend health check
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/health")
if [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo "✅ Frontend is working (HTTP $FRONTEND_RESPONSE)"
else
    echo "❌ Frontend error (HTTP $FRONTEND_RESPONSE)"
fi

echo ""
echo "🔍 Testing Backend API..."
echo "Testing: $DEPLOYMENT_URL/api"

# Test backend API
BACKEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/api")
if [ "$BACKEND_RESPONSE" = "200" ]; then
    echo "✅ Backend API is working (HTTP $BACKEND_RESPONSE)"
else
    echo "❌ Backend API error (HTTP $BACKEND_RESPONSE)"
fi

echo ""
echo "🔍 Testing Root Route..."
echo "Testing: $DEPLOYMENT_URL/"

# Test root route
ROOT_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/")
if [ "$ROOT_RESPONSE" = "200" ]; then
    echo "✅ Root route is working (HTTP $ROOT_RESPONSE)"
else
    echo "❌ Root route error (HTTP $ROOT_RESPONSE)"
fi

echo ""
echo "🔍 Testing Login Route..."
echo "Testing: $DEPLOYMENT_URL/login"

# Test login route
LOGIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/login")
if [ "$LOGIN_RESPONSE" = "200" ]; then
    echo "✅ Login route is working (HTTP $LOGIN_RESPONSE)"
else
    echo "❌ Login route error (HTTP $LOGIN_RESPONSE)"
fi

echo ""
echo "📊 Summary:"
echo "Frontend: $([ "$FRONTEND_RESPONSE" = "200" ] && echo "✅ Working" || echo "❌ Error")"
echo "Backend: $([ "$BACKEND_RESPONSE" = "200" ] && echo "✅ Working" || echo "❌ Error")"
echo "Root: $([ "$ROOT_RESPONSE" = "200" ] && echo "✅ Working" || echo "❌ Error")"
echo "Login: $([ "$LOGIN_RESPONSE" = "200" ] && echo "✅ Working" || echo "❌ Error")"

echo ""
echo "🌐 Open these URLs in your browser to test manually:"
echo "Frontend Health: $DEPLOYMENT_URL/health"
echo "Backend API: $DEPLOYMENT_URL/api"
echo "Login Page: $DEPLOYMENT_URL/login"
echo "Root: $DEPLOYMENT_URL/"

echo ""
echo "🔧 If you encounter issues:"
echo "1. Check Vercel dashboard for build errors"
echo "2. Verify environment variables are set"
echo "3. Check browser console for JavaScript errors"
echo "4. Review the DEPLOYMENT_VERIFICATION.md file"
