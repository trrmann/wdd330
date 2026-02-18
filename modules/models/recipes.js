// Recipes Module
// Purpose: Encapsulates recipe models and search/filter behavior.
// Usage: import { recipes, Recipes } from './recipes.js';
//        const filtered = Recipes.filter(recipes, { nameTerm: 'pasta' });

import { bootLogger } from './bootLogger.js';
import { Recipe } from './recipe.js';
import { Ingredient } from './ingredient.js';
import { ingredients } from './shoppingList.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(
  import.meta.url,
  'Defines recipes module (search, shared recipes collection)',
);

// Shared recipes collection for search and views
const recipes = [];

class Recipes {
  static filter(collection, filters = {}) {
    const safeFilters = filters || {};

    // Support both home-page and recipes-page naming conventions
    const nameTerm = safeFilters.nameTerm || safeFilters.name || '';
    const ingredientTerm =
      safeFilters.ingredientTerm || safeFilters.ingredient || '';
    const nutritionFilters =
      safeFilters.nutritionFilters || safeFilters.nutrition || null;

    let result = Array.isArray(collection) ? [...collection] : [];

    if (nameTerm) {
      result = Recipes.filterByName(result, nameTerm);
    }

    if (ingredientTerm) {
      result = Recipes.filterByIngredient(result, ingredientTerm);
    }

    if (nutritionFilters) {
      result = Recipes.filterByNutrition(result, nutritionFilters);
    }

    return result;
  }

  static filterByName(collection, nameTerm) {
    if (!nameTerm) return collection;
    const term = nameTerm.toLowerCase();
    return collection.filter((recipe) =>
      (recipe.title || '').toLowerCase().includes(term),
    );
  }

  static filterByIngredient(collection, ingredientTerm) {
    if (!ingredientTerm) return collection;
    const term = ingredientTerm.toLowerCase();
    return collection.filter((recipe) => {
      const ingredientsForRecipe = Array.isArray(recipe.extendedIngredients)
        ? recipe.extendedIngredients
        : [];

      return ingredientsForRecipe.some((ingredient) => {
        const name = (ingredient.name || '').toLowerCase();
        const original = (ingredient.originalString || '').toLowerCase();
        return name.includes(term) || original.includes(term);
      });
    });
  }

  static filterByNutrition(collection, nutritionFilters) {
    if (!nutritionFilters) return collection;

    const nutrientKey = nutritionFilters.nutrientName
      ? nutritionFilters.nutrientName.toLowerCase()
      : '';
    const min =
      typeof nutritionFilters.min === 'number' ? nutritionFilters.min : null;
    const max =
      typeof nutritionFilters.max === 'number' ? nutritionFilters.max : null;

    if (!nutrientKey || (min === null && max === null)) {
      return collection;
    }

    return collection.filter((recipe) => {
      const nutrients =
        recipe && recipe.nutrition && Array.isArray(recipe.nutrition.nutrients)
          ? recipe.nutrition.nutrients
          : [];

      const match = nutrients.find((nutrient) => {
        const title = (nutrient.title || '').toLowerCase();
        return title === nutrientKey;
      });

      if (!match || typeof match.amount !== 'number') {
        return false;
      }

      if (min !== null && match.amount < min) {
        return false;
      }

      if (max !== null && match.amount > max) {
        return false;
      }

      return true;
    });
  }

  static populateRecipes(root) {
    const recipeModels = Recipe.fromMockResults(root);

    recipes.splice(0, recipes.length, ...recipeModels);

    const allIngredients = [];
    recipeModels.forEach((recipe) => {
      if (Array.isArray(recipe.extendedIngredients)) {
        recipe.extendedIngredients.forEach((ingredient) => {
          allIngredients.push(
            ingredient instanceof Ingredient
              ? ingredient
              : new Ingredient(ingredient),
          );
        });
      }
    });

    ingredients.splice(0, ingredients.length, ...allIngredients);
  }

  static ensureRecipeModel(raw) {
    if (raw instanceof Recipe) {
      return raw;
    }
    return new Recipe(raw);
  }

  static getAll() {
    return recipes;
  }

  static isRecipeIdFavoriteForProfile(recipeId, profile) {
    if (typeof Recipe.isIdFavoriteForProfile === 'function') {
      return Recipe.isIdFavoriteForProfile(recipeId, profile);
    }
    return false;
  }
}

export { recipes, Recipes, Recipe };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
