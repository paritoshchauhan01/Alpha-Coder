// src/server.ts
import express, { Application } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes'
import { errorHandler } from './middleware'

dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.use(errorHandler)

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    console.log('✅ MongoDB connected successfully')
    return true
  } catch (error) {
    console.error('⚠️  MongoDB connection failed:', error)
    console.log('💡 Using mock/fallback data - demo features will work')
    return false
  }
}

const startServer = async () => {
  const dbConnected = await connectDB()
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📝 Environment: ${process.env.NODE_ENV}`)
    if (!dbConnected) {
      console.log('📦 Using MOCK DATA - all features available without database')
    } else {
      console.log('✅ Database connected - data is persistent')
    }
  })
}

startServer()

export default app