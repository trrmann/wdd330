// Meal Plan Module
// Purpose: Generates and displays meal plans.

import { bootLogger } from './bootLogger.js';
import { Logger } from './logger.js';
import { Meal } from './meal.js';
import { Profile } from './profile.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(
  import.meta.url,
  'Defines MealPlan class, shared meals collection, profile, and currentMealPlan',
);

// Shared meals collection for meal planning features
const meals = [];

// Represents a single meal plan snapshot, including days and meals,
// with helpers to inspect meals per day and track the current plan.
class MealPlan {
  constructor({
    id = null,
    name = '',
    profileSnapshot = null,
    days = 1,
    mealsPerDay = 0,
    mealsForPlan = [],
  } = {}) {
    this.id = id;
    this.name = name || '';
    this.profileSnapshot = profileSnapshot ? { ...profileSnapshot } : null;
    this.days =
      typeof days === 'number' && Number.isFinite(days) && days > 0
        ? Math.trunc(days)
        : 1;
    this.mealsPerDay =
      typeof mealsPerDay === 'number' &&
      Number.isFinite(mealsPerDay) &&
      mealsPerDay > 0
        ? Math.trunc(mealsPerDay)
        : 0;
    this.mealsForPlan = Array.isArray(mealsForPlan)
      ? mealsForPlan.map((meal) => new Meal(meal))
      : [];
  }

  getMeals() {
    return this.mealsForPlan.slice();
  }

  getMealsForDay(dayIndex) {
    if (typeof dayIndex !== 'number' || !Number.isFinite(dayIndex)) {
      return [];
    }
    return this.mealsForPlan.filter(
      (meal) => typeof meal.dayIndex === 'number' && meal.dayIndex === dayIndex,
    );
  }

  static setCurrentMealPlan(plan) {
    bootLogger.moduleInfo(
      import.meta.url,
      'MealPlan.setCurrentMealPlan: Starting update of current meal plan',
    );

    if (plan instanceof MealPlan || plan === null) {
      currentMealPlan = plan;
    } else {
      currentMealPlan = null;
    }

    const hasPlan = !!(currentMealPlan && currentMealPlan.mealsForPlan);
    const mealCount = hasPlan ? currentMealPlan.mealsForPlan.length : 0;

    bootLogger.moduleInfo(
      import.meta.url,
      'MealPlan.setCurrentMealPlan: Completed',
      {
        hasPlan,
        mealCount,
      },
    );
  }

  // normalizeIngredientName: Normalizes ingredient names for comparison.
  static normalizeIngredientName(rawName) {
    return String(rawName || '')
      .trim()
      .toLowerCase();
  }

  // normalizeUnit: Normalizes unit strings to canonical short forms.
  static normalizeUnit(rawUnit) {
    const unit = String(rawUnit || '')
      .trim()
      .toLowerCase();
    if (!unit) return '';

    if (unit === 'pcs' || unit === 'piece' || unit === 'pieces') {
      return '';
    }

    const synonyms = {
      tablespoon: 'tbsp',
      tablespoons: 'tbsp',
      tbsp: 'tbsp',
      teaspoon: 'tsp',
      teaspoons: 'tsp',
      tsp: 'tsp',
      ounce: 'oz',
      ounces: 'oz',
      oz: 'oz',
      pound: 'lb',
      pounds: 'lb',
      lb: 'lb',
      lbs: 'lb',
      gram: 'g',
      grams: 'g',
      g: 'g',
      kilogram: 'kg',
      kilograms: 'kg',
      kg: 'kg',
      milliliter: 'ml',
      milliliters: 'ml',
      ml: 'ml',
      liter: 'l',
      liters: 'l',
      l: 'l',
      cup: 'cup',
      cups: 'cup',
      clove: 'clove',
      cloves: 'clove',
    };

    if (synonyms[unit]) {
      return synonyms[unit];
    }

    if (unit.endsWith('s') && unit.length > 1) {
      return unit.slice(0, -1);
    }

    return unit;
  }

  static makeIngredientKey(name, unit) {
    return `${MealPlan.normalizeIngredientName(name)}|${MealPlan.normalizeUnit(unit)}`;
  }

  static buildRequiredIngredientsForPlan(planMeals, peopleCountValue) {
    const aggregate = new Map();

    if (!Array.isArray(planMeals) || planMeals.length === 0) {
      return aggregate;
    }

    planMeals.forEach((meal) => {
      if (!meal || !Array.isArray(meal.recipesForMeal)) return;

      meal.recipesForMeal.forEach((recipe) => {
        if (!recipe || !Array.isArray(recipe.extendedIngredients)) return;

        const servings =
          typeof recipe.servings === 'number' && recipe.servings > 0
            ? recipe.servings
            : null;
        const scale =
          peopleCountValue != null && servings != null && servings > 0
            ? peopleCountValue / servings
            : 1;

        recipe.extendedIngredients.forEach((ingredient) => {
          if (!ingredient) return;

          const baseName = (
            ingredient.name ||
            ingredient.originalString ||
            ''
          ).trim();
          if (!baseName) return;

          const name = baseName;
          const unitRaw = (ingredient.unit || ingredient.unitLong || '').trim();
          const unit = unitRaw;
          const rawAmount = ingredient.amount;
          const amount =
            typeof rawAmount === 'number' &&
            Number.isFinite(rawAmount) &&
            rawAmount > 0
              ? rawAmount * scale
              : 1 * scale;

          const key = MealPlan.makeIngredientKey(name, unit);
          const existing = aggregate.get(key);
          if (existing) {
            existing.quantity += amount;
          } else {
            aggregate.set(key, {
              name,
              quantity: amount,
              unit,
            });
          }
        });
      });
    });

    return aggregate;
  }

