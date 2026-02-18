import { bootLogger } from '../models/bootLogger.js';

import { Logger } from '../models/logger.js';
import { Site } from './site.js';
import { Main } from './main.js';
import { Recipes } from '../models/recipes.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(import.meta.url, 'Defines HomePage');

// Home page controller: renders the landing view, wires search,
// and loads recipe cards.
// Usage: const page = new HomePage(config, { logger }); page.init(config);
class HomePage {
  // constructor: Creates the HomePage controller and optionally initializes.
  constructor(config = null, options = {}) {
    Object.defineProperties(this, HomePage.descriptors);
    this.logger = options.logger || null;
    this.log(
      'constructor',
      'objectCreateStart',
      'HomePage.constructor: Starting',
    );
    this.config = config;
    this.profile = options.profile || null;
    this.recipeApi = options.recipeApi || null;
    this.log(
      'constructor',
      'objectCreateComplete',
      'HomePage.constructor: Completed',
    );
    this.log('constructor', 'info', 'HomePage.constructor: HomePage created');
    // Immediately initialize after construction
    if (config) {
      this.init(config);
    }
  }

  // init: Builds the initial Home page view model from the template.
  init(config) {
    this.log('init', 'methodStart', 'HomePage.init: Starting', {
      hasConfig: !!config,
      alreadyInitialized: !!this.initialized,
    });

    if (this.initialized && this.view) {
      // State: Reuse existing HomePage view model when already initialized.
      return this.log('init', 'passthroughMethodComplete', this.view, {
        toLogValue: (page) => ({
          title: page.title,
          hasContent: !!page.content,
        }),
      });
    }

    this.log('init', 'objectInitStart', 'HomePage.init: Starting');
    // State: Capture the latest HomePage configuration on the instance.
    this.config = config;
    const template = document.getElementById(config.ids.templates.homePage);
    if (!template) {
      const errorResult = { title: config.titles.errorPage, content: '' };
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
    // State: Mark HomePage as initialized.
    this.initialized = true;
    this.log('init', 'objectInitComplete', 'HomePage.init: Completed');
    this.log('init', 'info', 'HomePage.init: HomePage initialized');
    const result = {
      title: config.titles.homePage,
      content: template.innerHTML,
    };
    // State: Cache the rendered HomePage view model.
    this.view = result;
    return this.log('init', 'passthroughMethodComplete', this.view, {
      toLogValue: (page) => ({ title: page.title, hasContent: !!page.content }),
    });
  }

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
      profile: {
        value: null,
        writable: true,
        enumerable: false,
        configurable: false,
      },
    };
  }
  // addHomePageEventListeners: Attaches search, navigation, and CTA handlers.
  addHomePageEventListeners(config) {
    this.log(
      'addHomePageEventListeners',
      'methodStart',
      'HomePage.addHomePageEventListeners: Starting',
    );

    if (!config || !config.classes || !config.classes.main) {
      return this.log(
        'addHomePageEventListeners',
        'passthroughMethodComplete',
        undefined,
        {
          canLogReturnValue: false,
          message:
            'HomePage.addHomePageEventListeners: Skipped - missing main class config',
        },
      );
    }

    const mainElement = document.querySelector(`.${config.classes.main}`);
    if (!mainElement) {
      return this.log(
        'addHomePageEventListeners',
        'passthroughMethodComplete',
        undefined,
        {
          canLogReturnValue: false,
          message:
            'HomePage.addHomePageEventListeners: Skipped - main element not found',
        },
      );
    }

    const searchInput = mainElement.querySelector(
      `#${CSS.escape(config.ids.homeSearchInput)}`,
    );
    const searchButton = mainElement.querySelector(
      `#${CSS.escape(config.ids.homeSearchButton)}`,
    );

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
          event.preventDefault();
          triggerSearch();
        }
      });
    }

    const mealPlanButton = mainElement.querySelector(
      `#${CSS.escape(config.ids.homeMealPlanSummaryButton)}`,
    );
    if (mealPlanButton) {
      mealPlanButton.addEventListener('click', () => {
        document
          .querySelector(`.${config.classes.menuItemLink}[href="#mealplan"]`)
          .click();
      });
    }

    const shoppingListButtons = [
      mainElement.querySelector(
        `#${CSS.escape(config.ids.shoppingListButtonTop)}`,
      ),
      mainElement.querySelector(
        `#${CSS.escape(config.ids.shoppingListButtonBottom)}`,
      ),
    ].filter(Boolean);

    if (shoppingListButtons.length) {
      shoppingListButtons.forEach((button) => {
        button.addEventListener('click', () => {
          document
            .querySelector(`.${config.classes.menuItemLink}[href="#shopping"]`)
            .click();
        });
      });
    }

    this.log(
      'addHomePageEventListeners',
      'info',
      'State change: Attached HomePage event listeners',
      {
        hasSearchInput: !!searchInput,
        hasSearchButton: !!searchButton,
        hasMealPlanButton: !!mealPlanButton,
        shoppingListButtonCount: shoppingListButtons.length,
      },
    );

    return this.log(
      'addHomePageEventListeners',
      'passthroughMethodComplete',
      undefined,
      {
        canLogReturnValue: false,
        message: 'HomePage.addHomePageEventListeners: Completed',
      },
    );
  }

  // afterRender: Wires Home page event handlers after content render.
  afterRender(config) {
    this.log(
      'afterRender',
      'lifecycle',
      'homePage.afterRender: Starting afterRender lifecycle hook',
    );
    const mainElement = document.querySelector(`.${config.classes.main}`);
    if (mainElement) {
      this.applyHomeClasses(config, mainElement);
    }

    this.loadRecipeCards(config);
    this.addHomePageEventListeners(config);
    this.ensureBottomShoppingListButtonPosition(config);
    if (mainElement && config.classes && config.classes.visuallyHidden) {
      const searchLabel = mainElement.querySelector(
        'label[for="home-search-input"]',
      );
      if (searchLabel) {
        searchLabel.classList.add(config.classes.visuallyHidden);
      }
    }
    if (mainElement && config.messages) {
      const homeMessages = config.messages.home || null;
      const sharedMessages = config.messages.shared || null;
      const controlsMessages = config.messages.controls || null;

      if (homeMessages) {
        const searchLabel = mainElement.querySelector(
          'label[for="home-search-input"]',
        );
        if (searchLabel && homeMessages.searchLabel) {
          searchLabel.textContent = homeMessages.searchLabel;
        }

        const searchButton = mainElement.querySelector(
          `#${CSS.escape(config.ids.homeSearchButton)}`,
        );
        const searchLabelText =
          controlsMessages && typeof controlsMessages.searchButton === 'string'
            ? controlsMessages.searchButton
            : '';
        if (searchButton) {
          searchButton.textContent = searchLabelText;
        }

        const mealPlanButton = mainElement.querySelector(
          `#${CSS.escape(config.ids.homeMealPlanSummaryButton)}`,
        );
        if (mealPlanButton && homeMessages.mealPlanSummaryButton) {
          mealPlanButton.textContent = homeMessages.mealPlanSummaryButton;
        }

        const shoppingButtons = [
          mainElement.querySelector(
            `#${CSS.escape(config.ids.shoppingListButtonTop)}`,
          ),
          mainElement.querySelector(
            `#${CSS.escape(config.ids.shoppingListButtonBottom)}`,
          ),
        ].filter(Boolean);

        if (shoppingButtons.length && homeMessages.shoppingListButton) {
          shoppingButtons.forEach((button) => {
            button.textContent = homeMessages.shoppingListButton;
          });
        }
      }

      if (sharedMessages && config.ids && config.ids.templates) {
        const detailTemplateId = config.ids.templates.recipeDetail;
        const ingredientTemplateId = config.ids.templates.ingredientDetail;
        const nutritionTemplateId = config.ids.templates.nutritionDetail;

        if (detailTemplateId) {
          const detailTemplate = mainElement.querySelector(
            `#${CSS.escape(detailTemplateId)}`,
          );
          const detailRoot =
            detailTemplate && detailTemplate.content
              ? detailTemplate.content
              : null;
          if (detailRoot) {
            const ingredientsHeading = detailRoot.querySelector(
              '.recipe-detail-ingredients h4',
            );
            if (
              ingredientsHeading &&
              sharedMessages.recipeDetailIngredientsHeading
            ) {
              ingredientsHeading.textContent =
                sharedMessages.recipeDetailIngredientsHeading;
            }

            const ingredientsHint = detailRoot.querySelector(
              '.recipe-detail-ingredients-hint',
            );
            if (ingredientsHint && sharedMessages.recipeDetailIngredientsHint) {
              ingredientsHint.textContent =
                sharedMessages.recipeDetailIngredientsHint;
            }

            const instructionsHeading = detailRoot.querySelector(
              '.recipe-detail-instructions h4',
            );
            if (
              instructionsHeading &&
              sharedMessages.recipeDetailInstructionsHeading
            ) {
              instructionsHeading.textContent =
                sharedMessages.recipeDetailInstructionsHeading;
            }

            const nutritionButton = detailRoot.querySelector(
              '.recipe-detail-nutrition-button',
            );
            if (nutritionButton && sharedMessages.recipeDetailNutritionButton) {
              nutritionButton.textContent =
                sharedMessages.recipeDetailNutritionButton;
            }
          }
        }

        if (ingredientTemplateId) {
          const ingredientTemplate = mainElement.querySelector(
            `#${CSS.escape(ingredientTemplateId)}`,
          );
          const ingredientRoot =
            ingredientTemplate && ingredientTemplate.content
              ? ingredientTemplate.content
              : null;
          if (ingredientRoot && sharedMessages.ingredientDetailTitle) {
            const title = ingredientRoot.querySelector(
              '.ingredient-detail-title',
            );
            if (title) {
              title.textContent = sharedMessages.ingredientDetailTitle;
            }
          }
        }

        if (nutritionTemplateId) {
          const nutritionTemplate = mainElement.querySelector(
            `#${CSS.escape(nutritionTemplateId)}`,
          );
          const nutritionRoot =
            nutritionTemplate && nutritionTemplate.content
              ? nutritionTemplate.content
              : null;
          if (nutritionRoot && sharedMessages.nutritionDetailTitle) {
            const title = nutritionRoot.querySelector(
              '.nutrition-detail-title',
            );
            if (title) {
              title.textContent = sharedMessages.nutritionDetailTitle;
            }
          }
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

  applyHomeClasses(config, rootElement) {
    this.log(
      'applyHomeClasses',
      'methodStart',
      'HomePage.applyHomeClasses: Starting',
      {
        hasConfig: !!config,
        hasClasses: !!(config && config.classes),
        hasIds: !!(config && config.ids),
        hasRootElement: !!rootElement,
      },
    );

    if (!config || !config.classes || !config.ids || !rootElement) {
      return this.log(
        'applyHomeClasses',
        'passthroughMethodComplete',
        undefined,
        {
          canLogReturnValue: false,
          message:
            'HomePage.applyHomeClasses: Skipped - missing config, ids, classes, or rootElement',
        },
      );
    }

    const { classes, ids } = config;

    const mappings = [
      [ids.homeSearchBar, classes.homeSearchBar],
      [ids.homeActions, classes.homeActions],
      [ids.homeSearchInput, classes.searchInput],
      [ids.homeSearchButton, classes.searchButton],
      [ids.homeMealPlanSummaryButton, classes.mealPlanButton],
      [ids.shoppingListButtonTop, classes.shoppingListButton],
      [ids.shoppingListButtonBottom, classes.shoppingListButton],
      [ids.homeRecipeCardsContainer, classes.recipeCards],
    ];

    let appliedCount = 0;

    mappings.forEach(([idValue, className]) => {
      if (!idValue || !className) return;
      const element = rootElement.querySelector(`#${CSS.escape(idValue)}`);
      if (element && !element.classList.contains(className)) {
        element.classList.add(className);
        appliedCount += 1;
      }
    });

    this.log(
      'applyHomeClasses',
      'info',
      'State change: Applied home classes to elements',
      {
        appliedCount,
      },
    );

    return this.log(
      'applyHomeClasses',
      'passthroughMethodComplete',
      undefined,
      {
        canLogReturnValue: false,
        message: 'HomePage.applyHomeClasses: Completed',
      },
    );
  }

  // ensureBottomShoppingListButtonPosition: Keeps bottom shopping button under cards.
  ensureBottomShoppingListButtonPosition(config) {
    this.log(
      'ensureBottomShoppingListButtonPosition',
      'methodStart',
      'HomePage.ensureBottomShoppingListButtonPosition: Starting',
    );

    if (!config || !config.classes || !config.classes.main) {
      return this.log(
        'ensureBottomShoppingListButtonPosition',
        'passthroughMethodComplete',
        undefined,
        {
          canLogReturnValue: false,
          message:
            'HomePage.ensureBottomShoppingListButtonPosition: Skipped - missing main class config',
        },
      );
    }

    const mainElement = document.querySelector(`.${config.classes.main}`);
    if (!mainElement) {
      return this.log(
        'ensureBottomShoppingListButtonPosition',
        'passthroughMethodComplete',
        undefined,
        {
          canLogReturnValue: false,
          message:
            'HomePage.ensureBottomShoppingListButtonPosition: Skipped - main element not found',
        },
      );
    }

    const recipeCards = mainElement.querySelector(
      `.${config.classes.recipeCards}`,
    );
    const bottomButton = mainElement.querySelector(
      '#shopping-list-button-bottom',
    );
    if (!recipeCards || !bottomButton) {
      return this.log(
        'ensureBottomShoppingListButtonPosition',
        'passthroughMethodComplete',
        undefined,
        {
          canLogReturnValue: false,
          message:
            'HomePage.ensureBottomShoppingListButtonPosition: Skipped - recipe cards or bottom button not found',
        },
      );
    }

    if (recipeCards.nextElementSibling !== bottomButton) {
      recipeCards.insertAdjacentElement('afterend', bottomButton);
      this.log(
        'ensureBottomShoppingListButtonPosition',
        'info',
        'State change: Moved bottom shopping list button under recipe cards',
      );
    }

    return this.log(
      'ensureBottomShoppingListButtonPosition',
      'passthroughMethodComplete',
      undefined,
      {
        canLogReturnValue: false,
        message: 'HomePage.ensureBottomShoppingListButtonPosition: Completed',
      },
    );
  }

  // loadRecipeCards: Loads recipes from API and renders Home page cards.
  async loadRecipeCards(config, searchTerm = '') {
    this.log(
      'loadRecipeCards',
      'lifecycle',
      'homePage.loadRecipeCards: Starting...',
    );
    const profile = this.profile;
    const recipeCardContainer = document.querySelector(
      `.${config.classes.recipeCards}`,
    );
    const contentWrapper = recipeCardContainer
      ? recipeCardContainer.closest(`.${config.classes.mainContentWrapper}`)
      : null;
    const template = document.getElementById(config.ids.templates.recipeCard);
    const wrapperTemplate = document.getElementById(
      config.ids.templates.recipeCardWrapper,
    );
    const messageTemplate = document.getElementById(
      config.ids.templates.recipeCardsMessage,
    );

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

    try {
      const api = this.recipeApi;
      if (!api) {
        this.log(
          'loadRecipeCards',
          'info',
          'homePage.loadRecipeCards: No RecipeApi instance available',
        );
        return;
      }
      const dataset = await api.fetchRecipesDataset(config);
      // State: Populate shared recipes collection from fetched dataset.
      Recipes.populateRecipes(dataset);

      let recipeModels = Recipes.getAll();

      if (searchTerm) {
        // State: Filter recipes in-memory based on the current search term.
        recipeModels = Recipes.filterByName(recipeModels, searchTerm);
      }

      this.log(
        'loadRecipeCards',
        'info',
        'homePage.loadRecipeCards: Rendering recipe cards:',
        recipeModels.length,
      );

      Main.renderRecipeCards(config, {
        recipeCardContainer,
        contentWrapper,
        template,
        wrapperTemplate,
        messageTemplate,
        recipeModels,
        profile,
        pageInstance: this,
      });
    } catch (error) {
      this.log(
        'loadRecipeCards',
        'error',
        'HomePage.loadRecipeCards: Error loading recipe cards',
        error,
      );
      // State: Show a fallback error message when recipes fail to load.
      const messages = (config && config.messages) || {};
      const sharedMessages = messages.shared || {};
      const recipesMessages = messages.recipes || {};
      const errorMessage =
        sharedMessages.recipesLoadError ||
        recipesMessages.loadError ||
        sharedMessages.genericError ||
        '';

      let messageElement;
      if (messageTemplate && messageTemplate.content) {
        const fragment = messageTemplate.content.cloneNode(true);
        messageElement = fragment.firstElementChild;
      } else {
        messageElement = document.createElement('p');
      }

      if (messageElement) {
        if (config.classes.recipeCardsEmptyMessage) {
          messageElement.className = config.classes.recipeCardsEmptyMessage;
        }
        messageElement.textContent = errorMessage;
        recipeCardContainer.innerHTML = '';
        recipeCardContainer.appendChild(messageElement);
      }
    }
  }

  // log: Delegates logging to the shared Logger using HomePage conventions.
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

  showRecipeDetail(config, recipe) {
    this.log(
      'showRecipeDetail',
      'methodStart',
      'HomePage.showRecipeDetail: Starting',
      { id: recipe?.id, title: recipe?.title },
    );

    this.log(
      'showRecipeDetail',
      'lifecycle',
      'homePage.showRecipeDetail: Starting',
      { id: recipe?.id, title: recipe?.title },
    );

    const profile = this.profile;

    const mainElement = document.querySelector(`.${config.classes.main}`);
    if (!mainElement) return;

    const recipeCardContainer = mainElement.querySelector(
      `.${config.classes.recipeCards}`,
    );

    const contentWrapper = mainElement.querySelector(
      `.${config.classes.mainContentWrapper}`,
    );

    const detailTemplate = document.getElementById(
      config.ids.templates.recipeDetail,
    );
    const ingredientTemplate = document.getElementById(
      config.ids.templates.ingredientDetail,
    );
    const nutritionTemplate = document.getElementById(
      config.ids.templates.nutritionDetail,
    );

    // State: Build configured attributes to apply to detail overlay controls.
    const elementAttrs = Site.buildElementAttributes(config);
    const site = window.site instanceof Site ? window.site : null;
    const applyAttrs =
      site && typeof site.applyAttributes === 'function'
        ? site.applyAttributes.bind(site)
        : (element, attrs) => {
            this.log(
              'showRecipeDetail',
              'info',
              'HomePage.showRecipeDetail: Site.applyAttributes not available, skipping attribute application',
              {
                hasElement: !!element,
                hasAttrs: !!attrs,
                hasSite: !!site,
              },
            );
          };

    // State: Render recipe detail overlay and hide underlying recipe cards.
    Main.renderRecipeDetailOverlay(config, {
      pageInstance: this,
      logPrefix: 'homePage',
      recipe,
      cardContainer: recipeCardContainer,
      contentWrapper,
      detailTemplate,
      ingredientTemplate,
      nutritionTemplate,
      profile,
      scale: 1,
      elementAttrs,
      applyAttrs,
    });
  }

  showIngredientDetail(config, overlay, recipe, ingredient) {
    this.log(
      'showIngredientDetail',
      'methodStart',
      'HomePage.showIngredientDetail: Starting',
      {
        recipeId: recipe?.id,
        ingredientId: ingredient?.id,
        ingredientName: ingredient?.name,
      },
    );

    // State: Build configured attributes for ingredient detail controls.
    const elementAttrs = Site.buildElementAttributes(config);
    const site = window.site instanceof Site ? window.site : null;
    const applyAttrs =
      site && typeof site.applyAttributes === 'function'
        ? site.applyAttributes.bind(site)
        : (element, attrs) => {
            this.log(
              'showIngredientDetail',
              'info',
              'HomePage.showIngredientDetail: Site.applyAttributes not available, skipping attribute application',
              {
                hasElement: !!element,
                hasAttrs: !!attrs,
                hasSite: !!site,
              },
            );
          };

    // State: Swap visible sections to ingredient detail within the overlay.
    Main.showIngredientDetail(config, {
      overlay,
      recipe,
      ingredient,
      pageInstance: this,
      logPrefix: 'homePage',
      scale: 1,
      elementAttrs,
      applyAttrs,
    });
  }

  showNutritionDetail(config, overlay, recipe) {
    this.log(
      'showNutritionDetail',
      'methodStart',
      'HomePage.showNutritionDetail: Starting',
      {
        recipeId: recipe?.id,
      },
    );

    // State: Swap visible sections to nutrition detail within the overlay.
    Main.showNutritionDetail(config, {
      overlay,
      recipe,
      pageInstance: this,
      logPrefix: 'homePage',
    });

    const nutritionSection = overlay.querySelector(
      `.${config.classes.nutritionDetail}`,
    );
    const closeButton = nutritionSection
      ? nutritionSection.querySelector(
          `.${config.classes.nutritionDetailClose}`,
        )
      : null;

    // State: Build configured attributes for nutrition detail close control.
    const elementAttrs = Site.buildElementAttributes(config);

    if (closeButton && elementAttrs.nutritionDetailClose) {
      const site = window.site instanceof Site ? window.site : null;
      const applyAttrs =
        site && typeof site.applyAttributes === 'function'
          ? site.applyAttributes.bind(site)
          : (element, attrs) => {
              this.log(
                'showNutritionDetail',
                'info',
                'HomePage.showNutritionDetail: Site.applyAttributes not available, skipping attribute application',
                {
                  hasElement: !!element,
                  hasAttrs: !!attrs,
                  hasSite: !!site,
                },
              );
            };

      // State: Apply configured attributes to nutrition close button.
      applyAttrs(closeButton, elementAttrs.nutritionDetailClose);
    }
  }

  syncFavoriteButtonsForRecipe(recipeId) {
    this.log(
      'syncFavoriteButtonsForRecipe',
      'methodStart',
      'HomePage.syncFavoriteButtonsForRecipe: Starting',
      {
        recipeId,
      },
    );

    if (recipeId == null) {
      return this.log(
        'syncFavoriteButtonsForRecipe',
        'passthroughMethodComplete',
        undefined,
        {
          canLogReturnValue: false,
          message:
            'HomePage.syncFavoriteButtonsForRecipe: Skipped - recipeId is null or undefined',
        },
      );
    }

    const profile = this.profile;
    const idString = String(recipeId);
    const isFavorite =
      typeof Recipes.isRecipeIdFavoriteForProfile === 'function'
        ? Recipes.isRecipeIdFavoriteForProfile(recipeId, profile)
        : false;

    const selector = [
      `.recipe-favorite-toggle[data-recipe-id="${CSS.escape(idString)}"]`,
      `.recipe-detail-favorite-toggle[data-recipe-id="${CSS.escape(
        idString,
      )}"]`,
    ].join(', ');

    const buttons = document.querySelectorAll(selector);
    buttons.forEach((button) => {
      this.updateFavoriteButtonState(button, isFavorite);
    });

    this.log(
      'syncFavoriteButtonsForRecipe',
      'info',
      'State change: Synced favorite buttons for recipe',
      {
        recipeId,
        buttonCount: buttons.length,
        isFavorite,
      },
    );

    return this.log(
      'syncFavoriteButtonsForRecipe',
      'passthroughMethodComplete',
      undefined,
      {
        canLogReturnValue: false,
        message: 'HomePage.syncFavoriteButtonsForRecipe: Completed',
      },
    );
  }

  updateFavoriteButtonState(button, isFavorite) {
    this.log(
      'updateFavoriteButtonState',
      'methodStart',
      'HomePage.updateFavoriteButtonState: Starting',
      {
        hasButton: !!button,
        isFavorite,
      },
    );

    if (!button) {
      return this.log(
        'updateFavoriteButtonState',
        'passthroughMethodComplete',
        undefined,
        {
          canLogReturnValue: false,
          message:
            'HomePage.updateFavoriteButtonState: Skipped - button is null or undefined',
        },
      );
    }
    const sharedMessages =
      this.config && this.config.messages
        ? this.config.messages.shared || null
        : null;
    const addLabel =
      sharedMessages && sharedMessages.favoriteAddAria
        ? sharedMessages.favoriteAddAria
        : null;
    const removeLabel =
      sharedMessages && sharedMessages.favoriteRemoveAria
        ? sharedMessages.favoriteRemoveAria
        : null;
    if (isFavorite) {
      button.classList.add(this.config.classes.favoriteActive);
      button.setAttribute('aria-pressed', 'true');
      if (removeLabel) {
        button.setAttribute('aria-label', removeLabel);
      }
    } else {
      button.classList.remove(this.config.classes.favoriteActive);
      button.setAttribute('aria-pressed', 'false');
      if (addLabel) {
        button.setAttribute('aria-label', addLabel);
      }
    }

    this.log(
      'updateFavoriteButtonState',
      'info',
      'State change: Updated favorite button state',
      {
        isFavorite,
        className: button.className,
      },
    );

    return this.log(
      'updateFavoriteButtonState',
      'passthroughMethodComplete',
      undefined,
      {
        canLogReturnValue: false,
        message: 'HomePage.updateFavoriteButtonState: Completed',
      },
    );
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'HomePage');

Logger.instrumentClass(HomePage, 'HomePage');

export { HomePage };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
