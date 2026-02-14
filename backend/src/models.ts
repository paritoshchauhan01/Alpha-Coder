// src/models.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  passwordHash: string
  name: string
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

export const User = mongoose.model<IUser>('User', UserSchema)

export interface IUserContext extends Document {
  userId: mongoose.Types.ObjectId
  lifeStage: string
  location: { country: string; climate: string }
  allergies: string[]
  dietaryRestrictions: string[]
  favoriteCuisines: string[]
  onboardingCompleted: boolean
  createdAt: Date
  updatedAt: Date
}

const UserContextSchema = new Schema<IUserContext>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  lifeStage: { type: String, required: true },
  location: {
    country: { type: String, required: true },
    climate: { type: String, required: true }
  },
  allergies: [{ type: String }],
  dietaryRestrictions: [{ type: String }],
  favoriteCuisines: [{ type: String }],
  onboardingCompleted: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export const UserContext = mongoose.model<IUserContext>('UserContext', UserContextSchema)

export interface IRecipeCache extends Document {
  recipeId: string
  data: any
  createdAt: Date
}

const RecipeCacheSchema = new Schema<IRecipeCache>({
  recipeId: { type: String, required: true, unique: true },
  data: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 }
})

export const RecipeCache = mongoose.model<IRecipeCache>('RecipeCache', RecipeCacheSchema)

export interface ISearchHistory extends Document {
  userId: mongoose.Types.ObjectId
  query: string
  timestamp: Date
}

const SearchHistorySchema = new Schema<ISearchHistory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  query: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
})

SearchHistorySchema.index({ userId: 1, timestamp: -1 })

export const SearchHistory = mongoose.model<ISearchHistory>('SearchHistory', SearchHistorySchema)