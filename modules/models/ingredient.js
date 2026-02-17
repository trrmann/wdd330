import { bootLogger } from './bootLogger.js';
import { Logger } from './logger.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(import.meta.url, 'Defines Ingredient model');
// Ingredient model for recipe and shopping features.
// Usage: const ingredient = Ingredient.fromApi(rawIngredient);
class Ingredient {
  constructor({
    id = null,
    name = '',
    amount = null,
    unit = '',
    unitLong = '',
    originalString = '',
    aisle = '',
    image = '',
    metaInformation = [],
  } = {}) {
    this.id = id;
    this.name = name;
    this.amount = typeof amount === 'number' ? amount : (amount ?? null);
    this.unit = unit;
    this.unitLong = unitLong;
    this.originalString = originalString;
    this.aisle = aisle;
    this.image = image;
    this.metaInformation = Array.isArray(metaInformation)
      ? [...metaInformation]
      : [];
  }

  static fromApi(raw = {}) {
    return new Ingredient(raw);
  }

  static fromMock(raw = {}) {
    return Ingredient.fromApi(raw);
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'Ingredient');

Logger.instrumentClass(Ingredient, 'Ingredient');

export { Ingredient };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
