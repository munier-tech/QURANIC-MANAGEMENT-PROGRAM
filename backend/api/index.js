import app from '../index.js'
import mongoose from 'mongoose'
import { connectDb } from '../lib/connectdb.js'
import { getMongoCandidates, getMongoHelpMessage } from '../lib/mongoConfig.js'

// Vercel serverless function handler
export default async function handler(req, res) {
  const allowedOrigin = process.env.FRONTEND_URL || ''

  // Set CORS headers for Vercel
  if (allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin)
  }
  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Ensure DB connection per-invocation in serverless
  if (mongoose.connection.readyState !== 1 && getMongoCandidates().length > 0) {
    try {
      await connectDb()
    } catch (e) {
      console.error('DB connect error in serverless handler:', e)
      console.error('Help:', getMongoHelpMessage(e, getMongoCandidates()[0] || ''))
    }
  }

  // If hitting auth endpoints and DB is still down, fail fast with 503
  if (req.url?.startsWith('/api/auth') && mongoose.connection.readyState !== 1) {
    res.status(503).json({ message: 'Database unavailable', code: 'DB_UNAVAILABLE' })
    return
  }
  
  // Let Express handle the request
  app(req, res)
}
