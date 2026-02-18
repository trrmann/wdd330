// LocalStorage Module
// Purpose: Provides a class-based wrapper around window.localStorage with
// safe access helpers and logging.
// Usage: const store = new LocalStorage(); store.loadInventory();

import { bootLogger } from './bootLogger.js';
import { Logger } from './logger.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(import.meta.url, 'Defines LocalStorage storage wrapper');

const hasWindow = typeof window !== 'undefined';
const PANTRY_LOCAL_KEY = 'chow.pantry.inventory.local';
const MEALPLANS_LOCAL_KEY = 'chow.mealplans.saved.local';
const API_CACHE_PREFIX = 'chow.apiCache.';

// Wraps window.localStorage for pantry inventory and API cache
// entries, with safe JSON parsing/stringifying and logging.
class LocalStorage {
  constructor() {
    this.init();
  }

  init() {
    this.name = 'LocalStorage';
    this.storage = null;

    if (hasWindow) {
      try {
        this.storage = window.localStorage || null;
      } catch (error) {
        bootLogger.moduleInfo(
          import.meta.url,
          'LocalStorage: window.localStorage unavailable',
          { error: String(error) },
        );
      }
    }
  }

  isAvailable() {
    return !!this.storage;
  }

  getItem(key) {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      return this.storage.getItem(key);
    } catch (error) {
      bootLogger.moduleInfo(
        import.meta.url,
        `${this.name}.getItem: Failed to read key`,
        {
          key: String(key),
          error: String(error),
        },
      );
      return null;
    }
  }

  setItem(key, value) {
    if (!this.isAvailable()) {
      return;
    }

    try {
      this.storage.setItem(key, value);
    } catch (error) {
      bootLogger.moduleInfo(
        import.meta.url,
        `${this.name}.setItem: Failed to write key`,
        {
          key: String(key),
          error: String(error),
        },
      );
    }
  }

  removeItem(key) {
    if (!this.isAvailable()) {
      return;
    }

    try {
      this.storage.removeItem(key);
    } catch (error) {
      bootLogger.moduleInfo(
        import.meta.url,
        `${this.name}.removeItem: Failed to remove key`,
        {
          key: String(key),
          error: String(error),
        },
      );
    }
  }

  loadSavedMealPlans() {
    if (!this.isAvailable()) {
      return [];
    }

    const raw = this.getItem(MEALPLANS_LOCAL_KEY);
    if (!raw) {
      return [];
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (error) {
      bootLogger.moduleInfo(
        import.meta.url,
        'LocalStorage.loadSavedMealPlans: Failed to parse saved meal plans JSON',
        { error: String(error) },
      );
      return [];
    }

    const plans =
      data && Array.isArray(data.plans)
        ? data.plans
        : data && Array.isArray(data)
          ? data
          : [];

    const sanitized = plans.filter((plan) => plan && typeof plan === 'object');

    bootLogger.moduleInfo(
      import.meta.url,
      'LocalStorage.loadSavedMealPlans: Loaded saved meal plans from localStorage',
      { planCount: sanitized.length },
    );

    return sanitized;
  }

  saveSavedMealPlans(plans) {
    if (!this.isAvailable()) {
      return;
    }

    const items = Array.isArray(plans)
      ? plans.filter((plan) => plan && typeof plan === 'object')
      : [];

    const record = { plans: items };

    try {
      const payload = JSON.stringify(record);
      this.setItem(MEALPLANS_LOCAL_KEY, payload);
      bootLogger.moduleInfo(
        import.meta.url,
        'LocalStorage.saveSavedMealPlans: Saved meal plans to localStorage',
        { planCount: items.length },
      );
    } catch (error) {
      bootLogger.moduleInfo(
        import.meta.url,
        'LocalStorage.saveSavedMealPlans: Failed to save meal plans',
        { error: String(error) },
      );
    }
  }

  loadInventory() {
    if (!this.isAvailable()) {
      return null;
    }

    const raw = this.getItem(PANTRY_LOCAL_KEY);
    if (!raw) {
      return null;
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (error) {
      bootLogger.moduleInfo(
        import.meta.url,
        'LocalStorage.loadInventory: Failed to parse pantry inventory JSON',
        { error: String(error) },
      );
      return null;
    }

    const items =
      data && Array.isArray(data.items)
        ? data.items
        : data && Array.isArray(data)
          ? data
          : [];

    bootLogger.moduleInfo(
      import.meta.url,
      'LocalStorage.loadInventory: Loaded pantry inventory from localStorage',
      {
        hasData: !!data,
        itemCount: Array.isArray(items) ? items.length : 0,
      },
    );

    return { items };
  }

  saveInventory(inventory) {
    if (!this.isAvailable()) {
      return;
    }

    const items =
      inventory && Array.isArray(inventory.items) ? inventory.items : [];

    const record = { items };

    try {
      const payload = JSON.stringify(record);
      this.setItem(PANTRY_LOCAL_KEY, payload);
      bootLogger.moduleInfo(
        import.meta.url,
        'LocalStorage.saveInventory: Saved pantry inventory to localStorage',
        { itemCount: items.length },
      );
    } catch (error) {
      bootLogger.moduleInfo(
        import.meta.url,
        'LocalStorage.saveInventory: Failed to save pantry inventory',
        { error: String(error) },
      );
    }
  }

  loadApiCacheEntry(key) {
    if (!this.isAvailable()) {
      return null;
    }

    const storageKey = `${API_CACHE_PREFIX}${String(key)}`;
    const raw = this.getItem(storageKey);
    if (!raw) {
      return null;
    }

    let record;
    try {
      record = JSON.parse(raw);
    } catch (error) {
      bootLogger.moduleInfo(
        import.meta.url,
        'LocalStorage.loadApiCacheEntry: Failed to parse cache entry JSON',
        { key: String(key), error: String(error) },
      );
      return null;
    }

    if (!record || typeof record !== 'object') {
      return null;
    }

    const now = Date.now();
    const expiresAt =
      typeof record.expiresAt === 'number' && Number.isFinite(record.expiresAt)
        ? record.expiresAt
        : null;

    if (!expiresAt || now >= expiresAt) {
      this.removeItem(storageKey);
      bootLogger.moduleInfo(
        import.meta.url,
        'LocalStorage.loadApiCacheEntry: Cache entry expired and removed',
        { key: String(key) },
      );
      return null;
    }

    bootLogger.moduleInfo(
      import.meta.url,
      'LocalStorage.loadApiCacheEntry: Returning cached API entry',
      { key: String(key) },
    );

    return record.data ?? null;
  }

  saveApiCacheEntry(key, data, ttlMs) {
    if (!this.isAvailable()) {
      return;
    }

    const storageKey = `${API_CACHE_PREFIX}${String(key)}`;
    const now = Date.now();
    const ttl =
      typeof ttlMs === 'number' && Number.isFinite(ttlMs) && ttlMs > 0
        ? ttlMs
        : 60 * 60 * 1000;

    const record = {
      data,
      expiresAt: now + ttl,
    };

    try {
      const payload = JSON.stringify(record);
      this.setItem(storageKey, payload);
      bootLogger.moduleInfo(
        import.meta.url,
        'LocalStorage.saveApiCacheEntry: Saved API cache entry',
        { key: String(key), ttlMs: ttl },
      );
    } catch (error) {
      bootLogger.moduleInfo(
        import.meta.url,
        'LocalStorage.saveApiCacheEntry: Failed to save API cache entry',
        { key: String(key), error: String(error) },
      );
    }
  }

  clearInventory() {
    if (!this.isAvailable()) {
      return;
    }

    try {
      this.removeItem(PANTRY_LOCAL_KEY);
      bootLogger.moduleInfo(
        import.meta.url,
        'LocalStorage.clearInventory: Removed pantry inventory from localStorage',
      );
    } catch (error) {
      bootLogger.moduleInfo(
        import.meta.url,
        'LocalStorage.clearInventory: Failed to clear pantry inventory',
        { error: String(error) },
      );
    }
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'LocalStorage');

Logger.instrumentClass(LocalStorage, 'LocalStorage');

export { LocalStorage };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
// Local Storage Module
