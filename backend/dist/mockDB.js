"use strict";
// src/mockDB.ts
// In-memory mock database for when MongoDB is unavailable
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockDB = void 0;
class MockDatabase {
    constructor() {
        this.users = new Map();
        this.userContexts = new Map();
        this.searchHistory = [];
        this.recipeCache = new Map();
        // Initialize with demo user
        this.initializeDemoData();
    }
    initializeDemoData() {
        // This will be populated after bcrypt hash
        // For now, leave empty
    }
    // User operations
    async createUser(email, passwordHash, name) {
        const id = 'user_' + Date.now();
        const user = {
            _id: id,
            email: email.toLowerCase(),
            passwordHash,
            name,
            createdAt: new Date()
        };
        this.users.set(email.toLowerCase(), user);
        return user;
    }
    async findUserByEmail(email) {
        return this.users.get(email.toLowerCase()) || null;
    }
    async findUserById(id) {
        for (const user of this.users.values()) {
            if (user._id === id)
                return user;
        }
        return null;
    }
    // UserContext operations
    async saveUserContext(userId, data) {
        const context = {
            _id: 'ctx_' + Date.now(),
            userId,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.userContexts.set(userId, context);
        return context;
    }
    async findUserContextByUserId(userId) {
        return this.userContexts.get(userId) || null;
    }
    // Search history
    async addSearchHistory(userId, query) {
        this.searchHistory.push({
            userId,
            query,
            timestamp: new Date()
        });
    }
    async getSearchHistory(userId, limit = 10) {
        return this.searchHistory
            .filter(s => s.userId === userId)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    }
    // Recipe cache
    async cacheRecipe(recipeId, data) {
        this.recipeCache.set(recipeId, data);
    }
    async getCachedRecipe(recipeId) {
        return this.recipeCache.get(recipeId) || null;
    }
    // Clear all data (for testing)
    clear() {
        this.users.clear();
        this.userContexts.clear();
        this.searchHistory = [];
        this.recipeCache.clear();
    }
}
exports.mockDB = new MockDatabase();
