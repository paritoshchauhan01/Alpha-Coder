'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import Button from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    lifeStage: '',
    location: { country: '', climate: '' },
    allergies: [] as string[],
    dietaryRestrictions: [] as string[],
    favoriteCuisines: [] as string[],
  })

  const lifeStages = [
    { id: 'new_mother', label: 'New Mother', icon: '👶' },
    { id: 'parent', label: 'Parent', icon: '👨‍👩‍👧' },
    { id: 'general', label: 'General', icon: '👤' },
    { id: 'elderly', label: 'Elderly', icon: '👴' },
  ]

  const climates = ['hot', 'cold', 'temperate', 'tropical']
  
  const commonAllergies = ['peanuts', 'shellfish', 'dairy', 'eggs', 'soy', 'gluten', 'fish', 'nuts']
  const commonRestrictions = ['vegetarian', 'vegan', 'halal', 'kosher', 'gluten-free']
  const commonCuisines = ['italian', 'chinese', 'indian', 'mexican', 'thai', 'japanese', 'mediterranean']

  const toggleArray = (array: string[], value: string) => {
    if (array.includes(value)) {
      return array.filter(item => item !== value)
    }
    return [...array, value]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await api.saveOnboarding(formData)
      router.push('/dashboard')
    } catch (error) {
      console.error('Onboarding failed:', error)
      alert('Failed to save preferences. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="card">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Let's Personalize Your Experience</h1>
          <p className="text-gray-600 mb-8">Answer a few quick questions to get personalized recipes</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Question 1: Life Stage */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                1. Who are you? *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {lifeStages.map((stage) => (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, lifeStage: stage.id })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.lifeStage === stage.id
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{stage.icon}</div>
                    <div className="font-medium text-sm">{stage.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Location */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                2. Where are you located? *
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Country (e.g., USA, India, UK)"
                  value={formData.location.country}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, country: e.target.value }
                  })}
                  className="input-field"
                  required
                />
                <select
                  value={formData.location.climate}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, climate: e.target.value }
                  })}
                  className="input-field"
                  required
                >
                  <option value="">Select Climate</option>
                  {climates.map((climate) => (
                    <option key={climate} value={climate}>
                      {climate.charAt(0).toUpperCase() + climate.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Question 3: Allergies */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                3. Any food allergies?
              </label>
              <div className="flex flex-wrap gap-2">
                {commonAllergies.map((allergy) => (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      allergies: toggleArray(formData.allergies, allergy)
                    })}
                    className={`px-4 py-2 rounded-full border-2 transition-all ${
                      formData.allergies.includes(allergy)
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {allergy}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 4: Dietary Restrictions */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                4. Any dietary restrictions?
              </label>
              <div className="flex flex-wrap gap-2">
                {commonRestrictions.map((restriction) => (
                  <button
                    key={restriction}
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      dietaryRestrictions: toggleArray(formData.dietaryRestrictions, restriction)
                    })}
                    className={`px-4 py-2 rounded-full border-2 transition-all ${
                      formData.dietaryRestrictions.includes(restriction)
                        ? 'border-primary bg-blue-50 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {restriction}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 5: Favorite Cuisines */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                5. Favorite cuisines?
              </label>
              <div className="flex flex-wrap gap-2">
                {commonCuisines.map((cuisine) => (
                  <button
                    key={cuisine}
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      favoriteCuisines: toggleArray(formData.favoriteCuisines, cuisine)
                    })}
                    className={`px-4 py-2 rounded-full border-2 transition-all ${
                      formData.favoriteCuisines.includes(cuisine)
                        ? 'border-primary bg-blue-50 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t">
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={!formData.lifeStage || !formData.location.country || !formData.location.climate}
                className="w-full py-4 text-lg"
              >
                Complete Setup →
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}