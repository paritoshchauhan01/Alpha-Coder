// src/mockDB.ts
// In-memory mock database for when MongoDB is unavailable

interface MockUser {
  _id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
}

interface MockUserContext {
  _id: string;
  userId: string;
  lifeStage: string;
  location: { country: string; climate: string };
  allergies: string[];
  dietaryRestrictions: string[];
  favoriteCuisines: string[];
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class MockDatabase {
  private users: Map<string, MockUser> = new Map()
  private userContexts: Map<string, MockUserContext> = new Map()
  private searchHistory: any[] = []
  private recipeCache: Map<string, any> = new Map()

  constructor() {
    // Initialize with demo user
    this.initializeDemoData()
  }

  private initializeDemoData() {
    // This will be populated after bcrypt hash
    // For now, leave empty
  }

  // User operations
  async createUser(email: string, passwordHash: string, name: string): Promise<MockUser> {
    const id = 'user_' + Date.now()
    const user: MockUser = {
      _id: id,
      email: email.toLowerCase(),
      passwordHash,
      name,
      createdAt: new Date()
    }
    this.users.set(email.toLowerCase(), user)
    return user
  }

  async findUserByEmail(email: string): Promise<MockUser | null> {
    return this.users.get(email.toLowerCase()) || null
  }

  async findUserById(id: string): Promise<MockUser | null> {
    for (const user of this.users.values()) {
      if (user._id === id) return user
    }
    return null
  }

  // UserContext operations
  async saveUserContext(userId: string, data: any): Promise<MockUserContext> {
    const context: MockUserContext = {
      _id: 'ctx_' + Date.now(),
      userId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.userContexts.set(userId, context)
    return context
  }

  async findUserContextByUserId(userId: string): Promise<MockUserContext | null> {
    return this.userContexts.get(userId) || null
  }

  // Search history
  async addSearchHistory(userId: string, query: string): Promise<void> {
    this.searchHistory.push({
      userId,
      query,
      timestamp: new Date()
    })
  }

  async getSearchHistory(userId: string, limit: number = 10): Promise<any[]> {
    return this.searchHistory
      .filter(s => s.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
  }

  // Recipe cache
  async cacheRecipe(recipeId: string, data: any): Promise<void> {
    this.recipeCache.set(recipeId, data)
  }

  async getCachedRecipe(recipeId: string): Promise<any | null> {
    return this.recipeCache.get(recipeId) || null
  }

  // Clear all data (for testing)
  clear(): void {
    this.users.clear()
    this.userContexts.clear()
    this.searchHistory = []
    this.recipeCache.clear()
  }
}

export const mockDB = new MockDatabase()
