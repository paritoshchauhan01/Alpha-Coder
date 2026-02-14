"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Recipe } from '@/lib/types'
import { Search, LogOut } from 'lucide-react'
import Loading from '@/components/ui/Loading'
import RecipeCard from '@/components/RecipeCard'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }

    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    loadRecentSearches()
  }, [router])

  const loadRecentSearches = async () => {
    try {
      const { searches } = await api.getRecentSearches()
      setRecentSearches(searches.map((s: any) => s.query).slice(0, 5))
    } catch (error) {
      console.error('Failed to load searches:', error)
    }
  }

  const handleSearch = async (e?: React.FormEvent, query?: string) => {
    if (e) e.preventDefault()
    const searchText = query || searchQuery
    if (!searchText.trim()) return

    setIsSearching(true)
    try {
      const data = await api.searchRecipes(searchText)
      setRecipes(data.recipes || [])
      if (!query) setSearchQuery('')
      await loadRecentSearches()
    } catch (error) {
      console.error('Search failed:', error)
      alert('Search failed. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (!user) {
    return <Loading text="Loading dashboard..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gradient">NutriContext</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Welcome, {user.name}!</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="card">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for recipes (e.g., pasta carbonara, chicken curry...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="btn-primary"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </form>

            {/* Recent Searches */}
            {recentSearches.length > 0 && recipes.length === 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">Recent Searches:</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(undefined, search)}
                      className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-700"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        {isSearching ? (
          <Loading text="Searching recipes..." />
        ) : recipes.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Search Results ({recipes.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Start Searching
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Enter a recipe name or ingredient above to find personalized recipes matched to your preferences
            </p>
          </div>
        )}
      </main>
    </div>
  )
}