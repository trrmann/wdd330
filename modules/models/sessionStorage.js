// SessionStorage Module
// Purpose: Provides a class-based wrapper around window.sessionStorage with
// safe access helpers and logging.
// Usage: const store = new SessionStorage(); store.loadShoppingList();

import { bootLogger } from './bootLogger.js';
import { Logger } from './logger.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(
  import.meta.url,
  'Defines SessionStorage storage wrapper',
);

const hasWindow = typeof window !== 'undefined';
const SHOPPING_SESSION_KEY = 'chow.shoppingList.session';
const MEALPLAN_SESSION_KEY = 'chow.mealPlan.session';
const MEALPLAN_STATE_SESSION_KEY = 'chow.mealPlan.state.session';

class SessionStorage {
  constructor() {
    this.init();
  }

  init() {
    this.name = 'SessionStorage';
    this.storage = null;

    if (hasWindow) {
      try {
        this.storage = window.sessionStorage || null;
      } catch (error) {
        bootLogger.moduleInfo(
          import.meta.url,
          'SessionStorage: window.sessionStorage unavailable',
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

  loadShoppingList() {
    if (!this.isAvailable()) {
      return null;
    }

    const raw = this.getItem(SHOPPING_SESSION_KEY);
    if (!raw) {
      return null;
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (error) {
      bootLogger.moduleInfo(
        import.meta.url,
        'SessionStorage.loadShoppingList: Failed to parse shopping list JSON',
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
      'SessionStorage.loadShoppingList: Loaded shopping list from session',
      {
        hasData: !!data,
        itemCount: Array.isArray(items) ? items.length : 0,
      },
    );

    return { items };
  }

  saveShoppingList(shoppingList) {
    if (!this.isAvailable()) {
      return;
    }

    const items =
      shoppingList && Array.isArray(shoppingList.items)
        ? shoppingList.items
        : [];

    try {
      const payload = JSON.stringify({ items });
      this.setItem(SHOPPING_SESSION_KEY, payload);
      bootLogger.moduleInfo(
        import.meta.url,
        'SessionStorage.saveShoppingList: Saved shopping list to session',
        { itemCount: items.length },
      );
    } catch (error) {
      bootLogger.moduleInfo(
        import.meta.url,
        'SessionStorage.saveShoppingList: Failed to save shopping list',
        { error: String(error) },
      );
    }
  }

  loadMealPlan() {
    if (!this.isAvailable()) {
      return null;
    }

    const raw = this.getItem(MEALPLAN_SESSION_KEY);
    if (!raw) {
      return null;
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (error) {
      bootLogger.moduleInfo(
        import.meta.url,
        'SessionStorage.loadMealPlan: Failed to parse meal plan JSON',
        { error: String(error) },
      );
      return null;
    }

    const mealCount =
      data && Array.isArray(data.mealsForPlan) ? data.mealsForPlan.length : 0;

    bootLogger.moduleInfo(
      import.meta.url,
      'SessionStorage.loadMealPlan: Loaded meal plan from session',
      {
        hasData: !!data,
        mealCount,
      },
    );

    return data && typeof data === 'object' ? data : null;
  }

  saveMealPlan(planData) {
    if (!this.isAvailable()) {
      return;
    }

    const payload = planData && typeof planData === 'object' ? planData : null;
    if (!payload) {
      this.removeItem(MEALPLAN_SESSION_KEY);
      return;
    }

    try {
      const json = JSON.stringify(payload);
      this.setItem(MEALPLAN_SESSION_KEY, json);
      const mealCount = Array.isArray(payload.mealsForPlan)
        ? payload.mealsForPlan.length
        : 0;
      bootLogger.moduleInfo(
        import.meta.url,
        'SessionStorage.saveMealPlan: Saved meal plan to session',
        { mealCount },
      );
    } catch (error) {
      bootLogger.moduleInfo(
        import.meta.url,
        'SessionStorage.saveMealPlan: Failed to save meal plan',
        { error: String(error) },
      );
    }
  }

  loadMealPlanState() {
    if (!this.isAvailable()) {
      return null;
    }

    const raw = this.getItem(MEALPLAN_STATE_SESSION_KEY);
    if (!raw) {
      return null;
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (error) {
      bootLogger.moduleInfo(
        import.meta.url,
        'SessionStorage.loadMealPlanState: Failed to parse meal plan state JSON',
        { error: String(error) },
      );
      return null;
    }

    const slotCount =
      data && Array.isArray(data.caloriesPerMealSlots)
        ? data.caloriesPerMealSlots.length
        : 0;

    bootLogger.moduleInfo(
      import.meta.url,
      'SessionStorage.loadMealPlanState: Loaded meal plan page state from session',
      {
        hasData: !!data,
        slotCount,
      },
    );

    return data && typeof data === 'object' ? data : null;
  }

  saveMealPlanState(state) {
    if (!this.isAvailable()) {
      return;
    }

    if (!state || typeof state !== 'object') {
      this.removeItem(MEALPLAN_STATE_SESSION_KEY);
      bootLogger.moduleInfo(
        import.meta.url,
        'SessionStorage.saveMealPlanState: Cleared meal plan state from session',
      );
      return;
    }

    const payload = {
      days:
        typeof state.days === 'number' &&
        Number.isFinite(state.days) &&
        state.days > 0
          ? Math.trunc(state.days)
          : null,
      peopleCount:
        typeof state.peopleCount === 'number' &&
        Number.isFinite(state.peopleCount) &&
        state.peopleCount > 0
          ? Math.trunc(state.peopleCount)
          : null,
      mealsPerDay:
        typeof state.mealsPerDay === 'number' &&
        Number.isFinite(state.mealsPerDay) &&
        state.mealsPerDay > 0
          ? Math.trunc(state.mealsPerDay)
          : null,
      personNames: Array.isArray(state.personNames)
        ? state.personNames.map((name) => String(name || ''))
        : [],
      mealNames: Array.isArray(state.mealNames)
        ? state.mealNames.map((name) => String(name || ''))
        : [],
      caloriesPerMealSlots: Array.isArray(state.caloriesPerMealSlots)
        ? state.caloriesPerMealSlots.map((value) => {
            const numeric =
              typeof value === 'string' ? Number.parseFloat(value) : value;
            return typeof numeric === 'number' &&
              Number.isFinite(numeric) &&
              numeric > 0
              ? numeric
              : null;
          })
        : [],
    };

    try {
      const json = JSON.stringify(payload);
      this.setItem(MEALPLAN_STATE_SESSION_KEY, json);
      bootLogger.moduleInfo(
        import.meta.url,
        'SessionStorage.saveMealPlanState: Saved meal plan page state to session',
        {
          days: payload.days,
          mealsPerDay: payload.mealsPerDay,
          peopleCount: payload.peopleCount,
          slotCount: payload.caloriesPerMealSlots.length,
        },
      );
    } catch (error) {
      bootLogger.moduleInfo(
        import.meta.url,
        'SessionStorage.saveMealPlanState: Failed to save meal plan page state',
        { error: String(error) },
      );
    }
  }

  clearMealPlanState() {
    if (!this.isAvailable()) {
      return;
    }

    this.removeItem(MEALPLAN_STATE_SESSION_KEY);
    bootLogger.moduleInfo(
      import.meta.url,
      'SessionStorage.clearMealPlanState: Removed meal plan page state from session',
    );
  }

  clearMealPlan() {
    if (!this.isAvailable()) {
      return;
    }

    this.removeItem(MEALPLAN_SESSION_KEY);
    bootLogger.moduleInfo(
      import.meta.url,
      'SessionStorage.clearMealPlan: Removed meal plan from session',
    );
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'SessionStorage');

Logger.instrumentClass(SessionStorage, 'SessionStorage');

export { SessionStorage };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
