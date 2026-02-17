import { bootLogger } from '../models/bootLogger.js';

import { Logger } from '../models/logger.js';
import { Site } from './site.js';
import {
  ShoppingList,
  Inventory,
  ingredients as sharedIngredients,
} from '../models/shoppingList.js';
import { Storage } from '../models/storage.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(import.meta.url, 'Defines ShoppingPage');

// Shopping page controller: coordinates shopping list and pantry
// inventory views and persistence.
// Usage: const page = new ShoppingPage(config, { logger }); page.init(config);
class ShoppingPage {
  static get descriptors() {
    return {
      config: {
        value: null,
        writable: true,
        enumerable: false,
        configurable: false,
      },
      logger: {
        value: null,
        writable: true,
        enumerable: false,
        configurable: false,
      },
      initialized: {
        value: false,
        writable: true,
        enumerable: false,
        configurable: false,
      },
      view: {
        value: null,
        writable: true,
        enumerable: false,
        configurable: false,
      },
      shoppingList: {
        value: null,
        writable: true,
        enumerable: false,
        configurable: false,
      },
      inventory: {
        value: null,
        writable: true,
        enumerable: false,
        configurable: false,
      },
      knownItemUnits: {
        value: null,
        writable: true,
        enumerable: false,
        configurable: false,
      },
    };
  }

  // constructor: Creates the ShoppingPage controller and optionally initializes.
  constructor(config = null, options = {}) {
    Object.defineProperties(this, ShoppingPage.descriptors);
    this.logger = options.logger || null;
    this.log(
      'constructor',
      'objectCreateStart',
      'ShoppingPage.constructor: Starting',
    );
    this.config = config;
    this.shoppingList = ShoppingList.getInstance();
    this.inventory = Inventory.getInstance();
    this.knownItemUnits = {};
    this.log(
      'constructor',
      'objectCreateComplete',
      'ShoppingPage.constructor: Completed',
    );
    this.log(
      'constructor',
      'info',
      'ShoppingPage.constructor: ShoppingPage created',
    );
    // Immediately initialize after construction
    if (config) {
      this.init(config);
    }
  }

  // log: Delegates logging to the shared Logger using ShoppingPage conventions.
  log(methodName, level, ...args) {
    if (!this.logger) return;

    if (this.logger.isSignatureLevel(level)) {
      if (typeof methodName === 'string') {
        if (level.startsWith('passthrough')) {
          return this.logger.passthroughMethod(
            'ShoppingPage',
            methodName,
            ...args,
          );
        }
        this.logger.classMethodLog(level, 'ShoppingPage', methodName, ...args);
      } else if (typeof methodName === 'object' && methodName !== null) {
        if (level.startsWith('function')) {
          this.logger.functionLog(level, ...args);
        } else {
          this.logger.classLog(level, ...args);
        }
      }
    } else {
      this.logger.classMethodLog(level, 'ShoppingPage', methodName, ...args);
    }
  }

  // init: Builds the initial Shopping page view model from the template.
  init(config) {
    if (this.initialized && this.view) {
      // State: Reuse existing ShoppingPage view model when already initialized.
      return this.log('init', 'passthroughMethodComplete', this.view, {
        toLogValue: (page) => ({
          title: page.title,
          hasContent: !!page.content,
        }),
      });
    }

    this.log('init', 'objectInitStart', 'ShoppingPage.init: Starting');
    // State: Capture the latest ShoppingPage configuration on the instance.
    this.config = config;
    const template = document.getElementById(config.ids.templates.shoppingPage);
    if (!template) {
      const errorResult = { title: config.titles.errorPage, content: '' };
      this.log(
        'init',
        'info',
        'ShoppingPage.init: No shopping template found, returning error page',
      );
      return this.log('init', 'passthroughMethodComplete', errorResult, {
        toLogValue: (page) => ({
          title: page.title,
          hasContent: !!page.content,
        }),
      });
    }
    // State: Mark ShoppingPage as initialized.
    this.initialized = true;
    this.log('init', 'objectInitComplete', 'ShoppingPage.init: Completed');
    this.log('init', 'info', 'ShoppingPage.init: ShoppingPage initialized');
    const result = {
      title: config.titles.shoppingPage,
      content: template.innerHTML,
    };
    // State: Cache the rendered ShoppingPage view model.
    this.view = result;
    return this.log('init', 'passthroughMethodComplete', this.view, {
      toLogValue: (page) => ({ title: page.title, hasContent: !!page.content }),
    });
  }

