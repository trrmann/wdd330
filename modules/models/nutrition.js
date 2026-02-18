import { bootLogger } from './bootLogger.js';
import { Logger } from './logger.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(import.meta.url, 'Defines Nutrition model');
// Nutrition model that normalizes nutrient arrays from API/mock data.
// Usage: const nutrition = Nutrition.fromMock(rawNutrition);
class Nutrition {
  constructor(options = {}) {
    this.init(options);
  }

  init({ nutrients = [] } = {}) {
    this.nutrients = Array.isArray(nutrients)
      ? nutrients.map((nutrient) => ({
          title: nutrient.title || '',
          amount:
            typeof nutrient.amount === 'number'
              ? nutrient.amount
              : Number.parseFloat(nutrient.amount) || 0,
          unit: nutrient.unit || '',
        }))
      : [];
  }

  static fromMock(raw = {}) {
    if (Array.isArray(raw)) {
      return new Nutrition({ nutrients: raw });
    }
    return new Nutrition({ nutrients: raw.nutrients || [] });
  }

  getNutrient(title) {
    if (!title) return null;
    const lowered = title.toLowerCase();
    return (
      this.nutrients.find(
        (nutrient) =>
          nutrient.title && nutrient.title.toLowerCase() === lowered,
      ) || null
    );
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'Nutrition');

Logger.instrumentClass(Nutrition, 'Nutrition');

export { Nutrition };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
