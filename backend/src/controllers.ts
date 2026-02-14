// src/controllers.ts
import { Request, Response, NextFunction } from 'express'
import { User, UserContext, RecipeCache, SearchHistory } from './models'
import { mockDB } from './mockDB'
import * as recipeDB from './services/recipeDB'
import * as flavorDB from './services/flavorDB'
import * as scoring from './services/scoring'
import { hashPassword, comparePassword, generateJWT } from './utils'

// Flag to track if database is available
let dbAvailable = true

// Helper to use mock DB as fallback
const withFallback = async (dbOperation: () => Promise<any>, mockOperation: () => Promise<any>) => {
  try {
    return await dbOperation()
  } catch (error: any) {
    if (error.name === 'MongooseError' || error.message?.includes('buffering') || !dbAvailable) {
      console.log('📦 Using mock data (database unavailable)')
      dbAvailable = false
      return await mockOperation()
    }
    throw error
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    
    // Try database first, fallback to mock
    const user = await withFallback(
      () => User.findOne({ email: email.toLowerCase() }),
      () => mockDB.findUserByEmail(email)
    )
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    const isValidPassword = await comparePassword(password, user.passwordHash)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    const token = generateJWT(user._id.toString(), user.email)
    
    const userContext = !dbAvailable 
      ? await mockDB.findUserContextByUserId(user._id.toString())
      : await UserContext.findOne({ userId: user._id })
    
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
      onboardingCompleted: !!userContext?.onboardingCompleted
    })
  } catch (error) {
    next(error)
  }
}

export async function demoLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const email = 'demo@nutricontext.com'
    
    // Check if demo user already exists
    let demoUser = await withFallback(
      () => User.findOne({ email }),
      () => mockDB.findUserByEmail(email)
    )
    
    if (!demoUser) {
      const hashedPassword = await hashPassword('Demo123!')
      demoUser = !dbAvailable
        ? await mockDB.createUser(email, hashedPassword, 'Demo User')
        : await User.create({
            email,
            passwordHash: hashedPassword,
            name: 'Demo User'
          })
      
      // Create user context
      if (!dbAvailable) {
        await mockDB.saveUserContext(demoUser._id.toString(), {
          lifeStage: 'new_mother',
          location: { country: 'USA', climate: 'cold' },
          allergies: ['peanuts'],
          dietaryRestrictions: ['vegetarian'],
          favoriteCuisines: ['italian', 'indian'],
          onboardingCompleted: true
        })
      } else {
        await UserContext.create({
          userId: demoUser._id,
          lifeStage: 'new_mother',
          location: { country: 'USA', climate: 'cold' },
          allergies: ['peanuts'],
          dietaryRestrictions: ['vegetarian'],
          favoriteCuisines: ['italian', 'indian'],
          onboardingCompleted: true
        })
      }
    }
    
    const token = generateJWT(demoUser._id.toString(), demoUser.email)
    res.json({
      token,
      user: { id: demoUser._id, email: demoUser.email, name: demoUser.name },
      onboardingCompleted: true
    })
  } catch (error) {
    next(error)
  }
}

export async function saveOnboarding(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId
    const { lifeStage, location, allergies, dietaryRestrictions, favoriteCuisines } = req.body
    if (!lifeStage || !location?.country || !location?.climate) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    
    const contextData = {
      lifeStage,
      location,
      allergies: allergies || [],
      dietaryRestrictions: dietaryRestrictions || [],
      favoriteCuisines: favoriteCuisines || [],
      onboardingCompleted: true
    }
    
    let userContext
    
    if (!dbAvailable) {
      // Use mock database
      userContext = await mockDB.saveUserContext(userId, contextData)
    } else {
      // Use MongoDB
      userContext = await UserContext.findOne({ userId })
      if (userContext) {
        userContext.lifeStage = lifeStage
        userContext.location = location
        userContext.allergies = allergies || []
        userContext.dietaryRestrictions = dietaryRestrictions || []
        userContext.favoriteCuisines = favoriteCuisines || []
        userContext.onboardingCompleted = true
        userContext.updatedAt = new Date()
        await userContext.save()
      } else {
        userContext = await UserContext.create({
          userId,
          ...contextData
        })
      }
    }
    
    res.json({ success: true, message: 'Onboarding completed successfully', context: userContext })
  } catch (error) {
    next(error)
  }
}

export async function getOnboarding(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId
    const userContext = !dbAvailable
      ? await mockDB.findUserContextByUserId(userId)
      : await UserContext.findOne({ userId })
    
    if (!userContext) {
      return res.status(404).json({ error: 'Onboarding data not found' })
    }
    res.json({ context: userContext })
  } catch (error) {
    next(error)
  }
}

