import { bootLogger } from './bootLogger.js';
import { Logger } from './logger.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(import.meta.url, 'Defines Inventory model');
// Inventory model for pantry items and stock state.
// Usage: const inventory = new Inventory(); inventory.addItem({ name: 'Apples' });
class Inventory {
  constructor(options = {}, internal = {}) {
    this.logger = internal.logger || this.logger || null;
    this.init(options);
  }

  init({ items = [] } = {}) {
    this.items = Array.isArray(items)
      ? items.map((item) => ({
          id: item.id ?? null,
          name: item.name || '',
          inStock: Boolean(item.inStock),
          quantity:
            typeof item.quantity === 'number'
              ? item.quantity
              : (item.quantity ?? null),
          unit: item.unit || '',
          selected: Boolean(item.selected),
          partialQuantity:
            typeof item.partialQuantity === 'number' && item.partialQuantity > 0
              ? item.partialQuantity
              : 0,
        }))
      : [];
  }

  addItem({
    id = null,
    name,
    inStock = false,
    quantity = null,
    unit = '',
    selected = false,
    partialQuantity = 0,
  } = {}) {
    if (!name) return;
    const safePartial =
      typeof partialQuantity === 'number' && partialQuantity > 0
        ? partialQuantity
        : 0;
    this.items.push({
      id,
      name,
      inStock: Boolean(inStock),
      quantity,
      unit,
      selected: Boolean(selected),
      partialQuantity: safePartial,
    });
  }

  clearItems() {
    this.items.splice(0, this.items.length);
  }

  static buildKnownItemMetadata({
    ingredientsCollection = [],
    shoppingItems = [],
    inventoryItems = [],
  } = {}) {
    const knownNames = new Set();
    const knownUnits = {};

    if (
      Array.isArray(ingredientsCollection) &&
      ingredientsCollection.length > 0
    ) {
      ingredientsCollection.forEach((ingredient) => {
        const name = (ingredient && ingredient.name) || '';
        if (!name) return;
        knownNames.add(name);

        let unit = (ingredient && ingredient.unit) || '';
        if (!unit) {
          const aisle = (ingredient && ingredient.aisle) || '';
          if (aisle && aisle.toLowerCase() === 'produce') {
            unit = 'pcs';
          }
        }

        const key = name.toLowerCase();
        if (unit && !knownUnits[key]) {
          knownUnits[key] = unit;
        }
      });
    }

    if (Array.isArray(shoppingItems) && shoppingItems.length > 0) {
      shoppingItems.forEach((item) => {
        const name = (item && item.text) || '';
        if (!name) return;
        knownNames.add(name);
        const unit = (item && item.unit) || '';
        const key = name.toLowerCase();
        if (unit && !knownUnits[key]) {
          knownUnits[key] = unit;
        }
      });
    }

    if (Array.isArray(inventoryItems) && inventoryItems.length > 0) {
      inventoryItems.forEach((entry) => {
        const name = (entry && entry.name) || '';
        if (!name) return;
        knownNames.add(name);
        const unit = (entry && entry.unit) || '';
        const key = name.toLowerCase();
        if (unit && !knownUnits[key]) {
          knownUnits[key] = unit;
        }
      });
    }

    return { knownNames, knownUnits };
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'Inventory');

Logger.instrumentClass(Inventory, 'Inventory');

export { Inventory };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
