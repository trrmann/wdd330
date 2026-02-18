// Storage Module
// Purpose: Central facade for all persistence-related operations used by the app
// (shopping list, meal plans, pantry inventory, and API cache), backed by
// LocalStorage and SessionStorage wrappers.
// Usage: import { Storage } from './storage.js';
//        const storage = new Storage();
//        const shopping = storage.loadShoppingList() || { items: [] };
//        storage.saveShoppingList(shopping);

import { bootLogger } from './bootLogger.js';
import { Logger } from './logger.js';
import { LocalStorage } from './localStorage.js';
import { SessionStorage } from './sessionStorage.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(
  import.meta.url,
  'Defines Storage facade and shared helpers for LocalStorage and SessionStorage wrappers',
);

// Storage facade that hides the underlying LocalStorage / SessionStorage
// implementations and exposes simple methods for each persisted concern.
class Storage {
  constructor(internal = {}) {
    this.logger = internal.logger || this.logger || null;
    this.init();
  }

  init() {
    this.localStorage = new LocalStorage();
    this.sessionStorage = new SessionStorage();
  }

  // Returns the LocalStorage wrapper instance used for persistent data.
  getLocalStorage() {
    return this.localStorage;
  }

  // Returns the SessionStorage wrapper instance used for per-session data.
  getSessionStorage() {
    return this.sessionStorage;
  }

  // Shopping list – session persistence helpers
  loadShoppingList() {
    const store = this.getSessionStorage();
    if (!store || !store.isAvailable()) return null;

    return store.loadShoppingList();
  }

  // Saves the current shopping list state for the active browser session.
  saveShoppingList(shoppingList) {
    const store = this.getSessionStorage();
    if (!store || !store.isAvailable()) return;
    store.saveShoppingList(shoppingList);
  }

  // Meal plan – session persistence helpers
  loadMealPlan() {
    const store = this.getSessionStorage();
    if (!store || !store.isAvailable()) return null;

    return store.loadMealPlan();
  }

  // Persists a normalized snapshot of the active meal plan for this session.
  saveMealPlan(plan) {
    const store = this.getSessionStorage();
    if (!store || !store.isAvailable()) return;

    if (!plan || typeof plan !== 'object') {
      store.clearMealPlan();
      return;
    }

    const payload = {
      id: plan.id ?? null,
      name: plan.name ?? '',
      profileSnapshot: plan.profileSnapshot ?? null,
      days:
        typeof plan.days === 'number' && Number.isFinite(plan.days)
          ? plan.days
          : null,
      mealsPerDay:
        typeof plan.mealsPerDay === 'number' &&
        Number.isFinite(plan.mealsPerDay)
          ? plan.mealsPerDay
          : null,
      mealsForPlan: Array.isArray(plan.mealsForPlan) ? plan.mealsForPlan : [],
    };

    store.saveMealPlan(payload);
  }

  // Loads any UI state associated with the meal plan page from the session.
  loadMealPlanState() {
    const store = this.getSessionStorage();
    if (!store || !store.isAvailable()) return null;

    if (typeof store.loadMealPlanState === 'function') {
      return store.loadMealPlanState();
    }

    return null;
  }

  // Saves or clears UI state for the meal plan page in the session store.
  saveMealPlanState(state) {
    const store = this.getSessionStorage();
    if (!store || !store.isAvailable()) return;

    if (!state || typeof state !== 'object') {
      if (typeof store.clearMealPlanState === 'function') {
        store.clearMealPlanState();
      }
      return;
    }

    if (typeof store.saveMealPlanState === 'function') {
      store.saveMealPlanState(state);
    }
  }

  // Pantry inventory – local (persistent) storage helpers
  loadInventory() {
    const store = this.getLocalStorage();
    if (!store || !store.isAvailable()) return null;

    return store.loadInventory();
  }

  // Persists the current pantry inventory to localStorage.
  saveInventory(inventory) {
    const store = this.getLocalStorage();
    if (!store || !store.isAvailable()) return;

    store.saveInventory(inventory);
  }

  // Clears the entire pantry inventory from localStorage, if supported.
  clearInventory() {
    const store = this.getLocalStorage();
    if (!store || !store.isAvailable()) return;

    if (typeof store.clearInventory === 'function') {
      store.clearInventory();
    }
  }

  // Loads all saved meal plans from localStorage (empty array when none).
  loadSavedMealPlans() {
    const store = this.getLocalStorage();
    if (!store || !store.isAvailable()) return [];

    if (typeof store.loadSavedMealPlans === 'function') {
      return store.loadSavedMealPlans();
    }

    return [];
  }

  // Persists the collection of saved meal plans to localStorage.
  saveSavedMealPlans(plans) {
    const store = this.getLocalStorage();
    if (!store || !store.isAvailable()) return;

    if (typeof store.saveSavedMealPlans === 'function') {
      store.saveSavedMealPlans(plans);
    }
  }

  // Generic API cache helpers – backed by localStorage with TTL
  loadApiCacheEntry(key) {
    const store = this.getLocalStorage();
    if (!store || !store.isAvailable()) return null;

    return store.loadApiCacheEntry(key);
  }

  // Saves API responses under a cache key with an optional TTL.
  saveApiCacheEntry(key, data, ttlMs) {
    const store = this.getLocalStorage();
    if (!store || !store.isAvailable()) return;

    store.saveApiCacheEntry(key, data, ttlMs);
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'Storage');

Logger.instrumentClass(Storage, 'Storage');

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

export { Storage };

bootLogger.moduleLoadCompleted(import.meta.url);
