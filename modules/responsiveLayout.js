// Responsive Layout Module
// Purpose: To manage the layout and content of different pages.

import { bootLogger } from './bootLogger.js';

import { Logger } from './logger.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(
  import.meta.url,
  'Defines page classes (Home/Recipes/MealPlan/Shopping/More)',
);

class HomePage {
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
    };
  }

  constructor(config = null, options = {}) {
    Object.defineProperties(this, HomePage.descriptors);
    this.logger = options.logger || null;
    this.log(
      'constructor',
      'objectCreateStart',
      'HomePage.constructor: Starting',
    );
    this.config = config;
    this.log(
      'constructor',
      'objectCreateComplete',
      'HomePage.constructor: Completed',
    );
    this.log('constructor', 'info', 'HomePage.constructor: HomePage created');
  }

  log(methodName, level, ...args) {
    if (!this.logger) return;

    if (this.logger.isSignatureLevel(level)) {
      if (typeof methodName === 'string') {
        if (level.startsWith('passthrough')) {
          return this.logger.passthroughMethod('HomePage', methodName, ...args);
        }
        this.logger.classMethodLog(level, 'HomePage', methodName, ...args);
      } else if (typeof methodName === 'object' && methodName !== null) {
        if (level.startsWith('function')) {
          this.logger.functionLog(level, ...args);
        } else {
          this.logger.classLog(level, ...args);
        }
      }
    } else {
      this.logger.classMethodLog(level, 'HomePage', methodName, ...args);
    }
  }

  init(config) {
    this.log('init', 'objectInitStart', 'HomePage.init: Starting');
    this.config = config;
    const template = document.getElementById(config.homePageTemplateId);
    if (!template) {
      const errorResult = { title: config.errorPageTitle, content: '' };
      this.log(
        'init',
        'info',
        'HomePage.init: No home template found, returning error page',
      );
      return this.log('init', 'passthroughMethodComplete', errorResult, {
        toLogValue: (page) => ({
          title: page.title,
          hasContent: !!page.content,
        }),
      });
    }
    this.initialized = true;
    this.log('init', 'objectInitComplete', 'HomePage.init: Completed');
    this.log('init', 'info', 'HomePage.init: HomePage initialized');
    const result = {
      title: config.homePageTitle,
      content: template.innerHTML,
    };
    return this.log('init', 'passthroughMethodComplete', result, {
      toLogValue: (page) => ({ title: page.title, hasContent: !!page.content }),
    });
  }

  afterRender(config) {
    this.log(
      'afterRender',
      'lifecycle',
      'homePage.afterRender: Starting afterRender lifecycle hook',
    );
    this.loadRecipeCards(config);
    this.addHomePageEventListeners(config);
    this.ensureBottomShoppingListButtonPosition(config);
  }

  ensureBottomShoppingListButtonPosition(config) {
    const mainElement = document.querySelector(`.${config.mainClassName}`);
    if (!mainElement) return;

    const recipeCards = mainElement.querySelector(config.recipeCardsSelector);
    const bottomButton = mainElement.querySelector('#shopping-list-btn-bottom');
    if (!recipeCards || !bottomButton) return;

    if (recipeCards.nextElementSibling !== bottomButton) {
      recipeCards.insertAdjacentElement('afterend', bottomButton);
    }
  }

  addHomePageEventListeners(config) {
    const mainElement = document.querySelector(`.${config.mainClassName}`);
    if (!mainElement) return;

    const searchInput = mainElement.querySelector(config.searchBarSelector);
    const searchButton = mainElement.querySelector(config.searchButtonSelector);

    const triggerSearch = () => {
      const searchTerm = searchInput.value.toLowerCase();
      this.loadRecipeCards(config, searchTerm);
    };

    if (searchButton) {
      searchButton.addEventListener('click', triggerSearch);
    }

    if (searchInput) {
      searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          triggerSearch();
        }
      });
    }

    const mealPlanButton = mainElement.querySelector(
      config.mealPlanButtonSelector,
    );
    if (mealPlanButton) {
      mealPlanButton.addEventListener('click', () => {
        document
          .querySelector(`${config.menuItemSelector}[href="#mealplan"]`)
          .click();
      });
    }

    // Note: The shopping list button might have multiple instances now,
    // so we query all and add listeners to each.
    const shoppingListButtons = mainElement.querySelectorAll(
      '.shopping-list-btn, .shopping-list-btn-desktop, .shopping-list-btn-mobile',
    );
    if (shoppingListButtons) {
      shoppingListButtons.forEach((button) => {
        button.addEventListener('click', () => {
          document
            .querySelector(`${config.menuItemSelector}[href="#shopping"]`)
            .click();
        });
      });
    }
  }

  async loadRecipeCards(config, searchTerm = '') {
    this.log(
      'loadRecipeCards',
      'lifecycle',
      'homePage.loadRecipeCards: Starting...',
    );
    const recipeCardContainer = document.querySelector(
      config.recipeCardsSelector,
    );
    const contentWrapper = recipeCardContainer
      ? recipeCardContainer.closest(config.mainContentWrapperSelector)
      : null;
    const template = contentWrapper
      ? contentWrapper.querySelector(
          `#${CSS.escape(config.recipeCardTemplateId)}`,
        )
      : null;

    this.log(
      'loadRecipeCards',
      'lifecycle',
      'homePage.loadRecipeCards: recipeCardContainer found:',
      !!recipeCardContainer,
    );
    this.log(
      'loadRecipeCards',
      'lifecycle',
      'homePage.loadRecipeCards: template found:',
      !!template,
    );

    if (!recipeCardContainer || !template) {
      return;
    }

    recipeCardContainer.innerHTML = ''; // Clear existing cards

    try {
      const response = await fetch(config.mockDataPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let recipes = await response.json();

      if (searchTerm) {
        recipes = recipes.filter(
          (recipe) =>
            recipe.title.toLowerCase().includes(searchTerm) ||
            recipe.description.toLowerCase().includes(searchTerm),
        );
      }

      if (recipes.length === 0) {
        recipeCardContainer.innerHTML = config.noRecipesFoundMessage;
        return;
      }

      this.log(
        'loadRecipeCards',
        'info',
        'homePage.loadRecipeCards: Rendering recipe cards:',
        recipes.length,
      );

      recipes.forEach((recipe) => {
        const cardWrapper = document.createElement('div');
        cardWrapper.className = config.recipeCardClassName;

        const cardClone = template.content.cloneNode(true);
        const img = cardClone.querySelector(config.recipeCardImageSelector);
        const title = cardClone.querySelector(config.recipeCardTitleSelector);
        const description = cardClone.querySelector(
          config.recipeCardDescriptionSelector,
        );

        if (img) {
          img.src = recipe.image;
          img.alt = recipe.title;
        }
        if (title) {
          title.textContent = recipe.title;
        }
        if (description) {
          description.textContent = recipe.description;
        }
        cardWrapper.appendChild(cardClone);
        recipeCardContainer.appendChild(cardWrapper);
      });
    } catch (error) {
      console.error('Error loading recipe cards:', error);
      recipeCardContainer.innerHTML =
        '<p>Could not load recipes. Please try again later.</p>';
    }
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'HomePage');

class RecipesPage {
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
    };
  }

  constructor(config = null, options = {}) {
    Object.defineProperties(this, RecipesPage.descriptors);
    this.logger = options.logger || null;
    this.log(
      'constructor',
      'objectCreateStart',
      'RecipesPage.constructor: Starting',
    );
    this.config = config;
    this.log(
      'constructor',
      'objectCreateComplete',
      'RecipesPage.constructor: Completed',
    );
    this.log(
      'constructor',
      'info',
      'RecipesPage.constructor: RecipesPage created',
    );
  }

  log(methodName, level, ...args) {
    if (!this.logger) return;

    if (this.logger.isSignatureLevel(level)) {
      if (typeof methodName === 'string') {
        if (level.startsWith('passthrough')) {
          return this.logger.passthroughMethod(
            'RecipesPage',
            methodName,
            ...args,
          );
        }
        this.logger.classMethodLog(level, 'RecipesPage', methodName, ...args);
      } else if (typeof methodName === 'object' && methodName !== null) {
        if (level.startsWith('function')) {
          this.logger.functionLog(level, ...args);
        } else {
          this.logger.classLog(level, ...args);
        }
      }
    } else {
      this.logger.classMethodLog(level, 'RecipesPage', methodName, ...args);
    }
  }

  init(config) {
    this.log('init', 'objectInitStart', 'RecipesPage.init: Starting');
    this.config = config;
    const template = document.getElementById(config.recipesPageTemplateId);
    if (!template) {
      const errorResult = { title: config.errorPageTitle, content: '' };
      this.log(
        'init',
        'info',
        'RecipesPage.init: No recipes template found, returning error page',
      );
      return this.log('init', 'passthroughMethodComplete', errorResult, {
        toLogValue: (page) => ({
          title: page.title,
          hasContent: !!page.content,
        }),
      });
    }
    this.initialized = true;
    this.log('init', 'objectInitComplete', 'RecipesPage.init: Completed');
    this.log('init', 'info', 'RecipesPage.init: RecipesPage initialized');
    const result = {
      title: config.recipesPageTitle,
      content: template.innerHTML,
    };
    return this.log('init', 'passthroughMethodComplete', result, {
      toLogValue: (page) => ({ title: page.title, hasContent: !!page.content }),
    });
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'RecipesPage');

