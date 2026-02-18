import { bootLogger } from './bootLogger.js';
import { Logger } from './logger.js';
import { Recipes } from './recipes.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(import.meta.url, 'Defines Meal model');
// Meal model used in meal plans to group recipes.
// Usage: const meal = new Meal({ name: 'Lunch', recipesForMeal: [] });
class Meal {
  constructor(options = {}) {
    this.init(options);
  }

  init({
    id = null,
    name = '',
    recipesForMeal = [],
    dayIndex = null,
    mealType = '',
    notes = '',
  } = {}) {
    this.id = id;
    this.name = name;
    this.recipesForMeal = Array.isArray(recipesForMeal)
      ? recipesForMeal.map((recipe) => Recipes.ensureRecipeModel(recipe))
      : [];
    this.dayIndex =
      typeof dayIndex === 'number' ? dayIndex : (dayIndex ?? null);
    this.mealType = mealType;
    this.notes = notes;
  }

  // findRecipeById: Delegates recipe lookup through the shared Recipes model.
  static findRecipeById(recipeId) {
    const all = typeof Recipes.getAll === 'function' ? Recipes.getAll() : [];
    const key = String(recipeId);
    return all.find((recipe) => recipe && String(recipe.id) === key) || null;
  }

  // isRecipeIdFavoriteForProfile: Delegates favorite check through Recipes.
  static isRecipeIdFavoriteForProfile(recipeId, profile) {
    if (Recipes && typeof Recipes.isRecipeIdFavoriteForProfile === 'function') {
      return Recipes.isRecipeIdFavoriteForProfile(recipeId, profile);
    }
    return false;
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'Meal');

Logger.instrumentClass(Meal, 'Meal');

export { Meal };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
