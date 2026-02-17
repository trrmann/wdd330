import { bootLogger } from './bootLogger.js';
import { Logger } from './logger.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(import.meta.url, 'Defines Inventory model');
// Inventory model for pantry items and stock state.
// Usage: const inventory = new Inventory(); inventory.addItem({ name: 'Apples' });
class Inventory {
  constructor({ items = [] } = {}) {
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

  setItemStock(name, inStock) {
    if (!name) return;
    const lowered = name.toLowerCase();
    const item = this.items.find(
      (entry) => entry.name && entry.name.toLowerCase() === lowered,
    );
    if (!item) return;
    item.inStock = Boolean(inStock);
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'Inventory');

Logger.instrumentClass(Inventory, 'Inventory');

export { Inventory };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
