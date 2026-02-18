import { bootLogger } from './bootLogger.js';
import { Logger } from './logger.js';
import { Storage } from './storage.js';
import { RecipeApi } from './apiAccess.js';
import { ShoppingList } from './shoppingList.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(import.meta.url, 'Defines Profile model');
// Profile model for per-user dietary preferences and favorites.
// Usage: const profile = new Profile({ dietType: 'vegetarian' });
class Profile {
  constructor(options = {}, internal = {}) {
    this.logger = internal.logger || this.logger || null;

    this.storage =
      internal.storage ||
      this.storage ||
      new Storage({
        logger: this.logger,
      });

    this.recipeApi =
      internal.recipeApi ||
      this.recipeApi ||
      new RecipeApi(this.storage, {
        logger: this.logger,
      });

    const incomingShoppingList =
      internal.shoppingList || this.shoppingList || null;

    let inventoryInstance;

    if (incomingShoppingList && incomingShoppingList.inventory) {
      inventoryInstance = incomingShoppingList.inventory;
    } else if (internal.inventory) {
      inventoryInstance = ShoppingList.createInventoryFromPersisted(
        internal.inventory,
      );
    } else {
      inventoryInstance = ShoppingList.createEmptyInventory();
    }

    const shoppingListInstance =
      incomingShoppingList ||
      new ShoppingList(undefined, {
        logger: this.logger,
        inventory: inventoryInstance,
      });

    this.shoppingList = shoppingListInstance;
    this.inventory = shoppingListInstance.inventory;
    this.init(options);
  }

  init({
    dietType = '',
    allergensText = '',
    maxReadyMinutes = null,
    highlightConflicts = false,
    favoriteRecipeIds = [],
    savedMealPlanIds = [],
    mealPlanPeopleCount = null,
    mealPlanMealsPerDay = null,
    mealPlanCaloriesPerPersonPerDay = null,
    mealPlanCaloriesPerMealSlots = [],
  } = {}) {
    this.dietType = dietType || '';
    this.allergensText = allergensText || '';
    this.maxReadyMinutes =
      typeof maxReadyMinutes === 'number'
        ? maxReadyMinutes
        : (maxReadyMinutes ?? null);
    this.highlightConflicts = Boolean(highlightConflicts);
    this.favoriteRecipeIds = Array.isArray(favoriteRecipeIds)
      ? favoriteRecipeIds.filter((id) => id != null)
      : [];
    this.savedMealPlanIds = Array.isArray(savedMealPlanIds)
      ? savedMealPlanIds.filter((id) => id != null)
      : [];
    this.mealPlanPeopleCount =
      typeof mealPlanPeopleCount === 'number' && mealPlanPeopleCount > 0
        ? Math.trunc(mealPlanPeopleCount)
        : null;
    this.mealPlanMealsPerDay =
      typeof mealPlanMealsPerDay === 'number' && mealPlanMealsPerDay > 0
        ? Math.trunc(mealPlanMealsPerDay)
        : null;
    this.mealPlanCaloriesPerPersonPerDay =
      typeof mealPlanCaloriesPerPersonPerDay === 'number' &&
      mealPlanCaloriesPerPersonPerDay > 0
        ? mealPlanCaloriesPerPersonPerDay
        : null;
    const initialSlots = Array.isArray(mealPlanCaloriesPerMealSlots)
      ? mealPlanCaloriesPerMealSlots
      : [];
    this.mealPlanCaloriesPerMealSlots = initialSlots.map((value) => {
      const numeric =
        typeof value === 'string' ? Number.parseFloat(value) : value;
      return typeof numeric === 'number' &&
        Number.isFinite(numeric) &&
        numeric > 0
        ? numeric
        : null;
    });
  }

  addFavoriteRecipe(recipeId) {
    if (recipeId == null) return;

    const beforeIds = Array.isArray(this.favoriteRecipeIds)
      ? [...this.favoriteRecipeIds]
      : [];

    if (!this.favoriteRecipeIds.includes(recipeId)) {
      this.favoriteRecipeIds.push(recipeId);
    }

    const afterIds = Array.isArray(this.favoriteRecipeIds)
      ? [...this.favoriteRecipeIds]
      : [];

    Logger.staticClassMethodLog(
      'info',
      'Profile',
      'addFavoriteRecipe',
      'Profile.addFavoriteRecipe: Added favorite recipeId',
      {
        recipeId,
        beforeFavoriteRecipeIds: beforeIds,
        afterFavoriteRecipeIds: afterIds,
      },
    );
  }

