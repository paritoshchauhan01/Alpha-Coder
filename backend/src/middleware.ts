// src/middleware.ts
import { Request, Response, NextFunction } from 'express'
import { verifyJWT, extractToken } from './utils'

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        email: string
      }
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractToken(req.headers.authorization)
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }
    const decoded = verifyJWT(token)
    req.user = { userId: decoded.userId, email: decoded.email }
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err)
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation error', details: err.message })
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Resource already exists', details: 'A user with this email already exists' })
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' })
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}