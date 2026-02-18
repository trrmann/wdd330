// Legacy ShoppingList facade
//
// This module now delegates to the canonical implementation in
// modules/models/shoppingList.js so that existing import paths continue to
// work without maintaining a separate copy of the logic or exporting
// singleton instances.

import { bootLogger } from './models/bootLogger.js';
import { Inventory, ShoppingList, ingredients } from './models/shoppingList.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(
  import.meta.url,
  'Legacy ShoppingList module delegating to modules/models/shoppingList.js',
);

bootLogger.moduleClassLoaded(import.meta.url, 'ShoppingList');

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);

export { Inventory, ShoppingList, ingredients };