  static formatScaledAmount(amount) {
    const numeric =
      typeof amount === 'number' && Number.isFinite(amount) ? amount : null;
    if (numeric == null) {
      return '';
    }

    const rounded = Math.round(numeric * 100) / 100;
    if (Number.isInteger(rounded)) {
      return String(rounded);
    }
    return String(rounded);
  }

  static buildRecipesForMeal({
    recipesCollection,
    profile,
    targetCaloriesPerPerson,
    usedRecipeIdsForCurrentPlan = null,
  } = {}) {
    if (!Array.isArray(recipesCollection) || recipesCollection.length === 0) {
      return [];
    }

    const favoriteIds = Array.isArray(profile?.favoriteRecipeIds)
      ? profile.favoriteRecipeIds
      : [];
    const usedIds =
      usedRecipeIdsForCurrentPlan instanceof Set
        ? usedRecipeIdsForCurrentPlan
        : null;
    const maxReadyMinutes =
      typeof profile?.maxReadyMinutes === 'number' &&
      profile.maxReadyMinutes > 0
        ? profile.maxReadyMinutes
        : null;
    const allergensText =
      typeof profile?.allergensText === 'string'
        ? profile.allergensText.toLowerCase()
        : '';
    const allergenTerms = allergensText
      .split(/[,;\n]+/)
      .map((term) => term.trim())
      .filter((term) => term.length > 0);

    const isRecipeAllowed = (recipe) => {
      if (!recipe) return false;

      if (
        maxReadyMinutes != null &&
        typeof recipe.readyInMinutes === 'number' &&
        recipe.readyInMinutes > maxReadyMinutes
      ) {
        return false;
      }

      if (allergenTerms.length > 0) {
        const ingredientsForRecipe = Array.isArray(recipe.extendedIngredients)
          ? recipe.extendedIngredients
          : [];
        const ingredientStrings = ingredientsForRecipe.map((ingredient) => {
          const name = (ingredient.name || '').toLowerCase();
          const original = (ingredient.originalString || '').toLowerCase();
          return `${name} ${original}`;
        });
        const haystack = ingredientStrings.join(' ');
        const hasAllergen = allergenTerms.some(
          (term) => term && haystack.includes(term),
        );
        if (hasAllergen) return false;
      }

      return true;
    };

    const allowedRecipes = recipesCollection.filter(isRecipeAllowed);
    if (allowedRecipes.length === 0) {
      return [];
    }

    const isFavorite = (recipe) =>
      recipe && favoriteIds.includes?.(recipe.id ?? undefined);

    const scoreRecipe = (recipe) => {
      let calories = null;
      if (recipe && recipe.nutrition instanceof Object) {
        const nutrient =
          typeof recipe.nutrition.getNutrient === 'function'
            ? recipe.nutrition.getNutrient('Calories')
            : null;
        if (nutrient && typeof nutrient.amount === 'number') {
          calories = nutrient.amount;
        }
      }

      const hasCalories =
        typeof calories === 'number' && Number.isFinite(calories);

      let distance;
      if (
        hasCalories &&
        typeof targetCaloriesPerPerson === 'number' &&
        Number.isFinite(targetCaloriesPerPerson) &&
        targetCaloriesPerPerson > 0
      ) {
        distance = Math.abs(calories - targetCaloriesPerPerson);
      } else {
        const likes =
          typeof recipe.likes === 'number' && Number.isFinite(recipe.likes)
            ? recipe.likes
            : 0;
        distance = -likes;
      }

      return {
        recipe,
        distance,
        favorite: isFavorite(recipe),
      };
    };

    let candidates = allowedRecipes;

    // Prefer recipes not yet used in this meal plan for diversity
    if (usedIds && usedIds.size > 0) {
      const unused = candidates.filter((recipe) => {
        if (!recipe || recipe.id == null) return true;
        return !usedIds.has(recipe.id);
      });
      if (unused.length > 0) {
        candidates = unused;
      }
    }

    const scored = candidates.map(scoreRecipe);
    let favorites = scored.filter((entry) => entry.favorite);
    let nonFavorites = scored.filter((entry) => !entry.favorite);

    const selected = [];

    // Random selection with a bias toward favorites
    while (
      selected.length < 3 &&
      (favorites.length > 0 || nonFavorites.length > 0)
    ) {
      let pool;

      if (favorites.length === 0) {
        pool = nonFavorites;
      } else if (nonFavorites.length === 0) {
        pool = favorites;
      } else {
        const chooseFavorite = Math.random() < 0.7;
        pool = chooseFavorite ? favorites : nonFavorites;
      }

      if (!pool || pool.length === 0) {
        break;
      }

      const index = Math.floor(Math.random() * pool.length);
      const [entry] = pool.splice(index, 1);
      if (entry && entry.recipe) {
        selected.push(entry.recipe);
      }
    }

    return selected;
  }
}
let currentMealPlan = null;

Profile.instance = null;

Profile.getInstance = function getInstance() {
  if (!Profile.instance) {
    Profile.instance = new Profile();
  }
  return Profile.instance;
};

MealPlan.getCurrentMealPlan = function getCurrentMealPlan() {
  return currentMealPlan;
};

bootLogger.moduleClassLoaded(import.meta.url, 'MealPlan');

Logger.instrumentClass(MealPlan, 'MealPlan');

export { Meal, meals, MealPlan, Profile };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
