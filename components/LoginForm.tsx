'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import Input from './ui/Input'
import Button from './ui/Button'

type FormMode = 'login' | 'signup'

export default function LoginForm() {
  const router = useRouter()
  const [mode, setMode] = useState<FormMode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      let response
      if (mode === 'signup') {
        response = await api.signup(email, password, name)
      } else {
        response = await api.login(email, password)
      }
      
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      if (response.onboardingCompleted) {
        router.push('/dashboard')
      } else {
        router.push('/onboarding')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || `${mode === 'signup' ? 'Signup' : 'Login'} failed`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setError('')
    setIsLoading(true)

    try {
      const response = await api.demoLogin()
      
      // Store with demo flag so we can clear it on logout
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      localStorage.setItem('isDemo', 'true') // Mark as demo user

      if (response.onboardingCompleted) {
        router.push('/dashboard')
      } else {
        router.push('/onboarding')
      }
    } catch (err: any) {
      console.error('Demo login failed:', err)
      setError(err.response?.data?.error || 'Demo login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    setError('')
    setName('')
    setEmail('')
    setPassword('')
  }

  return (
    <div className="space-y-6">
      {/* Login/Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            {mode === 'login' 
              ? 'Sign in to access your personalized recipes' 
              : 'Create an account to save your preferences'}
          </p>
        </div>

        {mode === 'signup' && (
          <Input
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        )}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" isLoading={isLoading} className="w-full">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>

        {/* Toggle between Login/Signup */}
        <div className="text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm text-primary hover:text-secondary transition-colors"
          >
            {mode === 'login' 
              ? "Don't have an account? Sign up" 
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or try demo</span>
        </div>
      </div>

      {/* Demo Login Button */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? 'Loading...' : (
            <>
              <span className="text-lg">🚀</span>
              Try Demo Account
            </>
          )}
        </button>
        
        <p className="text-xs text-gray-500 text-center">
          No signup • Instant access • Demo data will be cleared on logout
        </p>
      </div>
    </div>
  )
}