export async function searchRecipes(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId
    const { query } = req.body
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' })
    }
    const userContext = !dbAvailable
      ? await mockDB.findUserContextByUserId(userId)
      : await UserContext.findOne({ userId })
    
    const recipes = await recipeDB.searchRecipes(query, 30)
    const scoredRecipes = scoring.scoreRecipes(recipes, userContext)
    const safeRecipes = scoredRecipes.filter(r => r.matchScore > 0)
    safeRecipes.sort((a, b) => b.matchScore - a.matchScore)
    const topRecipes = safeRecipes.slice(0, 20)
    
    if (!dbAvailable) {
      await mockDB.addSearchHistory(userId, query)
    } else {
      await SearchHistory.create({ userId, query, timestamp: new Date() })
    }
    
    res.json({ recipes: topRecipes, total: topRecipes.length, query })
  } catch (error) {
    next(error)
  }
}

export async function getRecipeById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const userId = req.user!.userId
    let recipe
    
    if (!dbAvailable) {
      recipe = await mockDB.getCachedRecipe(id)
      if (!recipe) {
        recipe = await recipeDB.getRecipeById(id)
        await mockDB.cacheRecipe(id, recipe)
      }
    } else {
      let cachedRecipe = await RecipeCache.findOne({ recipeId: id })
      if (cachedRecipe) {
        recipe = cachedRecipe.data
      } else {
        recipe = await recipeDB.getRecipeById(id)
        await RecipeCache.create({ recipeId: id, data: recipe })
      }
    }
    
    const userContext = !dbAvailable
      ? await mockDB.findUserContextByUserId(userId)
      : await UserContext.findOne({ userId })
    
    const matchScore = scoring.scoreRecipe(recipe, userContext)
    const safetyWarnings = scoring.default.checkAllergies(recipe, userContext?.allergies || [])
    res.json({
      recipe: {
        ...recipe,
        matchScore,
        safetyWarnings: safetyWarnings.safe ? [] : safetyWarnings.allergens.map(a => `Contains allergen: ${a}`)
      }
    })
  } catch (error) {
    next(error)
  }
}

export async function findSubstitutions(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId
    const { ingredient, recipeId } = req.body
    if (!ingredient) {
      return res.status(400).json({ error: 'Ingredient is required' })
    }
    const userContext = !dbAvailable
      ? await mockDB.findUserContextByUserId(userId)
      : await UserContext.findOne({ userId })
    
    const molecules = await flavorDB.getFlavorMolecules(ingredient)
    const alternatives = await flavorDB.findSimilarIngredients(ingredient)
    let safeAlternatives = alternatives
    if (userContext && userContext.allergies.length > 0) {
      safeAlternatives = alternatives.filter(alt => {
        const altNameLower = alt.name.toLowerCase()
        return !userContext.allergies.some(allergen => altNameLower.includes(allergen.toLowerCase()))
      })
    }
    const topAlternatives = safeAlternatives.slice(0, 3)
    res.json({
      original: ingredient,
      molecules: molecules.slice(0, 5),
      alternatives: topAlternatives,
      totalFound: safeAlternatives.length
    })
  } catch (error) {
    next(error)
  }
}

export async function getUserProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId
    
    let user, userContext
    
    if (!dbAvailable) {
      user = { _id: userId, email: 'demo@nutricontext.com', name: 'Demo User', createdAt: new Date() }
      userContext = await mockDB.findUserContextByUserId(userId)
    } else {
      user = await User.findById(userId).select('-passwordHash')
      userContext = await UserContext.findOne({ userId })
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({
      user: { id: user._id, email: user.email, name: user.name, createdAt: user.createdAt },
      context: userContext
    })
  } catch (error) {
    next(error)
  }
}

export async function getRecentSearches(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId
    let searches
    
    if (!dbAvailable) {
      searches = await mockDB.getSearchHistory(userId, 10)
    } else {
      searches = await SearchHistory.find({ userId }).sort({ timestamp: -1 }).limit(10).select('query timestamp')
    }
    
    res.json({ searches })
  } catch (error) {
    next(error)
  }
}
// Add this function
export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name } = req.body
    
    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }
    
    // Create new user
    const hashedPassword = await hashPassword(password)
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash: hashedPassword,
      name: name || 'User'
    })
    
    const token = generateJWT(user._id.toString(), user.email)
    
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
      onboardingCompleted: false
    })
  } catch (error) {
    next(error)
  }
}