  applyShoppingClasses(config, rootElement) {
    if (!config || !config.classes || !config.ids || !rootElement) return;

    const { classes, ids } = config;

    const mappings = [
      [ids.shoppingQtyInput, classes.shoppingQty],
      [ids.shoppingUnitInput, classes.shoppingUnit],
      [ids.shoppingNewItemInput, classes.shoppingNewItem],
      [ids.shoppingKnownToggleButton, classes.shoppingKnownToggle],
      [ids.shoppingKnownMenu, classes.shoppingKnownMenu],
      [ids.shoppingAddButton, classes.shoppingAddBtn],
      [ids.shoppingMoveToPantryButton, classes.shoppingMoveToPantryBtn],
      [ids.shoppingBuyMoreButton, classes.shoppingBuyMoreBtn],
      [ids.shoppingDontBuyButton, classes.shoppingDontBuyBtn],
      [ids.shoppingMoveToShoppingButton, classes.shoppingMoveToShoppingBtn],
      [ids.shoppingDiscardButton, classes.shoppingDiscardBtn],
      [ids.shoppingPageSection, classes.shoppingPage],
      [ids.shoppingHeader, classes.shoppingHeader],
      [ids.shoppingAddItem, classes.shoppingAddItem],
      [ids.shoppingKnownWrapper, classes.shoppingKnownWrapper],
      [ids.shoppingLists, classes.shoppingLists],
      [ids.shoppingListSectionShopping, classes.shoppingListSection],
      [ids.shoppingListSectionShopping, classes.shoppingListSectionShopping],
      [ids.shoppingListSectionPantry, classes.shoppingListSection],
      [ids.shoppingListSectionPantry, classes.shoppingListSectionPantry],
      [ids.shoppingListActionsShopping, classes.shoppingListActions],
      [ids.shoppingListActionsShopping, classes.shoppingListActionsShopping],
      [ids.shoppingListActionsPantry, classes.shoppingListActions],
      [ids.shoppingListActionsPantry, classes.shoppingListActionsPantry],
      [ids.shoppingListItemsShopping, classes.shoppingListItems],
      [ids.shoppingListItemsShopping, classes.shoppingListItemsShopping],
      [ids.shoppingListItemsPantry, classes.shoppingListItems],
      [ids.shoppingListItemsPantry, classes.shoppingListItemsPantry],
    ];

    mappings.forEach(([idValue, className]) => {
      if (!idValue || !className) return;
      const element = rootElement.querySelector(`#${CSS.escape(idValue)}`);
      if (element && !element.classList.contains(className)) {
        element.classList.add(className);
      }
    });
  }

  // afterRender: Wires Shopping page event handlers and accessibility tweaks.
  afterRender(config) {
    this.log(
      'afterRender',
      'lifecycle',
      'shoppingPage.afterRender: Starting afterRender lifecycle hook',
    );
    const mainElement = document.querySelector(`.${config.classes.main}`);
    if (mainElement) {
      this.applyShoppingClasses(config, mainElement);
    }
    this.attachShoppingEventListeners(config);
    if (mainElement && config.titles) {
      const shoppingHeading = mainElement.querySelector(
        '.shopping-list-section-shopping h3',
      );
      if (shoppingHeading && config.titles.shoppingListHeading) {
        shoppingHeading.textContent = config.titles.shoppingListHeading;
      }

      const pantryHeading = mainElement.querySelector(
        '.shopping-list-section-pantry h3',
      );
      if (pantryHeading && config.titles.pantryHeading) {
        pantryHeading.textContent = config.titles.pantryHeading;
      }
    }
    if (mainElement && config.classes && config.classes.visuallyHidden) {
      ['shopping-qty', 'shopping-unit', 'shopping-new-item'].forEach((id) => {
        const label = mainElement.querySelector(`label[for="${id}"]`);
        if (label) {
          label.classList.add(config.classes.visuallyHidden);
        }
      });
    }
    if (mainElement && config.messages) {
      const shoppingMessages = config.messages.shopping || null;

      if (shoppingMessages) {
        const headerIntro = mainElement.querySelector('.shopping-header p');
        if (headerIntro && shoppingMessages.headerIntro) {
          headerIntro.textContent = shoppingMessages.headerIntro;
        }

        const qtyLabel = mainElement.querySelector('label[for="shopping-qty"]');
        if (qtyLabel && shoppingMessages.qtyLabel) {
          qtyLabel.textContent = shoppingMessages.qtyLabel;
        }

        const unitLabel = mainElement.querySelector(
          'label[for="shopping-unit"]',
        );
        if (unitLabel && shoppingMessages.unitLabel) {
          unitLabel.textContent = shoppingMessages.unitLabel;
        }

        const addItemLabel = mainElement.querySelector(
          'label[for="shopping-new-item"]',
        );
        if (addItemLabel && shoppingMessages.addItemLabel) {
          addItemLabel.textContent = shoppingMessages.addItemLabel;
        }

        const addButton = mainElement.querySelector(
          `#${CSS.escape(config.ids.shoppingAddButton)}`,
        );
        if (addButton && shoppingMessages.addButton) {
          addButton.textContent = shoppingMessages.addButton;
        }

        const shoppingHint = mainElement.querySelector(
          '.shopping-list-section-shopping .shopping-list-hint',
        );
        if (shoppingHint && shoppingMessages.shoppingListHint) {
          shoppingHint.textContent = shoppingMessages.shoppingListHint;
        }

        const pantryHint = mainElement.querySelector(
          '.shopping-list-section-pantry .shopping-list-hint',
        );
        if (pantryHint && shoppingMessages.pantryHint) {
          pantryHint.textContent = shoppingMessages.pantryHint;
        }

        const purchasedButton = mainElement.querySelector(
          `#${CSS.escape(config.ids.shoppingMoveToPantryButton)}`,
        );
        if (purchasedButton && shoppingMessages.purchasedButton) {
          purchasedButton.textContent = shoppingMessages.purchasedButton;
        }

        const buyMoreButton = mainElement.querySelector(
          `#${CSS.escape(config.ids.shoppingBuyMoreButton)}`,
        );
        if (buyMoreButton && shoppingMessages.buyMoreButton) {
          buyMoreButton.textContent = shoppingMessages.buyMoreButton;
        }

        const dontBuyButton = mainElement.querySelector(
          `#${CSS.escape(config.ids.shoppingDontBuyButton)}`,
        );
        if (dontBuyButton && shoppingMessages.dontBuyButton) {
          dontBuyButton.textContent = shoppingMessages.dontBuyButton;
        }

        const usedAndReplenishButton = mainElement.querySelector(
          `#${CSS.escape(config.ids.shoppingMoveToShoppingButton)}`,
        );
        if (usedAndReplenishButton && shoppingMessages.usedAndReplenishButton) {
          usedAndReplenishButton.textContent =
            shoppingMessages.usedAndReplenishButton;
        }

        const usedButton = mainElement.querySelector(
          `#${CSS.escape(config.ids.shoppingDiscardButton)}`,
        );
        if (usedButton && shoppingMessages.usedButton) {
          usedButton.textContent = shoppingMessages.usedButton;
        }
      }
    }
    if (mainElement) {
      const site = window.site instanceof Site ? window.site : null;
      if (site && typeof site.applyConfiguredAttributesInRoot === 'function') {
        site.applyConfiguredAttributesInRoot(mainElement, config);
      }
    }
  }

