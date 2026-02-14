'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/LoginForm'
import { ChefHat, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary py-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Powered by RecipeDB & FlavorDB
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              NutriContext
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4">
              Food that matches who you are, how you feel, and where you live
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Context-aware recipe platform with smart ingredient substitutions
            </p>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="card animate-fade-in">
            <div className="text-center mb-6">
              <ChefHat className="w-16 h-16 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Welcome</h2>
              <p className="text-gray-600 mt-2">Get personalized recipes matched to you</p>
            </div>

            <LoginForm />
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">118k+</div>
              <div className="text-xs text-gray-600">Recipes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-xs text-gray-600">Safe</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">AI</div>
              <div className="text-xs text-gray-600">Powered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
