import { bootLogger } from './bootLogger.js';
import { Logger } from './logger.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(import.meta.url, 'Defines Meal model');
// Meal model used in meal plans to group recipes.
// Usage: const meal = new Meal({ name: 'Lunch', recipesForMeal: [] });
class Meal {
  constructor({
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
      ? recipesForMeal.map((recipe) => ({ ...recipe }))
      : [];
    this.dayIndex =
      typeof dayIndex === 'number' ? dayIndex : (dayIndex ?? null);
    this.mealType = mealType;
    this.notes = notes;
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'Meal');

Logger.instrumentClass(Meal, 'Meal');

export { Meal };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
