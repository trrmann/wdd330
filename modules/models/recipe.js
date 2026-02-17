import { bootLogger } from './bootLogger.js';
import { Logger } from './logger.js';
import { Nutrition } from './nutrition.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(import.meta.url, 'Defines Recipe model');
// Recipe model used by home/recipes views, including nutrition details.
// Usage: const recipe = Recipe.fromApi(rawRecipe);
class Recipe {
  constructor({
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
      ? extendedIngredients.map((ingredient) => ({ ...ingredient }))
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

  static fromApi(raw = {}) {
    const nutrition = raw.nutrition
      ? Nutrition.fromMock(raw.nutrition)
      : new Nutrition();

    return new Recipe({
      ...raw,
      extendedIngredients: Array.isArray(raw.extendedIngredients)
        ? raw.extendedIngredients.map((ingredient) => ({ ...ingredient }))
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
