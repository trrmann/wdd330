// Meal Plan Module
// Purpose: Generates and displays meal plans.

import { bootLogger } from './bootLogger.js';
import { Logger } from './logger.js';
import { Meal } from './meal.js';
import { Profile } from './profile.js';
import { Recipes } from './recipes.js';

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
  constructor(options = {}, internal = {}) {
    this.logger = internal.logger || this.logger || null;
    this.init(options);
  }

  init({
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
    if (plan instanceof MealPlan) {
      MealPlan._currentMealPlan = plan;
    } else {
      MealPlan._currentMealPlan = null;
    }
  }

  static getCurrentMealPlan() {
    return MealPlan._currentMealPlan || null;
  }

  static getAllMeals() {
    return meals;
  }

  static clearAllMeals() {
    if (Array.isArray(meals)) {
      meals.splice(0, meals.length);
    }
  }

  static replaceAllMeals(rawMeals) {
    if (!Array.isArray(rawMeals)) {
      return;
    }
    meals.splice(0, meals.length);
    rawMeals.forEach((raw) => {
      if (!raw) return;
      meals.push(new Meal(raw));
    });
  }

  static populateRecipesFromDataset(dataset) {
    Recipes.populateRecipes(dataset);
  }

  static getAvailableRecipes() {
    return Recipes.getAll();
  }

  static isRecipeIdFavoriteForProfile(recipeId, profile) {
    return Recipes.isRecipeIdFavoriteForProfile(recipeId, profile);
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

  static getRecipeScale({ recipe, peopleCount } = {}) {
    if (!recipe) return 1;

    const explicitScale =
      typeof recipe.mealPlanScale === 'number' &&
      Number.isFinite(recipe.mealPlanScale) &&
      recipe.mealPlanScale > 0
        ? recipe.mealPlanScale
        : null;
    if (explicitScale != null) {
      return explicitScale;
    }

    const servings =
      typeof recipe.servings === 'number' && recipe.servings > 0
        ? recipe.servings
        : null;
    const people =
      typeof peopleCount === 'number' &&
      Number.isFinite(peopleCount) &&
      peopleCount > 0
        ? peopleCount
        : null;

    if (servings != null && people != null) {
      return people / servings;
    }

    return 1;
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

        const scale = MealPlan.getRecipeScale({
          recipe,
          peopleCount: peopleCountValue,
        });

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

    const minAbs = 1 / 32; // Smallest meaningful amount for display
    let displayValue = numeric;

    const absOriginal = Math.abs(numeric);
    if (absOriginal > 0 && absOriginal < minAbs) {
      // Clamp extremely small non-zero values to the minimum displayable amount,
      // but keep the original numeric value in callers.
      displayValue = numeric < 0 ? -minAbs : minAbs;
    }

    const absDisplay = Math.abs(displayValue);
    if (absDisplay === 0) {
      return '0';
    }

    const sigDigits = 3;
    const exponent = Math.floor(Math.log10(absDisplay));
    const scale = Math.pow(10, sigDigits - 1 - exponent);
    const rounded = Math.round(displayValue * scale) / scale;

    let text = String(rounded);

    if (text.includes('e') || text.includes('E')) {
      // Fallback for cases where very small/large numbers end up in exponent form.
      text = rounded.toFixed(sigDigits);
    }

    if (text.includes('.')) {
      // Trim trailing zeros and a trailing decimal point.
      text = text.replace(/\.0+$/, '');
      text = text.replace(/\.(?=\D|$)/, '.').replace(/\.$/, '');
    }

    return text;
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
      recipe && Recipes.isRecipeIdFavoriteForProfile(recipe.id, profile);

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

  static buildSavedPlanRecord({ existingPlans, plan, name } = {}) {
    if (!plan) {
      return { plans: Array.isArray(existingPlans) ? existingPlans : [] };
    }

    const plans = Array.isArray(existingPlans) ? existingPlans.slice() : [];

    let planId =
      typeof plan.id === 'number' && Number.isFinite(plan.id) ? plan.id : null;
    let existingIndex = -1;

    if (planId != null) {
      existingIndex = plans.findIndex(
        (record) => record && record.id === planId,
      );
    }

    if (existingIndex === -1) {
      const maxId = plans.reduce((max, record) => {
        const value =
          record && typeof record.id === 'number' && Number.isFinite(record.id)
            ? record.id
            : null;
        return value != null && value > max ? value : max;
      }, 0);
      planId = maxId + 1;
    }

    const record = {
      id: planId,
      name,
      profileSnapshot: plan.profileSnapshot || null,
      days: plan.days,
      mealsPerDay: plan.mealsPerDay,
      mealsForPlan: Array.isArray(plan.mealsForPlan)
        ? plan.mealsForPlan.map((meal) => ({ ...meal }))
        : [],
    };

    if (existingIndex >= 0) {
      plans[existingIndex] = record;
    } else {
      plans.push(record);
    }

    plan.id = planId;
    plan.name = name;
    MealPlan.setCurrentMealPlan(plan);

    return { plans, record, planId };
  }

  static buildShoppingListItemsFromPlan({
    planMeals,
    peopleCount,
    inventoryItems,
  } = {}) {
    const aggregate = MealPlan.buildRequiredIngredientsForPlan(
      planMeals,
      peopleCount,
    );

    if (!aggregate || aggregate.size === 0) {
      return {
        aggregate,
        pantryTotals: new Map(),
        finalItems: new Map(),
      };
    }

    const pantryTotals = new Map();
    if (Array.isArray(inventoryItems)) {
      inventoryItems.forEach((entry) => {
        if (!entry || !entry.inStock) return;
        const pantryName = (entry.name || '').trim();
        if (!pantryName) return;
        const pantryUnit = (entry.unit || '').trim();
        const pantryQuantity =
          typeof entry.quantity === 'number' &&
          Number.isFinite(entry.quantity) &&
          entry.quantity > 0
            ? entry.quantity
            : 0;
        if (pantryQuantity <= 0) return;

        const pantryKey = MealPlan.makeIngredientKey(pantryName, pantryUnit);
        const existingTotal = pantryTotals.get(pantryKey) || 0;
        pantryTotals.set(pantryKey, existingTotal + pantryQuantity);
      });
    }

    const finalItems = new Map();
    const epsilon = 1e-6;
    aggregate.forEach((entry, key) => {
      const requiredQuantity =
        typeof entry.quantity === 'number' &&
        Number.isFinite(entry.quantity) &&
        entry.quantity > 0
          ? entry.quantity
          : 0;
      if (requiredQuantity <= 0) return;

      const pantryQuantity = pantryTotals.get(key) || 0;
      let needed = requiredQuantity - pantryQuantity;

      if (needed <= epsilon) return;

      if (!Number.isInteger(needed)) {
        needed = Math.round(needed * 1000) / 1000;
      }

      if (needed > 0) {
        finalItems.set(key, {
          name: entry.name,
          quantity: needed,
          unit: entry.unit,
        });
      }
    });

    return { aggregate, pantryTotals, finalItems };
  }

  static usePantryForPlan({ planMeals, peopleCount, inventoryItems } = {}) {
    const aggregate = MealPlan.buildRequiredIngredientsForPlan(
      planMeals,
      peopleCount,
    );

    if (!aggregate || aggregate.size === 0) {
      return {
        aggregate,
        pantryTotals: new Map(),
        allCovered: false,
        updatedInventoryItems: Array.isArray(inventoryItems)
          ? inventoryItems
          : [],
      };
    }

    const pantryTotals = new Map();
    if (Array.isArray(inventoryItems)) {
      inventoryItems.forEach((entry) => {
        if (!entry || !entry.inStock) return;
        const pantryName = (entry.name || '').trim();
        if (!pantryName) return;
        const pantryUnit = (entry.unit || '').trim();
        const pantryQuantity =
          typeof entry.quantity === 'number' &&
          Number.isFinite(entry.quantity) &&
          entry.quantity > 0
            ? entry.quantity
            : 0;
        if (pantryQuantity <= 0) return;

        const pantryKey = MealPlan.makeIngredientKey(pantryName, pantryUnit);
        const existingTotal = pantryTotals.get(pantryKey) || 0;
        pantryTotals.set(pantryKey, existingTotal + pantryQuantity);
      });
    }

    let allCovered = true;
    const epsilon = 1e-6;

    aggregate.forEach((entry, key) => {
      const requiredQuantity =
        typeof entry.quantity === 'number' &&
        Number.isFinite(entry.quantity) &&
        entry.quantity > 0
          ? entry.quantity
          : 0;
      if (requiredQuantity <= 0) {
        return;
      }

      const pantryQuantity = pantryTotals.get(key) || 0;
      if (pantryQuantity + epsilon < requiredQuantity) {
        allCovered = false;
      }
    });

    if (!allCovered || !Array.isArray(inventoryItems)) {
      return {
        aggregate,
        pantryTotals,
        allCovered,
        updatedInventoryItems: Array.isArray(inventoryItems)
          ? inventoryItems
          : [],
      };
    }

    aggregate.forEach((entry, key) => {
      const requiredQuantity =
        typeof entry.quantity === 'number' &&
        Number.isFinite(entry.quantity) &&
        entry.quantity > 0
          ? entry.quantity
          : 0;
      if (requiredQuantity <= 0) {
        return;
      }

      let remaining = requiredQuantity;

      inventoryItems.forEach((invEntry) => {
        if (!invEntry || !invEntry.inStock) return;
        const pantryName = (invEntry.name || '').trim();
        if (!pantryName) return;
        const pantryUnit = (invEntry.unit || '').trim();
        const pantryKey = MealPlan.makeIngredientKey(pantryName, pantryUnit);
        if (pantryKey !== key) return;

        const currentQuantity =
          typeof invEntry.quantity === 'number' &&
          Number.isFinite(invEntry.quantity) &&
          invEntry.quantity > 0
            ? invEntry.quantity
            : 0;
        if (currentQuantity <= 0 || remaining <= epsilon) return;

        const subtract =
          currentQuantity < remaining ? currentQuantity : remaining;
        const nextQuantity = currentQuantity - subtract;
        invEntry.quantity = nextQuantity > epsilon ? nextQuantity : 0;
        if (!invEntry.quantity || invEntry.quantity <= epsilon) {
          invEntry.inStock = false;
        }
        invEntry.partialQuantity = 0;
        invEntry.selected = false;

        remaining -= subtract;
      });
    });

    return {
      aggregate,
      pantryTotals,
      allCovered: true,
      updatedInventoryItems: inventoryItems,
    };
  }

  static applySavedPlanRecord({ record, mealsCollection, profile } = {}) {
    if (
      !record ||
      !Array.isArray(record.mealsForPlan) ||
      record.mealsForPlan.length === 0
    ) {
      return null;
    }

    const plan = new MealPlan(record);

    if (Array.isArray(mealsCollection)) {
      mealsCollection.splice(0, mealsCollection.length);
      plan.mealsForPlan.forEach((meal) => {
        mealsCollection.push(meal instanceof Meal ? meal : new Meal(meal));
      });
    }

    const snapshot =
      plan && plan.profileSnapshot && typeof plan.profileSnapshot === 'object'
        ? plan.profileSnapshot
        : null;

    if (profile && snapshot) {
      if (typeof profile.setDietaryPreferences === 'function') {
        profile.setDietaryPreferences({
          dietType: snapshot.dietType,
          allergensText: snapshot.allergensText,
          maxReadyMinutes: snapshot.maxReadyMinutes,
        });
      }

      if (typeof profile.setMealPlanSpec === 'function') {
        profile.setMealPlanSpec({
          peopleCount: snapshot.mealPlanPeopleCount,
          mealsPerDay: snapshot.mealPlanMealsPerDay,
          caloriesPerPersonPerDay: snapshot.mealPlanCaloriesPerPersonPerDay,
        });
      }
    }

    MealPlan.setCurrentMealPlan(plan);

    return plan;
  }

  static generatePlanFromSlots({
    profile,
    profileSnapshot = null,
    recipesCollection,
    slots,
    days,
    mealsPerDay,
    peopleCount,
    mealNames = [],
    planName = '',
  } = {}) {
    if (!Array.isArray(recipesCollection) || recipesCollection.length === 0) {
      return null;
    }

    const slotValues = Array.isArray(slots) ? slots : [];
    const hasCalories = slotValues.some(
      (value) =>
        typeof value === 'number' && Number.isFinite(value) && value > 0,
    );
    if (!hasCalories) {
      return null;
    }

    const validDays =
      typeof days === 'number' && Number.isFinite(days) && days > 0
        ? Math.trunc(days)
        : 1;
    const validMealsPerDay =
      typeof mealsPerDay === 'number' &&
      Number.isFinite(mealsPerDay) &&
      mealsPerDay > 0
        ? Math.trunc(mealsPerDay)
        : 0;
    const validPeopleCount =
      typeof peopleCount === 'number' &&
      Number.isFinite(peopleCount) &&
      peopleCount > 0
        ? Math.trunc(peopleCount)
        : 1;

    if (validMealsPerDay <= 0) {
      return null;
    }

    meals.splice(0, meals.length);

    let idCounter = 1;
    const usedRecipeIdsForCurrentPlan = new Set();

    for (let dayIndex = 0; dayIndex < validDays; dayIndex += 1) {
      for (let mealIndex = 0; mealIndex < validMealsPerDay; mealIndex += 1) {
        const name = mealNames[mealIndex] || `Meal ${mealIndex + 1}`;

        const perPersonCalories = [];
        for (
          let personIndex = 0;
          personIndex < validPeopleCount;
          personIndex += 1
        ) {
          const flatIndex = mealIndex * validPeopleCount + personIndex;
          const value =
            typeof slotValues[flatIndex] === 'number' &&
            slotValues[flatIndex] > 0
              ? slotValues[flatIndex]
              : null;
          perPersonCalories.push(value);
        }

        const nonNullPerPerson = perPersonCalories.filter(
          (value) => typeof value === 'number' && value > 0,
        );
        const targetCaloriesPerPerson =
          nonNullPerPerson.length > 0
            ? nonNullPerPerson.reduce((sum, value) => sum + value, 0) /
              nonNullPerPerson.length
            : null;

        const recipesForMeal = MealPlan.buildRecipesForMeal({
          recipesCollection,
          profile,
          targetCaloriesPerPerson,
          usedRecipeIdsForCurrentPlan,
        });

        const targetTotalCaloriesForMeal =
          nonNullPerPerson.length > 0
            ? nonNullPerPerson.reduce((sum, value) => sum + value, 0)
            : 0;

        if (
          Array.isArray(recipesForMeal) &&
          recipesForMeal.length > 0 &&
          targetTotalCaloriesForMeal > 0
        ) {
          let baselineTotalCaloriesForMeal = 0;

          recipesForMeal.forEach((recipe) => {
            if (!recipe || !(recipe.nutrition instanceof Object)) return;

            const nutrient =
              typeof recipe.nutrition.getNutrient === 'function'
                ? recipe.nutrition.getNutrient('Calories')
                : null;
            const perServingCalories =
              nutrient && typeof nutrient.amount === 'number'
                ? nutrient.amount
                : null;

            if (
              typeof perServingCalories === 'number' &&
              Number.isFinite(perServingCalories)
            ) {
              const servingsForRecipe =
                typeof recipe.servings === 'number' && recipe.servings > 0
                  ? recipe.servings
                  : 1;
              baselineTotalCaloriesForMeal +=
                perServingCalories * servingsForRecipe;
            }
          });

          if (
            baselineTotalCaloriesForMeal > 0 &&
            Number.isFinite(baselineTotalCaloriesForMeal)
          ) {
            const mealScale =
              targetTotalCaloriesForMeal / baselineTotalCaloriesForMeal;

            if (typeof mealScale === 'number' && mealScale > 0) {
              recipesForMeal.forEach((recipe) => {
                if (!recipe) return;
                recipe.mealPlanScale = mealScale;
              });
            }
          }
        }

        recipesForMeal.forEach((recipe) => {
          if (recipe && recipe.id != null) {
            usedRecipeIdsForCurrentPlan.add(recipe.id);
          }
        });

        meals.push(
          new Meal({
            id: idCounter,
            name,
            dayIndex,
            mealType: name,
            recipesForMeal,
            notes: JSON.stringify({ perPersonCalories }),
          }),
        );
        idCounter += 1;
      }
    }

    const plan = new MealPlan({
      id: null,
      name: planName || '',
      profileSnapshot,
      days: validDays,
      mealsPerDay: validMealsPerDay,
      mealsForPlan: Array.isArray(meals) ? meals : [],
    });

    MealPlan.setCurrentMealPlan(plan);

    return plan;
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'MealPlan');

Logger.instrumentClass(MealPlan, 'MealPlan');

export { Meal, meals, MealPlan, Profile };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
