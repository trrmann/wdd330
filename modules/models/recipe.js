import { bootLogger } from './bootLogger.js';
import { Logger } from './logger.js';
import { Nutrition } from './nutrition.js';
import { Ingredient } from './ingredient.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(import.meta.url, 'Defines Recipe model');
// Recipe model used by home/recipes views, including nutrition details.
// Usage: const recipe = Recipe.fromApi(rawRecipe);
class Recipe {
  constructor(options = {}) {
    this.init(options);
  }

  init({
    id = null,
    title = '',
    image = '',
    readyInMinutes = null,
    servings = null,
    likes = 0,
    usedIngredientCount = 0,
    missedIngredientCount = 0,
    extendedIngredients = [],
    instructions = '',
    nutrition = null,
    diets = [],
    vegetarian = false,
    vegan = false,
    glutenFree = false,
    dairyFree = false,
  } = {}) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.readyInMinutes =
      typeof readyInMinutes === 'number'
        ? readyInMinutes
        : (readyInMinutes ?? null);
    this.servings =
      typeof servings === 'number' ? servings : (servings ?? null);
    this.likes = typeof likes === 'number' ? likes : 0;
    this.usedIngredientCount =
      typeof usedIngredientCount === 'number' ? usedIngredientCount : 0;
    this.missedIngredientCount =
      typeof missedIngredientCount === 'number' ? missedIngredientCount : 0;
    this.extendedIngredients = Array.isArray(extendedIngredients)
      ? extendedIngredients.map((ingredient) =>
          ingredient instanceof Ingredient
            ? ingredient
            : new Ingredient(ingredient),
        )
      : [];
    this.instructions = instructions;
    this.nutrition =
      nutrition instanceof Nutrition
        ? nutrition
        : new Nutrition(nutrition || {});
    this.diets = Array.isArray(diets)
      ? diets.map((diet) => String(diet).toLowerCase())
      : [];
    this.vegetarian = Boolean(vegetarian);
    this.vegan = Boolean(vegan);
    this.glutenFree = Boolean(glutenFree);
    this.dairyFree = Boolean(dairyFree);
  }

  // isFavoriteForProfile: Returns true when this recipe is a favorite
  // for the given profile instance.
  isFavoriteForProfile(profile) {
    return Recipe.isIdFavoriteForProfile(this.id, profile);
  }

  // toggleFavoriteForProfile: Adds or removes this recipe from the
  // profile's favorite recipes and returns the new favorite state.
  toggleFavoriteForProfile(profile) {
    if (!profile || this.id == null) {
      return false;
    }

    const beforeIds = Array.isArray(profile.favoriteRecipeIds)
      ? [...profile.favoriteRecipeIds]
      : [];

    const currentlyFavorite = this.isFavoriteForProfile(profile);

    if (currentlyFavorite) {
      if (typeof profile.removeFavoriteRecipe === 'function') {
        profile.removeFavoriteRecipe(this.id);
      } else if (Array.isArray(profile.favoriteRecipeIds)) {
        profile.favoriteRecipeIds = profile.favoriteRecipeIds.filter(
          (id) => id !== this.id,
        );
      }
    } else {
      if (typeof profile.addFavoriteRecipe === 'function') {
        profile.addFavoriteRecipe(this.id);
      } else if (Array.isArray(profile.favoriteRecipeIds)) {
        if (!profile.favoriteRecipeIds.includes(this.id)) {
          profile.favoriteRecipeIds.push(this.id);
        }
      } else {
        profile.favoriteRecipeIds = [this.id];
      }
    }

    // Ensure the profile's favoriteRecipeIds collection reflects the
    // new favorite state, normalizing ids as strings so that
    // downstream checks (which also normalize) stay in sync even if
    // earlier operations were no-ops due to type mismatches.
    const ids = Array.isArray(profile.favoriteRecipeIds)
      ? profile.favoriteRecipeIds
      : [];
    const target = String(this.id);
    const hasId = ids.some((id) => String(id) === target);

    if (!currentlyFavorite && !hasId) {
      profile.favoriteRecipeIds = [...ids, this.id];
    } else if (currentlyFavorite && hasId) {
      profile.favoriteRecipeIds = ids.filter((id) => String(id) !== target);
    }

    const afterIds = Array.isArray(profile.favoriteRecipeIds)
      ? [...profile.favoriteRecipeIds]
      : [];

    // Use static logger so this works across all pages with config-based logging.
    Logger.staticClassMethodLog(
      'info',
      'Recipe',
      'toggleFavoriteForProfile',
      'Recipe.toggleFavoriteForProfile: Toggled favorite state',
      {
        recipeId: this.id,
        nowFavorite: !currentlyFavorite,
        beforeFavoriteIds: beforeIds,
        afterFavoriteIds: afterIds,
      },
    );

    return !currentlyFavorite;
  }

  // isIdFavoriteForProfile: Helper that checks if a recipe id is
  // present in the profile's favoriteRecipeIds collection.
  static isIdFavoriteForProfile(recipeId, profile) {
    if (recipeId == null || !profile) return false;
    const ids = Array.isArray(profile.favoriteRecipeIds)
      ? profile.favoriteRecipeIds
      : [];

    // Normalize both stored ids and incoming id to strings so
    // comparisons are robust across number/string differences that
    // can arise from persistence.
    const target = String(recipeId);
    return ids.some((id) => String(id) === target);
  }

  static fromApi(raw = {}) {
    const nutrition = raw.nutrition
      ? Nutrition.fromMock(raw.nutrition)
      : new Nutrition();

    return new Recipe({
      ...raw,
      extendedIngredients: Array.isArray(raw.extendedIngredients)
        ? raw.extendedIngredients
        : [],
      nutrition,
    });
  }

  static fromMock(raw = {}) {
    return Recipe.fromApi(raw);
  }

  static fromMockResults(root) {
    const source = Array.isArray(root)
      ? root
      : root && Array.isArray(root.results)
        ? root.results
        : [];
    return source.map((entry) => Recipe.fromMock(entry));
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'Recipe');

Logger.instrumentClass(Recipe, 'Recipe');

export { Recipe };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
