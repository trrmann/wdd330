// API Access Module
// Purpose: Manages all communication with external recipe APIs, including
// constructing requests, handling responses, error management, and integrating
// with a localStorage-backed cache for recipe data.
// Usage: import { getRecipeApi } from './apiAccess.js';
//        const api = getRecipeApi(); const dataset = await api.fetchRecipesDataset(config);

import { bootLogger } from './bootLogger.js';
import { Storage } from './storage.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(
  import.meta.url,
  'Defines API access module (RecipeApi, MockApi, requests, responses, errors, caching)',
);

const RECIPES_CACHE_KEY = 'recipes.v1';

// Simple adapter that routes recipe requests to mock JSON
// when the real API is unavailable or disabled.
class MockApi {
  constructor(owner) {
    this.owner = owner;
  }

  async fetchRecipes(config) {
    return this.owner.fetchRecipesFromMock(config);
  }
}

// Handles all recipe API requests, including cache lookups,
// fallbacks to mock data, and normalization of response shape.
class RecipeApi {
  constructor() {
    this.mockApi = new MockApi(this);
  }
  canUseRecipesApi(config) {
    if (!config || !config.recipesApi) return false;
    const api = config.recipesApi;
    if (!api.enabled) return false;
    if (!api.rapidApiKey || !api.rapidApiHost) return false;
    return true;
  }

  getRecipesCacheTtlMs(config) {
    const api = config && config.recipesApi;
    const minutes =
      api && typeof api.cacheTtlMinutes === 'number' && api.cacheTtlMinutes > 0
        ? api.cacheTtlMinutes
        : 60;
    return minutes * 60 * 1000;
  }

  normalizeRecipesRoot(raw) {
    if (!raw) {
      return { results: [] };
    }

    if (Array.isArray(raw)) {
      return { results: raw };
    }

    if (Array.isArray(raw.results)) {
      return { results: raw.results };
    }

    if (Array.isArray(raw.recipes)) {
      return { results: raw.recipes };
    }

    return { results: [] };
  }

  async fetchRecipesDataset(config) {
    bootLogger.moduleInfo(
      import.meta.url,
      'RecipeApi.fetchRecipesDataset: Starting',
      {
        hasRecipesApiConfig: !!(config && config.recipesApi),
        mockDataPath:
          config && config.recipesApi && config.recipesApi.mockDataPath,
      },
    );

    const ttlMs = this.getRecipesCacheTtlMs(config);
    const storage = Storage.getInstance();
    const cached = storage.loadApiCacheEntry(RECIPES_CACHE_KEY);
    if (cached && cached.results && Array.isArray(cached.results)) {
      bootLogger.moduleInfo(
        import.meta.url,
        'RecipeApi.fetchRecipesDataset: Using cached recipes dataset',
        { resultCount: cached.results.length },
      );
      return cached;
    }

    let dataset = null;

    if (this.canUseRecipesApi(config)) {
      try {
        dataset = await this.fetchRecipesFromApi(config);
      } catch (error) {
        bootLogger.moduleInfo(
          import.meta.url,
          'RecipeApi.fetchRecipesDataset: API request failed, will fall back to mock data',
          { error: String(error) },
        );
      }
    }

    if (!dataset) {
      dataset = await this.mockApi.fetchRecipes(config);
    }

    if (dataset && Array.isArray(dataset.results)) {
      storage.saveApiCacheEntry(RECIPES_CACHE_KEY, dataset, ttlMs);
      bootLogger.moduleInfo(
        import.meta.url,
        'RecipeApi.fetchRecipesDataset: Completed and cached dataset',
        { resultCount: dataset.results.length, ttlMs },
      );
    } else {
      bootLogger.moduleInfo(
        import.meta.url,
        'RecipeApi.fetchRecipesDataset: Completed with empty dataset',
      );
    }

    return dataset;
  }

  async fetchRecipesFromApi(config) {
    const api = config.recipesApi;
    const baseUrl =
      api.baseUrl ||
      'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com';

    const url = new URL('/recipes/random', baseUrl);
    const count =
      typeof api.defaultRandomCount === 'number' && api.defaultRandomCount > 0
        ? api.defaultRandomCount
        : 50;
    url.searchParams.set('number', String(count));
    url.searchParams.set('addRecipeNutrition', 'true');
    url.searchParams.set('addRecipeInformation', 'true');

    if (api.defaultRandomTags) {
      url.searchParams.set('tags', String(api.defaultRandomTags));
    }

    const headers = {
      'x-rapidapi-key': api.rapidApiKey,
      'x-rapidapi-host': api.rapidApiHost,
    };

    bootLogger.moduleInfo(
      import.meta.url,
      'apiAccess.fetchRecipesFromApi: Requesting recipes from external API',
      {
        url: url.toString(),
        count,
        hasKey: !!api.rapidApiKey,
      },
    );

    const response = await fetch(url.toString(), { headers });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch recipes from API (${response.status} ${response.statusText})`,
      );
    }

    const data = await response.json();

    bootLogger.moduleInfo(
      import.meta.url,
      'apiAccess.fetchRecipesFromApi: Received recipes payload from API',
      {
        hasRecipesArray:
          !!data && Array.isArray(data.recipes || data.results || data),
      },
    );

    return this.normalizeRecipesRoot(data);
  }

  async fetchRecipesFromMock(config) {
    const api = config && config.recipesApi;
    const path =
      api && api.mockDataPath ? api.mockDataPath : './data/mock-recipes.json';

    bootLogger.moduleInfo(
      import.meta.url,
      'apiAccess.fetchRecipesFromMock: Requesting recipes from mock JSON',
      { path },
    );

    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(
        `Failed to load mock recipes (${response.status} ${response.statusText})`,
      );
    }

    const data = await response.json();

    return this.normalizeRecipesRoot(data);
  }
}

RecipeApi.instance = null;

RecipeApi.getInstance = function getInstance() {
  if (!RecipeApi.instance) {
    RecipeApi.instance = new RecipeApi();
  }
  return RecipeApi.instance;
};

bootLogger.moduleLoadCompleted(import.meta.url);

export { RecipeApi };
