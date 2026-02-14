import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const { data } = await apiClient.post('/auth/login', { email, password })
    return data
  },

  signup: async (email: string, password: string, name: string) => {
    const { data } = await apiClient.post('/auth/signup', { email, password, name })
    return data
  },

  demoLogin: async () => {
    const { data } = await apiClient.post('/auth/demo')
    return data
  },

  logout: () => {
    const isDemo = localStorage.getItem('isDemo')
    
    // Clear all stored data
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('isDemo')
    
    if (isDemo === 'true') {
      console.log('Demo session cleared')
      // Demo data automatically cleared since we're using the same demo account
    }
  },

  // Onboarding
  saveOnboarding: async (formData: any) => {
    const { data } = await apiClient.post('/onboarding', formData)
    return data
  },

  getOnboarding: async () => {
    const { data } = await apiClient.get('/onboarding')
    return data
  },

  // Recipes
  searchRecipes: async (query: string) => {
    const { data } = await apiClient.post('/recipes/search', { query })
    return data
  },

  getRecipe: async (id: string) => {
    const { data } = await apiClient.get(`/recipes/${id}`)
    return data
  },

  // Substitutions
  findSubstitutions: async (ingredient: string, recipeId?: string) => {
    const { data } = await apiClient.post('/substitutions', { ingredient, recipeId })
    return data
  },

  // User
  getProfile: async () => {
    const { data } = await apiClient.get('/user/profile')
    return data
  },

  getRecentSearches: async () => {
    const { data } = await apiClient.get('/user/searches')
    return data
  },
}
