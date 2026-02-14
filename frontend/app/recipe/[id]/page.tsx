"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Recipe } from '@/lib/types'
import { ArrowLeft, Clock, Users } from 'lucide-react'
import Loading from '@/components/ui/Loading'
import SubstitutionModal from '@/components/SubstitutionModal'

export default function RecipePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null)

  useEffect(() => {
    loadRecipe()
  }, [params.id])

  const loadRecipe = async () => {
    try {
      const { recipe: recipeData } = await api.getRecipe(params.id)
      setRecipe(recipeData)
    } catch (error) {
      console.error('Failed to load recipe:', error)
      alert('Failed to load recipe')
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <Loading text="Loading recipe..." />
  }

  if (!recipe) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Results
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recipe Header */}
              <div className="card">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.name}</h1>
                {recipe.description && (
                  <p className="text-gray-600 mb-4">{recipe.description}</p>
                )}
                
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{recipe.prepTime + (recipe.cookTime || 0)} min total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{recipe.servings} servings</span>
                  </div>
                  {recipe.matchScore !== undefined && (
                    <div className="ml-auto px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold">
                      {recipe.matchScore}% Match
                    </div>
                  )}
                </div>
              </div>

              {/* Ingredients */}
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
                <p className="text-sm text-gray-600 mb-4">Click any ingredient to find substitutes</p>
                
                <div className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedIngredient(ingredient.name)}
                      className="w-full p-3 rounded-lg border-2 border-gray-200 hover:border-primary hover:bg-blue-50 transition-all text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold">{ingredient.amount} {ingredient.unit}</span>
                          <span className="ml-2 text-gray-700">{ingredient.name}</span>
                        </div>
                        <span className="text-primary opacity-0 group-hover:opacity-100 text-sm font-medium">
                          Find Substitute →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              {recipe.instructions && recipe.instructions.length > 0 && (
                <div className="card">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
                  <ol className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 pt-1">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Nutrition */}
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Nutrition (per serving)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Calories</span>
                    <span className="font-bold text-gray-900">{recipe.nutrition.calories}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Protein</span>
                    <span className="font-bold text-gray-900">{recipe.nutrition.protein}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Carbs</span>
                    <span className="font-bold text-gray-900">{recipe.nutrition.carbs}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fat</span>
                    <span className="font-bold text-gray-900">{recipe.nutrition.fat}g</span>
                  </div>
                  {recipe.nutrition.fiber && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Fiber</span>
                      <span className="font-bold text-gray-900">{recipe.nutrition.fiber}g</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Safety Warnings */}
              {recipe.safetyWarnings && recipe.safetyWarnings.length > 0 && (
                <div className="card bg-red-50 border-2 border-red-200">
                  <h3 className="text-lg font-bold text-red-900 mb-3">⚠️ Safety Warnings</h3>
                  <ul className="space-y-2">
                    {recipe.safetyWarnings.map((warning, index) => (
                      <li key={index} className="text-sm text-red-700">{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Substitution Modal */}
      {selectedIngredient && (
        <SubstitutionModal
          ingredient={selectedIngredient}
          recipeId={recipe.id}
          onClose={() => setSelectedIngredient(null)}
        />
      )}
    </div>
  )
}
