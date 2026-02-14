import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Substitution } from '@/lib/types'
import { X, Loader2, Info } from 'lucide-react'

interface SubstitutionModalProps {
  ingredient: string
  recipeId: string
  onClose: () => void
}

export default function SubstitutionModal({ ingredient, recipeId, onClose }: SubstitutionModalProps) {
  const [substitutions, setSubstitutions] = useState<Substitution[]>([])
  const [molecules, setMolecules] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSubstitutions()
  }, [ingredient])

  const loadSubstitutions = async () => {
    try {
      const data = await api.findSubstitutions(ingredient, recipeId)
      setSubstitutions(data.alternatives || [])
      setMolecules(data.molecules || [])
    } catch (error) {
      console.error('Failed to load substitutions:', error)
      alert('Failed to load substitutions')
    } finally {
      setIsLoading(false)
    }
  }

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700 border-green-200'
    if (score >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-orange-100 text-orange-700 border-orange-200'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Substitutions for {ingredient}</h2>
            <p className="text-sm text-gray-600 mt-1">Based on FlavorDB molecular analysis</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-gray-600">Analyzing flavor molecules...</p>
            </div>
          ) : (
            <>
              {/* Flavor Molecules */}
              {molecules.length > 0 && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900">Key Flavor Molecules</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        These chemical compounds give {ingredient} its distinctive taste
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {molecules.map((molecule, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white border border-blue-300 rounded-full text-sm text-blue-900 font-medium"
                      >
                        {molecule}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Substitution Options */}
              {substitutions.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Recommended Alternatives</h3>
                  {substitutions.map((sub, index) => (
                    <div
                      key={index}
                      className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-all"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-bold text-gray-900">{sub.name}</h4>
                        <div className={`px-3 py-1 rounded-full border-2 font-bold text-sm ${getMatchColor(sub.flavorMatch)}`}>
                          {sub.flavorMatch}% Match
                        </div>
                      </div>

                      {/* Shared Molecules */}
                      {sub.sharedMolecules && sub.sharedMolecules.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Shared Molecules</p>
                          <div className="flex flex-wrap gap-1">
                            {sub.sharedMolecules.map((molecule, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs"
                              >
                                {molecule}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reason */}
                      <p className="text-sm text-gray-700 mb-3">{sub.reason}</p>

                      {/* Nutrition Impact */}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Nutrition Impact</p>
                        <p className="text-sm text-gray-700">{sub.nutritionImpact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No suitable substitutions found for {ingredient}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-4">
          <button onClick={onClose} className="btn-secondary w-full">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