class MealPlanPage {
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
    };
  }

  constructor(config = null, options = {}) {
    Object.defineProperties(this, MealPlanPage.descriptors);
    this.logger = options.logger || null;
    this.log(
      'constructor',
      'objectCreateStart',
      'MealPlanPage.constructor: Starting',
    );
    this.config = config;
    this.log(
      'constructor',
      'objectCreateComplete',
      'MealPlanPage.constructor: Completed',
    );
    this.log(
      'constructor',
      'info',
      'MealPlanPage.constructor: MealPlanPage created',
    );
  }

  log(methodName, level, ...args) {
    if (!this.logger) return;

    if (this.logger.isSignatureLevel(level)) {
      if (typeof methodName === 'string') {
        if (level.startsWith('passthrough')) {
          return this.logger.passthroughMethod(
            'MealPlanPage',
            methodName,
            ...args,
          );
        }
        this.logger.classMethodLog(level, 'MealPlanPage', methodName, ...args);
      } else if (typeof methodName === 'object' && methodName !== null) {
        if (level.startsWith('function')) {
          this.logger.functionLog(level, ...args);
        } else {
          this.logger.classLog(level, ...args);
        }
      }
    } else {
      this.logger.classMethodLog(level, 'MealPlanPage', methodName, ...args);
    }
  }

  init(config) {
    this.log('init', 'objectInitStart', 'MealPlanPage.init: Starting');
    this.config = config;
    const template = document.getElementById(config.mealPlanPageTemplateId);
    if (!template) {
      const errorResult = { title: config.errorPageTitle, content: '' };
      this.log(
        'init',
        'info',
        'MealPlanPage.init: No meal plan template found, returning error page',
      );
      return this.log('init', 'passthroughMethodComplete', errorResult, {
        toLogValue: (page) => ({
          title: page.title,
          hasContent: !!page.content,
        }),
      });
    }
    this.initialized = true;
    this.log('init', 'objectInitComplete', 'MealPlanPage.init: Completed');
    this.log('init', 'info', 'MealPlanPage.init: MealPlanPage initialized');
    const result = {
      title: config.mealPlanPageTitle,
      content: template.innerHTML,
    };
    return this.log('init', 'passthroughMethodComplete', result, {
      toLogValue: (page) => ({ title: page.title, hasContent: !!page.content }),
    });
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'MealPlanPage');

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
    };
  }

  constructor(config = null, options = {}) {
    Object.defineProperties(this, ShoppingPage.descriptors);
    this.logger = options.logger || null;
    this.log(
      'constructor',
      'objectCreateStart',
      'ShoppingPage.constructor: Starting',
    );
    this.config = config;
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
  }

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

  init(config) {
    this.log('init', 'objectInitStart', 'ShoppingPage.init: Starting');
    this.config = config;
    const template = document.getElementById(config.shoppingPageTemplateId);
    if (!template) {
      const errorResult = { title: config.errorPageTitle, content: '' };
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
    this.initialized = true;
    this.log('init', 'objectInitComplete', 'ShoppingPage.init: Completed');
    this.log('init', 'info', 'ShoppingPage.init: ShoppingPage initialized');
    const result = {
      title: config.shoppingPageTitle,
      content: template.innerHTML,
    };
    return this.log('init', 'passthroughMethodComplete', result, {
      toLogValue: (page) => ({ title: page.title, hasContent: !!page.content }),
    });
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'ShoppingPage');

class MorePage {
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
    };
  }

  constructor(config = null, options = {}) {
    Object.defineProperties(this, MorePage.descriptors);
    this.logger = options.logger || null;
    this.log(
      'constructor',
      'objectCreateStart',
      'MorePage.constructor: Starting',
    );
    this.config = config;
    this.log(
      'constructor',
      'objectCreateComplete',
      'MorePage.constructor: Completed',
    );
    this.log('constructor', 'info', 'MorePage.constructor: MorePage created');
  }

  log(methodName, level, ...args) {
    if (!this.logger) return;

    if (this.logger.isSignatureLevel(level)) {
      if (typeof methodName === 'string') {
        if (level.startsWith('passthrough')) {
          return this.logger.passthroughMethod('MorePage', methodName, ...args);
        }
        this.logger.classMethodLog(level, 'MorePage', methodName, ...args);
      } else if (typeof methodName === 'object' && methodName !== null) {
        if (level.startsWith('function')) {
          this.logger.functionLog(level, ...args);
        } else {
          this.logger.classLog(level, ...args);
        }
      }
    } else {
      this.logger.classMethodLog(level, 'MorePage', methodName, ...args);
    }
  }

  init(config) {
    this.log('init', 'objectInitStart', 'MorePage.init: Starting');
    this.config = config;
    const template = document.getElementById(config.morePageTemplateId);
    if (!template) {
      const errorResult = { title: config.errorPageTitle, content: '' };
      this.log(
        'init',
        'info',
        'MorePage.init: No more-page template found, returning error page',
      );
      return this.log('init', 'passthroughMethodComplete', errorResult, {
        toLogValue: (page) => ({
          title: page.title,
          hasContent: !!page.content,
        }),
      });
    }
    this.initialized = true;
    this.log('init', 'objectInitComplete', 'MorePage.init: Completed');
    this.log('init', 'info', 'MorePage.init: MorePage initialized');
    const result = {
      title: config.morePageTitle,
      content: template.innerHTML,
    };
    return this.log('init', 'passthroughMethodComplete', result, {
      toLogValue: (page) => ({ title: page.title, hasContent: !!page.content }),
    });
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'MorePage');

Logger.instrumentClass(HomePage, 'HomePage');
Logger.instrumentClass(RecipesPage, 'RecipesPage');
Logger.instrumentClass(MealPlanPage, 'MealPlanPage');
Logger.instrumentClass(ShoppingPage, 'ShoppingPage');
Logger.instrumentClass(MorePage, 'MorePage');

export { HomePage, MealPlanPage, MorePage, RecipesPage, ShoppingPage };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