  removeFavoriteRecipe(recipeId) {
    if (recipeId == null) return;

    const beforeIds = Array.isArray(this.favoriteRecipeIds)
      ? [...this.favoriteRecipeIds]
      : [];

    this.favoriteRecipeIds = this.favoriteRecipeIds.filter(
      (id) => id !== recipeId,
    );

    const afterIds = Array.isArray(this.favoriteRecipeIds)
      ? [...this.favoriteRecipeIds]
      : [];

    Logger.staticClassMethodLog(
      'info',
      'Profile',
      'removeFavoriteRecipe',
      'Profile.removeFavoriteRecipe: Removed favorite recipeId',
      {
        recipeId,
        beforeFavoriteRecipeIds: beforeIds,
        afterFavoriteRecipeIds: afterIds,
      },
    );
  }

  clearFavorites() {
    this.favoriteRecipeIds = [];
  }

  addSavedMealPlan(mealPlanId) {
    if (mealPlanId == null) return;
    if (!this.savedMealPlanIds.includes(mealPlanId)) {
      this.savedMealPlanIds.push(mealPlanId);
    }
  }

  removeSavedMealPlan(mealPlanId) {
    if (mealPlanId == null) return;
    this.savedMealPlanIds = this.savedMealPlanIds.filter(
      (id) => id !== mealPlanId,
    );
  }

  clearSavedMealPlans() {
    this.savedMealPlanIds = [];
  }

  clearAll() {
    this.dietType = '';
    this.allergensText = '';
    this.maxReadyMinutes = null;
    this.highlightConflicts = false;
    this.favoriteRecipeIds = [];
    this.savedMealPlanIds = [];
    this.mealPlanPeopleCount = null;
    this.mealPlanMealsPerDay = null;
    this.mealPlanCaloriesPerPersonPerDay = null;
    this.mealPlanCaloriesPerMealSlots = [];
  }

  setDietaryPreferences({
    dietType = '',
    allergensText = '',
    maxReadyMinutes = null,
  } = {}) {
    this.dietType = dietType || '';
    this.allergensText = allergensText || '';
    this.maxReadyMinutes =
      typeof maxReadyMinutes === 'number'
        ? maxReadyMinutes
        : (maxReadyMinutes ?? null);
  }

  setHighlightConflicts(enabled) {
    this.highlightConflicts = Boolean(enabled);
  }

  setMealPlanSpec({
    peopleCount,
    mealsPerDay,
    caloriesPerPersonPerDay,
    caloriesPerMealSlots,
  } = {}) {
    if (peopleCount !== undefined) {
      const value =
        typeof peopleCount === 'string'
          ? Number.parseInt(peopleCount, 10)
          : peopleCount;
      this.mealPlanPeopleCount =
        typeof value === 'number' && Number.isFinite(value) && value > 0
          ? Math.trunc(value)
          : null;
    }

    if (mealsPerDay !== undefined) {
      const value =
        typeof mealsPerDay === 'string'
          ? Number.parseInt(mealsPerDay, 10)
          : mealsPerDay;
      this.mealPlanMealsPerDay =
        typeof value === 'number' && Number.isFinite(value) && value > 0
          ? Math.trunc(value)
          : null;
    }

    if (caloriesPerPersonPerDay !== undefined) {
      const value =
        typeof caloriesPerPersonPerDay === 'string'
          ? Number.parseFloat(caloriesPerPersonPerDay)
          : caloriesPerPersonPerDay;
      this.mealPlanCaloriesPerPersonPerDay =
        typeof value === 'number' && Number.isFinite(value) && value > 0
          ? value
          : null;
    }

    if (caloriesPerMealSlots !== undefined) {
      const rawSlots = Array.isArray(caloriesPerMealSlots)
        ? caloriesPerMealSlots
        : [];
      const sanitizedSlots = rawSlots.map((value) => {
        const numeric =
          typeof value === 'string' ? Number.parseFloat(value) : value;
        return typeof numeric === 'number' &&
          Number.isFinite(numeric) &&
          numeric > 0
          ? numeric
          : null;
      });
      this.mealPlanCaloriesPerMealSlots = sanitizedSlots;

      if (caloriesPerPersonPerDay === undefined) {
        const total = sanitizedSlots.reduce((sum, slot) => {
          return sum + (typeof slot === 'number' && slot > 0 ? slot : 0);
        }, 0);
        this.mealPlanCaloriesPerPersonPerDay = total > 0 ? total : null;
      }
    }
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'Profile');

Logger.instrumentClass(Profile, 'Profile');

export { Profile };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