  // attachShoppingEventListeners: Attaches all shopping and pantry UI handlers.
  attachShoppingEventListeners(config) {
    const mainElement = document.querySelector(`.${config.classes.main}`);
    if (!mainElement) return;

    const input = mainElement.querySelector(
      `#${CSS.escape(config.ids.shoppingNewItemInput)}`,
    );
    const qtyInput = mainElement.querySelector(
      `#${CSS.escape(config.ids.shoppingQtyInput)}`,
    );
    const unitInput = mainElement.querySelector(
      `#${CSS.escape(config.ids.shoppingUnitInput)}`,
    );
    const knownMenu = mainElement.querySelector(
      `#${CSS.escape(config.ids.shoppingKnownMenu)}`,
    );
    const knownToggle = mainElement.querySelector(
      `#${CSS.escape(config.ids.shoppingKnownToggleButton)}`,
    );
    const addButton = mainElement.querySelector(
      `#${CSS.escape(config.ids.shoppingAddButton)}`,
    );
    const shoppingListElement = mainElement.querySelector(
      '.shopping-list-items-shopping',
    );
    const pantryListElement = mainElement.querySelector(
      '.shopping-list-items-pantry',
    );
    const moveToPantryButton = mainElement.querySelector(
      `#${CSS.escape(config.ids.shoppingMoveToPantryButton)}`,
    );
    const buyMoreButton = mainElement.querySelector(
      `#${CSS.escape(config.ids.shoppingBuyMoreButton)}`,
    );
    const dontBuyButton = mainElement.querySelector(
      `#${CSS.escape(config.ids.shoppingDontBuyButton)}`,
    );
    const moveToShoppingButton = mainElement.querySelector(
      `#${CSS.escape(config.ids.shoppingMoveToShoppingButton)}`,
    );
    const discardPantryButton = mainElement.querySelector(
      `#${CSS.escape(config.ids.shoppingDiscardButton)}`,
    );

    const elementAttrs = Site.buildElementAttributes(config);
    if (knownToggle && elementAttrs.shoppingKnownToggle) {
      const site = window.site instanceof Site ? window.site : null;
      const applyAttrs =
        site && typeof site.applyAttributes === 'function'
          ? site.applyAttributes.bind(site)
          : (element, attrs) => {
              if (!element || !attrs) return;
              Object.entries(attrs).forEach(([name, value]) => {
                if (value === false || value == null) {
                  element.removeAttribute(name);
                } else {
                  element.setAttribute(name, String(value));
                }
              });
            };

      applyAttrs(knownToggle, elementAttrs.shoppingKnownToggle);
    }

    if (!shoppingListElement || !pantryListElement) return;

    // Hydrate shopping list and pantry inventory from storage on first attach
    const storage = Storage.getInstance();
    const persistedShopping = storage.loadShoppingList();
    if (
      persistedShopping &&
      Array.isArray(persistedShopping.items) &&
      persistedShopping.items.length > 0
    ) {
      const restored = new ShoppingList(persistedShopping);
      if (!this.shoppingList) {
        this.shoppingList = ShoppingList.getInstance();
      }
      if (!Array.isArray(this.shoppingList.items)) {
        this.shoppingList.items = [];
      }
      this.shoppingList.items.splice(
        0,
        this.shoppingList.items.length,
        ...restored.items,
      );
    }

    const persistedInventory = storage.loadInventory();
    if (
      persistedInventory &&
      Array.isArray(persistedInventory.items) &&
      persistedInventory.items.length > 0
    ) {
      const restoredInventory = new Inventory(persistedInventory);
      if (!this.inventory) {
        this.inventory = Inventory.getInstance();
      }
      if (!Array.isArray(this.inventory.items)) {
        this.inventory.items = [];
      }
      this.inventory.items.splice(
        0,
        this.inventory.items.length,
        ...restoredInventory.items,
      );
    }

    const addItem = () => {
      const rawText = input ? input.value : '';
      const text = (rawText || '').trim();
      if (!text) {
        return;
      }

      const rawQty = qtyInput ? qtyInput.value : '';
      const parsedQty = rawQty === '' ? 1 : Number.parseInt(rawQty, 10);
      const quantity =
        Number.isNaN(parsedQty) || parsedQty <= 0 ? 1 : parsedQty;
      const unit = unitInput ? (unitInput.value || '').trim() : '';

      if (!this.shoppingList) {
        this.shoppingList = ShoppingList.getInstance();
      }

      this.shoppingList.addItem(text, { quantity, unit });

      if (input) {
        input.value = '';
      }
      if (qtyInput) {
        qtyInput.value = '1';
      }
      if (unitInput) {
        unitInput.value = '';
        unitInput.disabled = false;
      }

      this.log('attachShoppingEventListeners', 'info', 'Added shopping item', {
        text,
        quantity,
        unit,
        count: Array.isArray(this.shoppingList.items)
          ? this.shoppingList.items.length
          : 0,
      });
      storage.saveShoppingList(this.shoppingList);
      this.renderShoppingList(shoppingListElement, pantryListElement);
    };

    if (addButton) {
      addButton.addEventListener('click', addItem);
    }

    if (input) {
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          addItem();
        }
      });

      input.addEventListener('input', () => {
        const rawText = input.value || '';
        const key = rawText.trim().toLowerCase();
        const knownUnits =
          (this.knownItemUnits &&
            typeof this.knownItemUnits === 'object' &&
            this.knownItemUnits) ||
          {};
        const matchedUnit = key && knownUnits[key] ? knownUnits[key] : null;

        if (matchedUnit) {
          if (unitInput) {
            unitInput.value = matchedUnit;
            unitInput.disabled = true;
          }
          this.log(
            'attachShoppingEventListeners',
            'info',
            'Locked unit input from known item selection',
            { item: rawText, unit: matchedUnit },
          );
        } else if (unitInput) {
          if (unitInput.disabled) {
            unitInput.disabled = false;
            this.log(
              'attachShoppingEventListeners',
              'info',
              'Unlocked unit input for custom item',
              { item: rawText },
            );
          }
        }
      });
    }

    if (knownToggle && knownMenu) {
      knownToggle.addEventListener('click', () => {
        const isHidden = knownMenu.hasAttribute('hidden');
        if (isHidden) {
          knownMenu.removeAttribute('hidden');
        } else {
          knownMenu.setAttribute('hidden', 'true');
        }
      });

      document.addEventListener('click', (event) => {
        if (!knownMenu || !knownToggle) return;
        const target = event.target;
        if (
          target === knownMenu ||
          knownMenu.contains(target) ||
          target === knownToggle
        ) {
          return;
        }
        if (!knownMenu.hasAttribute('hidden')) {
          knownMenu.setAttribute('hidden', 'true');
        }
      });
    }
    if (moveToPantryButton) {
      moveToPantryButton.addEventListener('click', () => {
        if (!this.shoppingList) {
          this.shoppingList = ShoppingList.getInstance();
        }
        if (!this.inventory) {
          this.inventory = Inventory.getInstance();
        }

        const items = Array.isArray(this.shoppingList.items)
          ? this.shoppingList.items
          : [];
        const selected = items.filter((item) => item.inStock);
        let movedCount = 0;

        selected.forEach((item) => {
          const name = item.text || '';
          if (!name) return;

          const totalQuantity =
            typeof item.quantity === 'number' && item.quantity > 0
              ? item.quantity
              : 0;
          if (totalQuantity <= 0) return;

          const requestedPartial =
            typeof item.partialQuantity === 'number' && item.partialQuantity > 0
              ? item.partialQuantity
              : 0;
          const transferQuantity =
            requestedPartial > totalQuantity ? totalQuantity : requestedPartial;
          if (transferQuantity <= 0) return;

          const unit = item.unit || '';
          const lowered = name.toLowerCase();
          if (!Array.isArray(this.inventory.items)) {
            this.inventory.items = [];
          }
          let entry = this.inventory.items.find(
            (inv) => inv.name && inv.name.toLowerCase() === lowered,
          );
          if (!entry) {
            entry = {
              id: null,
              name,
              inStock: true,
              quantity: transferQuantity,
              unit,
              selected: false,
              partialQuantity: 0,
            };
            this.inventory.items.push(entry);
          } else {
            entry.inStock = true;
            if (typeof entry.quantity === 'number') {
              entry.quantity += transferQuantity;
            } else {
              entry.quantity = transferQuantity;
            }
            if (!entry.unit) {
              entry.unit = unit;
            }
          }

          const remaining = totalQuantity - transferQuantity;
          item.quantity = remaining > 0 ? remaining : 0;
          item.partialQuantity = 0;
          item.inStock = false;
          movedCount += 1;
        });

        this.shoppingList.items = items.filter((item) => {
          const qty =
            typeof item.quantity === 'number' && item.quantity > 0
              ? item.quantity
              : 0;
          return qty > 0;
        });

        this.log(
          'attachShoppingEventListeners',
          'info',
          'Moved selected shopping items to pantry',
          { count: movedCount },
        );
        storage.saveShoppingList(this.shoppingList);
        storage.saveInventory(this.inventory);
        this.renderShoppingList(shoppingListElement, pantryListElement);
      });
    }

    if (buyMoreButton) {
      buyMoreButton.addEventListener('click', () => {
        if (!this.shoppingList) {
          this.shoppingList = ShoppingList.getInstance();
        }

        const items = Array.isArray(this.shoppingList.items)
          ? this.shoppingList.items
          : [];

        let updatedCount = 0;

        items.forEach((item) => {
          if (!item.inStock) return;

          const partial =
            typeof item.partialQuantity === 'number' && item.partialQuantity > 0
              ? item.partialQuantity
              : 0;
          if (partial <= 0) return;

          const baseQuantity =
            typeof item.quantity === 'number' && item.quantity > 0
              ? item.quantity
              : 0;

          const next = baseQuantity + partial;
          item.quantity = next > 0 ? next : 0;
          item.partialQuantity = 0;
          updatedCount += 1;
        });

        this.log(
          'attachShoppingEventListeners',
          'info',
          'Increased shopping quantities via Buy more',
          { count: updatedCount },
        );
        storage.saveShoppingList(this.shoppingList);
        this.renderShoppingList(shoppingListElement, pantryListElement);
      });
    }

    if (dontBuyButton) {
      dontBuyButton.addEventListener('click', () => {
        if (!this.shoppingList) {
          this.shoppingList = ShoppingList.getInstance();
        }

        const items = Array.isArray(this.shoppingList.items)
          ? this.shoppingList.items
          : [];

        let updatedCount = 0;

        items.forEach((item) => {
          if (!item.inStock) return;

          const partial =
            typeof item.partialQuantity === 'number' && item.partialQuantity > 0
              ? item.partialQuantity
              : 0;
          if (partial <= 0) return;

          const baseQuantity =
            typeof item.quantity === 'number' && item.quantity > 0
              ? item.quantity
              : 0;

          const next = baseQuantity - partial;
          item.quantity = next > 0 ? next : 0;
          item.partialQuantity = 0;
          updatedCount += 1;
        });

        this.log(
          'attachShoppingEventListeners',
          'info',
          "Decreased shopping quantities via Don't buy",
          { count: updatedCount },
        );
        storage.saveShoppingList(this.shoppingList);
        this.renderShoppingList(shoppingListElement, pantryListElement);
      });
    }

    if (moveToShoppingButton) {
      moveToShoppingButton.addEventListener('click', () => {
        if (!this.shoppingList) {
          this.shoppingList = ShoppingList.getInstance();
        }
        if (!this.inventory) {
          this.inventory = Inventory.getInstance();
        }

        const pantryItems = Array.isArray(this.inventory.items)
          ? this.inventory.items
          : [];
        let movedCount = 0;

        pantryItems.forEach((entry) => {
          if (!entry.inStock || !entry.selected) return;

          const totalQuantity =
            typeof entry.quantity === 'number' && entry.quantity > 0
              ? entry.quantity
              : 0;
          if (totalQuantity <= 0) return;

          const requestedPartial =
            typeof entry.partialQuantity === 'number' &&
            entry.partialQuantity > 0
              ? entry.partialQuantity
              : 0;
          const transferQuantity =
            requestedPartial > totalQuantity ? totalQuantity : requestedPartial;
          if (transferQuantity <= 0) return;

          const name = entry.name || '';
          if (!name) return;
          const unit = entry.unit || '';

          const shoppingItems = Array.isArray(this.shoppingList.items)
            ? this.shoppingList.items
            : [];
          const existing = shoppingItems.find((item) => {
            return item.text && item.text.toLowerCase() === name.toLowerCase();
          });

          if (existing) {
            const next = (existing.quantity ?? 0) + transferQuantity;
            existing.quantity = next > 0 ? next : 0;
          } else {
            this.shoppingList.addItem(name, {
              quantity: transferQuantity,
              unit,
            });
          }

          const remaining = totalQuantity - transferQuantity;
          entry.quantity = remaining > 0 ? remaining : 0;
          entry.partialQuantity = 0;
          entry.selected = false;
          if (!entry.quantity || entry.quantity <= 0) {
            entry.inStock = false;
          }

          movedCount += 1;
        });

        this.log(
          'attachShoppingEventListeners',
          'info',
          'Moved selected pantry items to shopping list (used and replenish)',
          { count: movedCount },
        );
        storage.saveShoppingList(this.shoppingList);
        storage.saveInventory(this.inventory);
        this.renderShoppingList(shoppingListElement, pantryListElement);
      });
    }

    if (discardPantryButton) {
      discardPantryButton.addEventListener('click', () => {
        if (!this.inventory) {
          this.inventory = Inventory.getInstance();
        }

        const pantryItems = Array.isArray(this.inventory.items)
          ? this.inventory.items
          : [];
        let discardedCount = 0;

        pantryItems.forEach((entry) => {
          if (!entry.inStock || !entry.selected) return;

          const totalQuantity =
            typeof entry.quantity === 'number' && entry.quantity > 0
              ? entry.quantity
              : 0;
          if (totalQuantity <= 0) return;

          const requestedPartial =
            typeof entry.partialQuantity === 'number' &&
            entry.partialQuantity > 0
              ? entry.partialQuantity
              : 0;
          const transferQuantity =
            requestedPartial > totalQuantity ? totalQuantity : requestedPartial;
          if (transferQuantity <= 0) return;

          const remaining = totalQuantity - transferQuantity;
          entry.quantity = remaining > 0 ? remaining : 0;
          entry.partialQuantity = 0;
          entry.selected = false;
          if (!entry.quantity || entry.quantity <= 0) {
            entry.inStock = false;
          }

          discardedCount += 1;
        });

        this.log(
          'attachShoppingEventListeners',
          'info',
          'Marked selected pantry items as used',
          { count: discardedCount },
        );
        storage.saveInventory(this.inventory);
        this.renderShoppingList(shoppingListElement, pantryListElement);
      });
    }

    this.renderShoppingList(shoppingListElement, pantryListElement);
  }

  renderShoppingList(shoppingListElement, pantryListElement) {
    if (!shoppingListElement || !pantryListElement) return;

    const storage = Storage.getInstance();

    const shoppingMessages =
      this.config && this.config.messages
        ? this.config.messages.shopping || null
        : null;
    const removeLabel =
      shoppingMessages && typeof shoppingMessages.removeButtonLabel === 'string'
        ? shoppingMessages.removeButtonLabel
        : null;

    shoppingListElement.innerHTML = '';
    pantryListElement.innerHTML = '';

    const shoppingItems =
      this.shoppingList && Array.isArray(this.shoppingList.items)
        ? this.shoppingList.items
        : [];

    const knownItemsDatalist = document.querySelector(
      `.${this.config.classes.shoppingKnownItems}`,
    );
    const knownMenu = document.querySelector(
      `.${this.config.classes.shoppingKnownMenu}`,
    );
    const knownInput = document.querySelector(
      `.${this.config.classes.shoppingNewItem}`,
    );
    if (knownItemsDatalist || knownMenu) {
      const knownNames = new Set();
      const knownUnits = {};

      if (Array.isArray(sharedIngredients) && sharedIngredients.length > 0) {
        sharedIngredients.forEach((ingredient) => {
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

      if (this.inventory && Array.isArray(this.inventory.items)) {
        this.inventory.items.forEach((entry) => {
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

      this.knownItemUnits = knownUnits;

      if (knownItemsDatalist) {
        knownItemsDatalist.innerHTML = '';
        knownNames.forEach((name) => {
          const option = document.createElement('option');
          option.value = name;
          knownItemsDatalist.appendChild(option);
        });
      }

      if (knownMenu) {
        knownMenu.innerHTML = '';
        knownNames.forEach((name) => {
          const li = document.createElement('li');
          const button = document.createElement('button');
          button.type = 'button';
          button.className = this.config.classes.shoppingKnownMenuItem;
          button.textContent = name;
          button.addEventListener('click', () => {
            if (knownInput) {
              knownInput.value = name;
              knownInput.dispatchEvent(new Event('input', { bubbles: true }));
              knownInput.focus();
            }
            knownMenu.setAttribute('hidden', 'true');
          });
          li.appendChild(button);
          knownMenu.appendChild(li);
        });
      }

      this.log(
        'renderShoppingList',
        'info',
        'Updated known inventory suggestions for shopping add box',
        { count: knownNames.size },
      );
    }

    const getInStockEntry = (name) => {
      if (!this.inventory || !Array.isArray(this.inventory.items)) {
        return null;
      }
      const lowered = String(name || '').toLowerCase();
      const match = this.inventory.items.find(
        (entry) => entry.name && entry.name.toLowerCase() === lowered,
      );
      return match && match.inStock ? match : null;
    };

    const getInStock = (name) => {
      const entry = getInStockEntry(name);
      return entry ? Boolean(entry.inStock) : false;
    };

    const shoppingActionsContainer = shoppingListElement
      .closest('.shopping-list-section-shopping')
      ?.querySelector(`.${this.config.classes.shoppingListActionsShopping}`);

    const hasShoppingItems = shoppingItems.length > 0;
    const hasSelectedShopping = shoppingItems.some(
      (item) =>
        item.inStock &&
        typeof item.partialQuantity === 'number' &&
        item.partialQuantity > 0,
    );

    if (shoppingActionsContainer) {
      if (hasShoppingItems && hasSelectedShopping) {
        shoppingActionsContainer.removeAttribute('hidden');
      } else {
        shoppingActionsContainer.setAttribute('hidden', 'true');
      }
    }

    if (!hasShoppingItems) {
      // Still render pantry list below even if no shopping items.
    }

    shoppingItems.forEach((item) => {
      const inStockInventory = getInStock(item.text);
      const li = document.createElement('li');
      li.className = this.config.classes.shoppingListItem;
      if (inStockInventory) {
        li.classList.add(this.config.classes.shoppingItemInStock);
      }

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = this.config.classes.shoppingListItemCheckbox;
      checkbox.setAttribute('data-name', item.text || '');
      checkbox.checked = !!item.inStock;

      checkbox.addEventListener('change', () => {
        const newSelected = checkbox.checked;
        if (!this.shoppingList) {
          this.shoppingList = ShoppingList.getInstance();
        }
        this.shoppingList.toggleItem(item.id ?? item.text);
        this.log(
          'renderShoppingList',
          'info',
          'Checkbox toggled shopping item selection state',
          { text: item.text, selected: newSelected },
        );
        storage.saveShoppingList(this.shoppingList);
        this.renderShoppingList(shoppingListElement, pantryListElement);
      });

      const textSpan = document.createElement('span');
      textSpan.className = this.config.classes.shoppingListItemText;
      textSpan.textContent = item.text;

      const quantityContainer = document.createElement('div');
      quantityContainer.className =
        this.config.classes.shoppingListItemQuantity;

      const decrementBtn = document.createElement('button');
      decrementBtn.type = 'button';
      decrementBtn.className = this.config.classes.shoppingListItemQtyDec;
      decrementBtn.textContent = '-';

      const quantitySpan = document.createElement('span');
      quantitySpan.className = this.config.classes.shoppingListItemQtyValue;
      const totalQuantity =
        typeof item.quantity === 'number' && item.quantity > 0
          ? item.quantity
          : 0;
      const partialQuantity =
        typeof item.partialQuantity === 'number' && item.partialQuantity > 0
          ? item.partialQuantity
          : 0;
      quantitySpan.textContent = String(partialQuantity);

      const unitSpan = document.createElement('span');
      unitSpan.className = this.config.classes.shoppingListItemQtyUnit;
      unitSpan.textContent = item.unit || '';

      const incrementBtn = document.createElement('button');
      incrementBtn.type = 'button';
      incrementBtn.className = this.config.classes.shoppingListItemQtyInc;
      incrementBtn.textContent = '+';

      decrementBtn.addEventListener('click', () => {
        if (!this.shoppingList) {
          this.shoppingList = ShoppingList.getInstance();
        }
        const current =
          typeof item.partialQuantity === 'number' && item.partialQuantity > 0
            ? item.partialQuantity
            : 0;
        const next = current - 1;
        item.partialQuantity = next > 0 ? next : 0;
        this.log(
          'renderShoppingList',
          'info',
          'Decremented shopping item partial quantity',
          { text: item.text },
        );
        storage.saveShoppingList(this.shoppingList);
        this.renderShoppingList(shoppingListElement, pantryListElement);
      });

      incrementBtn.addEventListener('click', () => {
        if (!this.shoppingList) {
          this.shoppingList = ShoppingList.getInstance();
        }
        const current =
          typeof item.partialQuantity === 'number' && item.partialQuantity > 0
            ? item.partialQuantity
            : 0;
        const next = current + 1;
        const max =
          typeof item.quantity === 'number' && item.quantity > 0
            ? item.quantity
            : 0;
        item.partialQuantity = next > max ? max : next;
        this.log(
          'renderShoppingList',
          'info',
          'Incremented shopping item partial quantity',
          { text: item.text },
        );
        storage.saveShoppingList(this.shoppingList);
        this.renderShoppingList(shoppingListElement, pantryListElement);
      });

      quantityContainer.appendChild(decrementBtn);
      quantityContainer.appendChild(quantitySpan);
      quantityContainer.appendChild(incrementBtn);
      quantityContainer.appendChild(unitSpan);

      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = this.config.classes.shoppingListItemRemove;
      removeButton.textContent = removeLabel || '';

      removeButton.addEventListener('click', () => {
        if (!this.shoppingList) {
          this.shoppingList = ShoppingList.getInstance();
        }
        this.shoppingList.removeItem(item.id ?? item.text);
        this.log('renderShoppingList', 'info', 'Removed shopping list item', {
          text: item.text,
        });
        storage.saveShoppingList(this.shoppingList);
        this.renderShoppingList(shoppingListElement, pantryListElement);
      });

      const totalSpan = document.createElement('span');
      totalSpan.className = this.config.classes.shoppingListItemTotal;
      totalSpan.textContent = `${totalQuantity} ${item.unit || ''} ${
        item.text || ''
      }`.trim();

      li.appendChild(checkbox);
      li.appendChild(quantityContainer);
      li.appendChild(totalSpan);
      li.appendChild(removeButton);
      shoppingListElement.appendChild(li);
    });

    const pantryItems =
      this.inventory && Array.isArray(this.inventory.items)
        ? this.inventory.items.filter(
            (entry) =>
              entry.inStock &&
              typeof entry.quantity === 'number' &&
              entry.quantity > 0,
          )
        : [];

    const pantryActionsContainer = pantryListElement
      .closest('.shopping-list-section-pantry')
      ?.querySelector(`.${this.config.classes.shoppingListActionsPantry}`);

    const hasPantryItems = pantryItems.length > 0;
    const hasPantrySelection = pantryItems.some(
      (entry) =>
        entry.selected &&
        typeof entry.partialQuantity === 'number' &&
        entry.partialQuantity > 0,
    );

    if (pantryActionsContainer) {
      if (hasPantryItems && hasPantrySelection) {
        pantryActionsContainer.removeAttribute('hidden');
      } else {
        pantryActionsContainer.setAttribute('hidden', 'true');
      }
    }

    pantryItems.forEach((entry) => {
      const li = document.createElement('li');
      li.className = this.config.classes.shoppingListItem;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = this.config.classes.shoppingListItemCheckbox;
      checkbox.setAttribute('data-name', entry.name || '');
      checkbox.checked = Boolean(entry.selected);

      checkbox.addEventListener('change', () => {
        if (!this.inventory) {
          this.inventory = Inventory.getInstance();
        }
        entry.selected = checkbox.checked;
        this.log('renderShoppingList', 'info', 'Toggled pantry selection', {
          name: entry.name,
          selected: entry.selected,
        });
        storage.saveInventory(this.inventory);
        this.renderShoppingList(shoppingListElement, pantryListElement);
      });

      const textSpan = document.createElement('span');
      textSpan.className = this.config.classes.shoppingListItemText;
      textSpan.textContent = entry.name || '';

      const quantityContainer = document.createElement('div');
      quantityContainer.className =
        this.config.classes.shoppingListItemQuantity;

      const decrementBtn = document.createElement('button');
      decrementBtn.type = 'button';
      decrementBtn.className = this.config.classes.shoppingListItemQtyDec;
      decrementBtn.textContent = '-';

      const quantitySpan = document.createElement('span');
      quantitySpan.className = this.config.classes.shoppingListItemQtyValue;
      const pantryTotal =
        typeof entry.quantity === 'number' && entry.quantity > 0
          ? entry.quantity
          : 0;
      const pantryPartial =
        typeof entry.partialQuantity === 'number' && entry.partialQuantity > 0
          ? entry.partialQuantity
          : 0;
      quantitySpan.textContent = String(pantryPartial);

      const unitSpan = document.createElement('span');
      unitSpan.className = this.config.classes.shoppingListItemQtyUnit;
      unitSpan.textContent = entry.unit || '';

      const incrementBtn = document.createElement('button');
      incrementBtn.type = 'button';
      incrementBtn.className = this.config.classes.shoppingListItemQtyInc;
      incrementBtn.textContent = '+';

      decrementBtn.addEventListener('click', () => {
        if (!this.inventory) {
          this.inventory = Inventory.getInstance();
        }
        const target = getInStockEntry(entry.name);
        if (!target) return;
        const current =
          typeof target.partialQuantity === 'number' &&
          target.partialQuantity > 0
            ? target.partialQuantity
            : 0;
        const next = current - 1;
        target.partialQuantity = next > 0 ? next : 0;
        this.log('renderShoppingList', 'info', 'Decremented pantry partial', {
          name: entry.name,
        });
        storage.saveInventory(this.inventory);
        this.renderShoppingList(shoppingListElement, pantryListElement);
      });

      incrementBtn.addEventListener('click', () => {
        if (!this.inventory) {
          this.inventory = Inventory.getInstance();
        }
        const target = getInStockEntry(entry.name);
        if (!target) return;
        const current =
          typeof target.partialQuantity === 'number' &&
          target.partialQuantity > 0
            ? target.partialQuantity
            : 0;
        const max =
          typeof target.quantity === 'number' && target.quantity > 0
            ? target.quantity
            : 0;
        const next = current + 1;
        target.partialQuantity = next > max ? max : next;
        this.log('renderShoppingList', 'info', 'Incremented pantry partial', {
          name: entry.name,
        });
        storage.saveInventory(this.inventory);
        this.renderShoppingList(shoppingListElement, pantryListElement);
      });

      quantityContainer.appendChild(decrementBtn);
      quantityContainer.appendChild(quantitySpan);
      quantityContainer.appendChild(incrementBtn);
      quantityContainer.appendChild(unitSpan);

      const totalSpan = document.createElement('span');
      totalSpan.className = this.config.classes.shoppingListItemTotal;
      totalSpan.textContent = `${pantryTotal} ${entry.unit || ''} ${
        entry.name || ''
      }`.trim();

      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = this.config.classes.shoppingListItemRemove;
      removeButton.textContent = removeLabel || '';

      removeButton.addEventListener('click', () => {
        if (!this.inventory) {
          this.inventory = Inventory.getInstance();
        }
        const target = getInStockEntry(entry.name);
        if (target) {
          target.quantity = 0;
          target.inStock = false;
        }
        this.log('renderShoppingList', 'info', 'Removed pantry item', {
          name: entry.name,
        });
        storage.saveInventory(this.inventory);
        this.renderShoppingList(shoppingListElement, pantryListElement);
      });

      li.appendChild(checkbox);
      li.appendChild(quantityContainer);
      li.appendChild(totalSpan);
      li.appendChild(removeButton);
      pantryListElement.appendChild(li);
    });
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'ShoppingPage');

Logger.instrumentClass(ShoppingPage, 'ShoppingPage');

export { ShoppingPage };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
