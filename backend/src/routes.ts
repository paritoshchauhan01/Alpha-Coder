// src/routes.ts
import { Router } from 'express'
import * as controllers from './controllers'
import { requireAuth } from './middleware'

const router = Router()

// ============== AUTH ROUTES ==============
router.post('/auth/login', controllers.login)
router.post('/auth/signup', controllers.signup)
router.post('/auth/demo', controllers.demoLogin)

// ============== ONBOARDING ROUTES ==============
router.post('/onboarding', requireAuth, controllers.saveOnboarding)
router.get('/onboarding', requireAuth, controllers.getOnboarding)

// ============== RECIPE ROUTES ==============
router.post('/recipes/search', requireAuth, controllers.searchRecipes)
router.get('/recipes/:id', requireAuth, controllers.getRecipeById)

// ============== SUBSTITUTIONS ==============
router.post('/substitutions', requireAuth, controllers.findSubstitutions)

// ============== USER ROUTES ==============
router.get('/user/profile', requireAuth, controllers.getUserProfile)
router.get('/user/searches', requireAuth, controllers.getRecentSearches)

export default router
