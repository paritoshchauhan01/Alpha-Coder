import { useRouter } from 'next/navigation'
import { Recipe } from '@/lib/types'
import { Clock, ChefHat } from 'lucide-react'

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const router = useRouter()

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700 border-green-200'
    if (score >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-orange-100 text-orange-700 border-orange-200'
  }

  return (
    <div
      onClick={() => router.push(`/recipe/${recipe.id}`)}
      className="card hover:shadow-xl transition-all cursor-pointer group"
    >
      {/* Image */}
      <div className="mb-4 relative overflow-hidden rounded-lg bg-gray-200 h-48">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Match Score Badge */}
        {recipe.matchScore !== undefined && (
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full border-2 font-bold text-sm ${getScoreColor(recipe.matchScore)}`}>
            {recipe.matchScore}% Match
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
          {recipe.name}
        </h3>
        
        {recipe.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.prepTime || 0} min</span>
          </div>
          <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
            {recipe.difficulty || 'Medium'}
          </div>
        </div>

        {/* Safety Warnings */}
        {recipe.safetyWarnings && recipe.safetyWarnings.length > 0 && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            ⚠️ {recipe.safetyWarnings[0]}
          </div>
        )}
      </div>
    </div>
  )
}