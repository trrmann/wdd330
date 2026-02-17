// Shopping List Module
// Purpose: Creates and manages shopping lists.

import { bootLogger } from './bootLogger.js';
import { Logger } from './logger.js';
import { Ingredient } from './ingredient.js';
import { Inventory } from './inventory.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(
  import.meta.url,
  'Defines shopping list module (Ingredient, Inventory, ShoppingList, ingredients)',
);

// Represents a shopping list with items and quantities and
// provides helpers to add, remove, toggle, and adjust items.
class ShoppingList {
  constructor({ id = null, name = '', items = [] } = {}) {
    this.id = id;
    this.name = name;
    this.items = Array.isArray(items)
      ? items.map((item) => ({
          id: item.id ?? null,
          text: item.text || '',
          // "inStock" here represents the checked/selected state on the list
          inStock: Boolean(item.inStock),
          quantity:
            typeof item.quantity === 'number' && item.quantity > 0
              ? item.quantity
              : 1,
          unit: item.unit || '',
          partialQuantity:
            typeof item.partialQuantity === 'number' && item.partialQuantity > 0
              ? item.partialQuantity
              : 0,
        }))
      : [];
  }

  adjustQuantity(idOrText, delta) {
    if (!idOrText && idOrText !== 0) return;
    if (typeof delta !== 'number' || !Number.isFinite(delta)) return;
    const key = String(idOrText).toLowerCase();
    const item = this.items.find((entry) => {
      if (entry.id != null && String(entry.id).toLowerCase() === key)
        return true;
      return entry.text && entry.text.toLowerCase() === key;
    });
    if (!item) return;
    const next = (item.quantity ?? 1) + delta;
    item.quantity = next > 0 ? next : 1;
  }

  addItem(text, { id = null, inStock = false, quantity = 1, unit = '' } = {}) {
    if (!text) return;
    const safeQuantity =
      typeof quantity === 'number' && quantity > 0 ? quantity : 1;
    this.items.push({
      id,
      text,
      inStock: Boolean(inStock),
      quantity: safeQuantity,
      unit: unit || '',
      partialQuantity: 0,
    });
  }

  clearItems() {
    this.items.splice(0, this.items.length);
  }

  removeItem(idOrText) {
    if (!idOrText && idOrText !== 0) return;
    const key = String(idOrText).toLowerCase();
    this.items = this.items.filter((entry) => {
      if (entry.id != null && String(entry.id).toLowerCase() === key)
        return false;
      return !(
        entry.text &&
        entry.text.toLowerCase &&
        entry.text.toLowerCase() === key
      );
    });
  }

  setQuantity(idOrText, quantity) {
    if (!idOrText && idOrText !== 0) return;
    const key = String(idOrText).toLowerCase();
    const item = this.items.find((entry) => {
      if (entry.id != null && String(entry.id).toLowerCase() === key)
        return true;
      return entry.text && entry.text.toLowerCase() === key;
    });
    if (!item) return;
    const safeQuantity =
      typeof quantity === 'number' && quantity > 0 ? quantity : 1;
    item.quantity = safeQuantity;
  }

  toggleItem(idOrText) {
    if (!idOrText && idOrText !== 0) return;
    const key = String(idOrText).toLowerCase();
    const item = this.items.find((entry) => {
      if (entry.id != null && String(entry.id).toLowerCase() === key)
        return true;
      return entry.text && entry.text.toLowerCase() === key;
    });
    if (!item) return;
    item.inStock = !item.inStock;
  }
}

// Shared ingredients collection used across recipes and shopping features
const ingredients = [];

ShoppingList.instance = null;

ShoppingList.getInstance = function getInstance() {
  if (!ShoppingList.instance) {
    ShoppingList.instance = new ShoppingList();
  }
  return ShoppingList.instance;
};

Inventory.instance = null;

Inventory.getInstance = function getInstance() {
  if (!Inventory.instance) {
    Inventory.instance = new Inventory();
  }
  return Inventory.instance;
};

bootLogger.moduleClassLoaded(import.meta.url, 'ShoppingList');

Logger.instrumentClass(ShoppingList, 'ShoppingList');

export { Ingredient, Inventory, ShoppingList, ingredients };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
