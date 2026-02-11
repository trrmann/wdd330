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

      const data = await response.json();
      let recipes = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
          ? data.results
          : [];

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        recipes = recipes.filter((recipe) =>
          (recipe.title || '').toLowerCase().includes(term),
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
          // Decorative card image: keep template alt="" to avoid redundant text
        }
        if (title) {
          title.textContent = recipe.title;
        }
        if (description) {
          const used =
            typeof recipe.usedIngredientCount === 'number'
              ? recipe.usedIngredientCount
              : 0;
          const missed =
            typeof recipe.missedIngredientCount === 'number'
              ? recipe.missedIngredientCount
              : 0;
          const likes = typeof recipe.likes === 'number' ? recipe.likes : 0;

          description.textContent = `Uses ${used} of your ingredients, misses ${missed}; ${likes} likes`;
        }
        cardWrapper.appendChild(cardClone);

        cardWrapper.addEventListener('click', () => {
          this.log(
            'loadRecipeCards',
            'lifecycle',
            'homePage.loadRecipeCards: Recipe card clicked',
            { id: recipe.id, title: recipe.title },
          );
          this.showRecipeDetail(config, recipe);
        });

        recipeCardContainer.appendChild(cardWrapper);
      });
    } catch (error) {
      console.error('Error loading recipe cards:', error);
      recipeCardContainer.innerHTML =
        '<p>Could not load recipes. Please try again later.</p>';
    }
  }

  showRecipeDetail(config, recipe) {
    this.log(
      'showRecipeDetail',
      'lifecycle',
      'homePage.showRecipeDetail: Starting',
      { id: recipe?.id, title: recipe?.title },
    );

    const mainElement = document.querySelector(`.${config.mainClassName}`);
    if (!mainElement) return;

    const recipeCardContainer = mainElement.querySelector(
      config.recipeCardsSelector,
    );

    const contentWrapper = mainElement.querySelector(
      config.mainContentWrapperSelector,
    );
    if (!contentWrapper) {
      this.log(
        'showRecipeDetail',
        'info',
        'homePage.showRecipeDetail: No content wrapper found',
      );
      return;
    }

    const template = contentWrapper.querySelector(
      `#${CSS.escape(config.recipeDetailTemplateId)}`,
    );
    if (!template) {
      this.log(
        'showRecipeDetail',
        'info',
        'homePage.showRecipeDetail: No detail template found',
      );
      return;
    }

    const ingredientTemplate = contentWrapper.querySelector(
      `#${CSS.escape(config.ingredientDetailTemplateId)}`,
    );
    const nutritionTemplate = contentWrapper.querySelector(
      `#${CSS.escape(config.nutritionDetailTemplateId)}`,
    );

    const overlay = document.createElement('div');
    overlay.className = config.recipeDetailOverlayClassName;

    const detailFragment = template.content.cloneNode(true);

    const closeButton = detailFragment.querySelector('.recipe-detail-close');
    const nutritionButton = detailFragment.querySelector(
      '.recipe-detail-nutrition-btn',
    );
    const titleEl = detailFragment.querySelector('.recipe-detail-title');
    const metaEl = detailFragment.querySelector('.recipe-detail-meta');
    const imgEl = detailFragment.querySelector('.recipe-detail-image');
    const ingredientsList = detailFragment.querySelector(
      '.recipe-detail-ingredients-list',
    );
    const instructionsEl = detailFragment.querySelector(
      '.recipe-detail-instructions-text',
    );

    if (titleEl) {
      titleEl.textContent = recipe.title || '';
    }

    if (metaEl) {
      const ready =
        typeof recipe.readyInMinutes === 'number'
          ? `${recipe.readyInMinutes} min`
          : 'N/A';
      const servings =
        typeof recipe.servings === 'number' ? recipe.servings : 'N/A';
      const likes = typeof recipe.likes === 'number' ? recipe.likes : 0;
      metaEl.textContent = `Ready in ${ready} · Serves ${servings} · ${likes} likes`;
    }

    if (imgEl) {
      imgEl.src = recipe.image || '';
      imgEl.alt = recipe.title || 'Recipe image';
    }

    if (ingredientsList && Array.isArray(recipe.extendedIngredients)) {
      ingredientsList.innerHTML = '';
      recipe.extendedIngredients.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item.originalString || '';
        li.addEventListener('click', () => {
          this.showIngredientDetail(config, overlay, recipe, item);
        });
        ingredientsList.appendChild(li);
      });
    }

    if (instructionsEl) {
      instructionsEl.textContent = recipe.instructions || '';
    }

    if (nutritionButton) {
      nutritionButton.addEventListener('click', () => {
        this.showNutritionDetail(config, overlay, recipe);
      });
    }

    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.log(
          'showRecipeDetail',
          'lifecycle',
          'homePage.showRecipeDetail: Close clicked, removing overlay',
          { id: recipe?.id },
        );
        overlay.remove();

        if (recipeCardContainer) {
          recipeCardContainer.classList.remove(
            config.recipeCardsHiddenClassName,
          );
          recipeCardContainer.removeAttribute('aria-hidden');
        }
      });
    }

    overlay.appendChild(detailFragment);

    if (ingredientTemplate) {
      const ingredientFragment = ingredientTemplate.content.cloneNode(true);
      const ingredientSection =
        ingredientFragment.querySelector('.ingredient-detail');
      if (ingredientSection) {
        ingredientSection.setAttribute('hidden', 'true');
      }
      overlay.appendChild(ingredientFragment);
    }

    if (nutritionTemplate) {
      const nutritionFragment = nutritionTemplate.content.cloneNode(true);
      const nutritionSection =
        nutritionFragment.querySelector('.nutrition-detail');
      if (nutritionSection) {
        nutritionSection.setAttribute('hidden', 'true');
      }
      overlay.appendChild(nutritionFragment);
    }
    contentWrapper.appendChild(overlay);

    if (recipeCardContainer) {
      recipeCardContainer.classList.add(config.recipeCardsHiddenClassName);
      recipeCardContainer.setAttribute('aria-hidden', 'true');
    }

    this.log(
      'showRecipeDetail',
      'lifecycle',
      'homePage.showRecipeDetail: Overlay rendered',
      { id: recipe?.id },
    );
  }

  showIngredientDetail(config, overlay, recipe, ingredient) {
    this.log(
      'showIngredientDetail',
      'lifecycle',
      'homePage.showIngredientDetail: Starting',
      {
        recipeId: recipe?.id,
        ingredientId: ingredient?.id,
        ingredientName: ingredient?.name,
      },
    );

    if (!overlay) {
      this.log(
        'showIngredientDetail',
        'info',
        'homePage.showIngredientDetail: No overlay provided',
      );
      return;
    }

    const recipeSection = overlay.querySelector('.recipe-detail');
    const ingredientSection = overlay.querySelector('.ingredient-detail');

    if (!ingredientSection || !recipeSection) {
      this.log(
        'showIngredientDetail',
        'info',
        'homePage.showIngredientDetail: Required sections not found',
      );
      return;
    }

    const titleEl = ingredientSection.querySelector('.ingredient-detail-title');
    const metaEl = ingredientSection.querySelector('.ingredient-detail-meta');
    const imgEl = ingredientSection.querySelector('.ingredient-detail-image');
    const originalEl = ingredientSection.querySelector(
      '.ingredient-detail-original',
    );
    const amountEl = ingredientSection.querySelector(
      '.ingredient-detail-amount',
    );
    const aisleEl = ingredientSection.querySelector('.ingredient-detail-aisle');
    const metaInfoEl = ingredientSection.querySelector(
      '.ingredient-detail-meta-info',
    );
    const closeButton = ingredientSection.querySelector(
      '.ingredient-detail-close',
    );

    if (titleEl) {
      titleEl.textContent = ingredient.name || ingredient.originalString || '';
    }

    if (metaEl) {
      metaEl.textContent = recipe.title ? `From recipe: ${recipe.title}` : '';
    }

    if (imgEl) {
      imgEl.src = ingredient.image || '';
      imgEl.alt = ingredient.name || 'Ingredient image';
    }

    if (originalEl) {
      originalEl.textContent = ingredient.originalString || '';
    }

    if (amountEl) {
      const amount =
        typeof ingredient.amount === 'number' ? ingredient.amount : null;
      const unit = ingredient.unitLong || ingredient.unit || '';
      amountEl.textContent =
        amount !== null
          ? `Amount: ${amount} ${unit}`.trim()
          : unit
            ? `Unit: ${unit}`
            : '';
    }

    if (aisleEl) {
      aisleEl.textContent = ingredient.aisle
        ? `Aisle: ${ingredient.aisle}`
        : '';
    }

    if (metaInfoEl) {
      const meta = Array.isArray(ingredient.metaInformation)
        ? ingredient.metaInformation.join(', ')
        : '';
      metaInfoEl.textContent = meta ? `Details: ${meta}` : '';
    }

    recipeSection.setAttribute('hidden', 'true');
    ingredientSection.removeAttribute('hidden');

    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.log(
          'showIngredientDetail',
          'lifecycle',
          'homePage.showIngredientDetail: Close clicked, returning to recipe detail',
          {
            recipeId: recipe?.id,
            ingredientId: ingredient?.id,
          },
        );
        ingredientSection.setAttribute('hidden', 'true');
        recipeSection.removeAttribute('hidden');
      });
    }
  }

  showNutritionDetail(config, overlay, recipe) {
    this.log(
      'showNutritionDetail',
      'lifecycle',
      'homePage.showNutritionDetail: Starting',
      { id: recipe?.id, title: recipe?.title },
    );

    if (!overlay) {
      this.log(
        'showNutritionDetail',
        'info',
        'homePage.showNutritionDetail: No overlay provided',
      );
      return;
    }

    const recipeSection = overlay.querySelector('.recipe-detail');
    const nutritionSection = overlay.querySelector('.nutrition-detail');

    if (!nutritionSection || !recipeSection) {
      this.log(
        'showNutritionDetail',
        'info',
        'homePage.showNutritionDetail: Required sections not found',
      );
      return;
    }

    const titleEl = nutritionSection.querySelector('.nutrition-detail-title');
    const metaEl = nutritionSection.querySelector('.nutrition-detail-meta');
    const listEl = nutritionSection.querySelector('.nutrition-detail-list');
    const closeButton = nutritionSection.querySelector(
      '.nutrition-detail-close',
    );

    if (titleEl) {
      titleEl.textContent = 'Nutrition';
    }

    if (metaEl) {
      const servings =
        typeof recipe.servings === 'number' ? recipe.servings : 'N/A';
      metaEl.textContent = recipe.title
        ? `For ${servings} serving(s) of ${recipe.title}`
        : `For ${servings} serving(s)`;
    }

    if (listEl) {
      listEl.innerHTML = '';
      const nutrients =
        recipe && recipe.nutrition && Array.isArray(recipe.nutrition.nutrients)
          ? recipe.nutrition.nutrients
          : [];

      nutrients.forEach((nutrient) => {
        const li = document.createElement('li');
        const title = nutrient.title || '';
        const amount =
          typeof nutrient.amount === 'number' ? nutrient.amount : '';
        const unit = nutrient.unit || '';
        li.textContent = `${title}: ${amount} ${unit}`.trim();
        listEl.appendChild(li);
      });
    }

    recipeSection.setAttribute('hidden', 'true');
    nutritionSection.removeAttribute('hidden');

    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.log(
          'showNutritionDetail',
          'lifecycle',
          'homePage.showNutritionDetail: Close clicked, returning to recipe detail',
          { id: recipe?.id },
        );
        nutritionSection.setAttribute('hidden', 'true');
        recipeSection.removeAttribute('hidden');
      });
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

  afterRender(config) {
    this.log(
      'afterRender',
      'lifecycle',
      'recipesPage.afterRender: Starting afterRender lifecycle hook',
    );
    this.loadRecipeCards(config);
    this.addRecipesPageEventListeners(config);
  }

  addRecipesPageEventListeners(config) {
    const mainElement = document.querySelector(`.${config.mainClassName}`);
    if (!mainElement) return;
    const nameCheckbox = mainElement.querySelector(
      'input[name="recipes-search-type"][value="name"]',
    );
    const ingredientCheckbox = mainElement.querySelector(
      'input[name="recipes-search-type"][value="ingredient"]',
    );
    const nutritionCheckbox = mainElement.querySelector(
      'input[name="recipes-search-type"][value="nutrition"]',
    );

    const nameInputContainer = mainElement.querySelector(
      '.recipes-search-input-name',
    );
    const nameInput = nameInputContainer
      ? nameInputContainer.querySelector('input')
      : null;

    const ingredientInputContainer = mainElement.querySelector(
      '.recipes-search-input-ingredient',
    );
    const ingredientInput = ingredientInputContainer
      ? ingredientInputContainer.querySelector('input')
      : null;

    const nutritionContainer = mainElement.querySelector(
      '.recipes-search-input-nutrition',
    );
    const nutrientNameInput = nutritionContainer
      ? nutritionContainer.querySelector('.recipes-nutrition-name')
      : null;
    const nutritionModeInputs = nutritionContainer
      ? nutritionContainer.querySelectorAll(
          'input[name="recipes-nutrition-mode"]',
        )
      : null;
    const nutritionMinWrapper = nutritionContainer
      ? nutritionContainer.querySelector('.recipes-nutrition-min')
      : null;
    const nutritionMinInput = nutritionContainer
      ? nutritionContainer.querySelector('.recipes-nutrition-min-value')
      : null;
    const nutritionMaxWrapper = nutritionContainer
      ? nutritionContainer.querySelector('.recipes-nutrition-max')
      : null;
    const nutritionMaxInput = nutritionContainer
      ? nutritionContainer.querySelector('.recipes-nutrition-max-value')
      : null;

    const searchButton = mainElement.querySelector('.recipes-search-submit');

    const updateTypeVisibility = () => {
      if (nameInputContainer) {
        if (nameCheckbox && nameCheckbox.checked) {
          nameInputContainer.removeAttribute('hidden');
        } else {
          nameInputContainer.setAttribute('hidden', 'true');
        }
      }

      if (ingredientInputContainer) {
        if (ingredientCheckbox && ingredientCheckbox.checked) {
          ingredientInputContainer.removeAttribute('hidden');
        } else {
          ingredientInputContainer.setAttribute('hidden', 'true');
        }
      }

      if (nutritionContainer) {
        if (nutritionCheckbox && nutritionCheckbox.checked) {
          nutritionContainer.removeAttribute('hidden');
        } else {
          nutritionContainer.setAttribute('hidden', 'true');
        }
      }
    };

    const updateNutritionModeVisibility = () => {
      if (
        !nutritionModeInputs ||
        !nutritionMinWrapper ||
        !nutritionMaxWrapper
      ) {
        return;
      }

      const selectedModeInput = Array.from(nutritionModeInputs).find(
        (input) => input.checked,
      );
      const mode =
        selectedModeInput && selectedModeInput.value
          ? selectedModeInput.value
          : 'min';

      if (mode === 'min') {
        nutritionMinWrapper.removeAttribute('hidden');
        nutritionMaxWrapper.setAttribute('hidden', 'true');
      } else if (mode === 'max') {
        nutritionMaxWrapper.removeAttribute('hidden');
        nutritionMinWrapper.setAttribute('hidden', 'true');
      } else {
        nutritionMinWrapper.removeAttribute('hidden');
        nutritionMaxWrapper.removeAttribute('hidden');
      }
    };

    if (nameCheckbox) {
      nameCheckbox.addEventListener('change', updateTypeVisibility);
    }
    if (ingredientCheckbox) {
      ingredientCheckbox.addEventListener('change', updateTypeVisibility);
    }
    if (nutritionCheckbox) {
      nutritionCheckbox.addEventListener('change', updateTypeVisibility);
    }

    if (nutritionModeInputs) {
      nutritionModeInputs.forEach((input) => {
        input.addEventListener('change', updateNutritionModeVisibility);
      });
    }

    updateTypeVisibility();
    updateNutritionModeVisibility();

    const getFiltersOrNull = () => {
      const filters = {
        name: '',
        ingredient: '',
        nutrition: null,
      };

      if (nameCheckbox && nameCheckbox.checked && nameInput) {
        const term = nameInput.value.trim();
        if (term) {
          filters.name = term;
        }
      }

      if (ingredientCheckbox && ingredientCheckbox.checked && ingredientInput) {
        const term = ingredientInput.value.trim();
        if (term) {
          filters.ingredient = term;
        }
      }

      let nutritionFilters = null;
      if (
        nutritionCheckbox &&
        nutritionCheckbox.checked &&
        nutritionContainer
      ) {
        const nutrientName = nutrientNameInput
          ? nutrientNameInput.value.trim()
          : '';

        let mode = null;
        if (nutritionModeInputs && nutritionModeInputs.length > 0) {
          const selectedModeInput = Array.from(nutritionModeInputs).find(
            (input) => input.checked,
          );
          mode =
            selectedModeInput && selectedModeInput.value
              ? selectedModeInput.value
              : null;
        }

        let min = null;
        let max = null;

        if (
          (mode === 'min' || mode === 'range') &&
          nutritionMinInput &&
          nutritionMinInput.value !== ''
        ) {
          const parsedMin = parseFloat(nutritionMinInput.value);
          if (!Number.isNaN(parsedMin)) {
            min = parsedMin;
          }
        }

        if (
          (mode === 'max' || mode === 'range') &&
          nutritionMaxInput &&
          nutritionMaxInput.value !== ''
        ) {
          const parsedMax = parseFloat(nutritionMaxInput.value);
          if (!Number.isNaN(parsedMax)) {
            max = parsedMax;
          }
        }

        if (mode === 'range' && min !== null && max !== null && max < min) {
          this.log(
            'addRecipesPageEventListeners',
            'info',
            'recipesPage.addRecipesPageEventListeners: Nutrition range invalid (max < min)',
            { min, max },
          );
          return null;
        }

        if (nutrientName && (min !== null || max !== null)) {
          nutritionFilters = { nutrientName, mode, min, max };
        }
      }

      if (nutritionFilters) {
        filters.nutrition = nutritionFilters;
      }

      return filters;
    };

    const triggerSearch = () => {
      const filters = getFiltersOrNull();
      if (!filters) {
        return;
      }

      this.loadRecipeCards(config, filters);
    };

    if (searchButton) {
      searchButton.addEventListener('click', triggerSearch);
    }

    const attachEnterKey = (input) => {
      if (!input) return;
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          triggerSearch();
        }
      });
    };

    attachEnterKey(nameInput);
    attachEnterKey(ingredientInput);
    attachEnterKey(nutrientNameInput);
    attachEnterKey(nutritionMinInput);
    attachEnterKey(nutritionMaxInput);
  }

  async loadRecipeCards(config, filters = null) {
    this.log(
      'loadRecipeCards',
      'lifecycle',
      'recipesPage.loadRecipeCards: Starting...',
      { filters },
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
      'recipesPage.loadRecipeCards: recipeCardContainer found:',
      !!recipeCardContainer,
    );
    this.log(
      'loadRecipeCards',
      'lifecycle',
      'recipesPage.loadRecipeCards: template found:',
      !!template,
    );

    if (!recipeCardContainer || !template) {
      return;
    }

    recipeCardContainer.innerHTML = '';

    try {
      const response = await fetch(config.mockDataPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let recipes = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
          ? data.results
          : [];

      if (filters) {
        if (filters.name) {
          const term = filters.name.toLowerCase();
          recipes = recipes.filter((recipe) =>
            (recipe.title || '').toLowerCase().includes(term),
          );
        }

        if (filters.ingredient) {
          const term = filters.ingredient.toLowerCase();
          recipes = recipes.filter((recipe) => {
            const ingredients = Array.isArray(recipe.extendedIngredients)
              ? recipe.extendedIngredients
              : [];

            return ingredients.some((ingredient) => {
              const name = (ingredient.name || '').toLowerCase();
              const original = (ingredient.originalString || '').toLowerCase();
              return name.includes(term) || original.includes(term);
            });
          });
        }

        if (filters.nutrition) {
          const nutrientKey = filters.nutrition.nutrientName
            ? filters.nutrition.nutrientName.toLowerCase()
            : '';
          const min =
            typeof filters.nutrition.min === 'number'
              ? filters.nutrition.min
              : null;
          const max =
            typeof filters.nutrition.max === 'number'
              ? filters.nutrition.max
              : null;

          if (nutrientKey && (min !== null || max !== null)) {
            recipes = recipes.filter((recipe) => {
              const nutrients =
                recipe &&
                recipe.nutrition &&
                Array.isArray(recipe.nutrition.nutrients)
                  ? recipe.nutrition.nutrients
                  : [];

              const match = nutrients.find((nutrient) => {
                const title = (nutrient.title || '').toLowerCase();
                return title === nutrientKey;
              });

              if (!match || typeof match.amount !== 'number') {
                return false;
              }

              const value = match.amount;

              if (min !== null && value < min) {
                return false;
              }

              if (max !== null && value > max) {
                return false;
              }

              return true;
            });
          }
        }
      }

      if (recipes.length === 0) {
        recipeCardContainer.innerHTML = config.noRecipesFoundMessage;
        return;
      }

      this.log(
        'loadRecipeCards',
        'info',
        'recipesPage.loadRecipeCards: Rendering recipe cards:',
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
          // Decorative card image: keep template alt="" to avoid redundant text
        }
        if (title) {
          title.textContent = recipe.title;
        }
        if (description) {
          const used =
            typeof recipe.usedIngredientCount === 'number'
              ? recipe.usedIngredientCount
              : 0;
          const missed =
            typeof recipe.missedIngredientCount === 'number'
              ? recipe.missedIngredientCount
              : 0;
          const likes = typeof recipe.likes === 'number' ? recipe.likes : 0;

          description.textContent = `Uses ${used} of your ingredients, misses ${missed}; ${likes} likes`;
        }
        cardWrapper.appendChild(cardClone);

        cardWrapper.addEventListener('click', () => {
          this.log(
            'loadRecipeCards',
            'lifecycle',
            'recipesPage.loadRecipeCards: Recipe card clicked',
            { id: recipe.id, title: recipe.title },
          );
          this.showRecipeDetail(config, recipe);
        });

        recipeCardContainer.appendChild(cardWrapper);
      });
    } catch (error) {
      console.error('Error loading recipe cards (recipes page):', error);
      recipeCardContainer.innerHTML =
        '<p>Could not load recipes. Please try again later.</p>';
    }
  }

  showRecipeDetail(config, recipe) {
    this.log(
      'showRecipeDetail',
      'lifecycle',
      'recipesPage.showRecipeDetail: Starting',
      { id: recipe?.id, title: recipe?.title },
    );

    const mainElement = document.querySelector(`.${config.mainClassName}`);
    if (!mainElement) return;

    const recipeCardContainer = mainElement.querySelector(
      config.recipeCardsSelector,
    );

    const contentWrapper = mainElement.querySelector(
      config.mainContentWrapperSelector,
    );
    if (!contentWrapper) {
      this.log(
        'showRecipeDetail',
        'info',
        'recipesPage.showRecipeDetail: No content wrapper found',
      );
      return;
    }

    const template = contentWrapper.querySelector(
      `#${CSS.escape(config.recipeDetailTemplateId)}`,
    );
    if (!template) {
      this.log(
        'showRecipeDetail',
        'info',
        'recipesPage.showRecipeDetail: No detail template found',
      );
      return;
    }
    const ingredientTemplate = contentWrapper.querySelector(
      `#${CSS.escape(config.ingredientDetailTemplateId)}`,
    );
    const nutritionTemplate = contentWrapper.querySelector(
      `#${CSS.escape(config.nutritionDetailTemplateId)}`,
    );

    const overlay = document.createElement('div');
    overlay.className = config.recipeDetailOverlayClassName;

    const detailFragment = template.content.cloneNode(true);

    const closeButton = detailFragment.querySelector('.recipe-detail-close');
    const nutritionButton = detailFragment.querySelector(
      '.recipe-detail-nutrition-btn',
    );
    const titleEl = detailFragment.querySelector('.recipe-detail-title');
    const metaEl = detailFragment.querySelector('.recipe-detail-meta');
    const imgEl = detailFragment.querySelector('.recipe-detail-image');
    const ingredientsList = detailFragment.querySelector(
      '.recipe-detail-ingredients-list',
    );
    const instructionsEl = detailFragment.querySelector(
      '.recipe-detail-instructions-text',
    );

    if (titleEl) {
      titleEl.textContent = recipe.title || '';
    }

    if (metaEl) {
      const ready =
        typeof recipe.readyInMinutes === 'number'
          ? `${recipe.readyInMinutes} min`
          : 'N/A';
      const servings =
        typeof recipe.servings === 'number' ? recipe.servings : 'N/A';
      const likes = typeof recipe.likes === 'number' ? recipe.likes : 0;
      metaEl.textContent = `Ready in ${ready} · Serves ${servings} · ${likes} likes`;
    }

    if (imgEl) {
      imgEl.src = recipe.image || '';
      imgEl.alt = recipe.title || 'Recipe image';
    }

    if (ingredientsList && Array.isArray(recipe.extendedIngredients)) {
      ingredientsList.innerHTML = '';
      recipe.extendedIngredients.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item.originalString || '';
        li.addEventListener('click', () => {
          this.showIngredientDetail(config, overlay, recipe, item);
        });
        ingredientsList.appendChild(li);
      });
    }

    if (instructionsEl) {
      instructionsEl.textContent = recipe.instructions || '';
    }

    if (nutritionButton) {
      nutritionButton.addEventListener('click', () => {
        this.showNutritionDetail(config, overlay, recipe);
      });
    }

    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.log(
          'showRecipeDetail',
          'lifecycle',
          'recipesPage.showRecipeDetail: Close clicked, removing overlay',
          { id: recipe?.id },
        );
        overlay.remove();

        if (recipeCardContainer) {
          recipeCardContainer.classList.remove(
            config.recipeCardsHiddenClassName,
          );
          recipeCardContainer.removeAttribute('aria-hidden');
        }
      });
    }

    overlay.appendChild(detailFragment);

    if (ingredientTemplate) {
      const ingredientFragment = ingredientTemplate.content.cloneNode(true);
      const ingredientSection =
        ingredientFragment.querySelector('.ingredient-detail');
      if (ingredientSection) {
        ingredientSection.setAttribute('hidden', 'true');
      }
      overlay.appendChild(ingredientFragment);
    }
    if (nutritionTemplate) {
      const nutritionFragment = nutritionTemplate.content.cloneNode(true);
      const nutritionSection =
        nutritionFragment.querySelector('.nutrition-detail');
      if (nutritionSection) {
        nutritionSection.setAttribute('hidden', 'true');
      }
      overlay.appendChild(nutritionFragment);
    }
    contentWrapper.appendChild(overlay);

    if (recipeCardContainer) {
      recipeCardContainer.classList.add(config.recipeCardsHiddenClassName);
      recipeCardContainer.setAttribute('aria-hidden', 'true');
    }

    this.log(
      'showRecipeDetail',
      'lifecycle',
      'recipesPage.showRecipeDetail: Overlay rendered',
      { id: recipe?.id },
    );
  }

  showIngredientDetail(config, overlay, recipe, ingredient) {
    this.log(
      'showIngredientDetail',
      'lifecycle',
      'recipesPage.showIngredientDetail: Starting',
      {
        recipeId: recipe?.id,
        ingredientId: ingredient?.id,
        ingredientName: ingredient?.name,
      },
    );

    if (!overlay) {
      this.log(
        'showIngredientDetail',
        'info',
        'recipesPage.showIngredientDetail: No overlay provided',
      );
      return;
    }

    const recipeSection = overlay.querySelector('.recipe-detail');
    const ingredientSection = overlay.querySelector('.ingredient-detail');

    if (!ingredientSection || !recipeSection) {
      this.log(
        'showIngredientDetail',
        'info',
        'recipesPage.showIngredientDetail: Required sections not found',
      );
      return;
    }

    const titleEl = ingredientSection.querySelector('.ingredient-detail-title');
    const metaEl = ingredientSection.querySelector('.ingredient-detail-meta');
    const imgEl = ingredientSection.querySelector('.ingredient-detail-image');
    const originalEl = ingredientSection.querySelector(
      '.ingredient-detail-original',
    );
    const amountEl = ingredientSection.querySelector(
      '.ingredient-detail-amount',
    );
    const aisleEl = ingredientSection.querySelector('.ingredient-detail-aisle');
    const metaInfoEl = ingredientSection.querySelector(
      '.ingredient-detail-meta-info',
    );
    const closeButton = ingredientSection.querySelector(
      '.ingredient-detail-close',
    );

    if (titleEl) {
      titleEl.textContent = ingredient.name || ingredient.originalString || '';
    }

    if (metaEl) {
      metaEl.textContent = recipe.title ? `From recipe: ${recipe.title}` : '';
    }

    if (imgEl) {
      imgEl.src = ingredient.image || '';
      imgEl.alt = ingredient.name || 'Ingredient image';
    }

    if (originalEl) {
      originalEl.textContent = ingredient.originalString || '';
    }

    if (amountEl) {
      const amount =
        typeof ingredient.amount === 'number' ? ingredient.amount : null;
      const unit = ingredient.unitLong || ingredient.unit || '';
      amountEl.textContent =
        amount !== null
          ? `Amount: ${amount} ${unit}`.trim()
          : unit
            ? `Unit: ${unit}`
            : '';
    }

    if (aisleEl) {
      aisleEl.textContent = ingredient.aisle
        ? `Aisle: ${ingredient.aisle}`
        : '';
    }

    if (metaInfoEl) {
      const meta = Array.isArray(ingredient.metaInformation)
        ? ingredient.metaInformation.join(', ')
        : '';
      metaInfoEl.textContent = meta ? `Details: ${meta}` : '';
    }

    recipeSection.setAttribute('hidden', 'true');
    ingredientSection.removeAttribute('hidden');

    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.log(
          'showIngredientDetail',
          'lifecycle',
          'recipesPage.showIngredientDetail: Close clicked, returning to recipe detail',
          {
            recipeId: recipe?.id,
            ingredientId: ingredient?.id,
          },
        );
        ingredientSection.setAttribute('hidden', 'true');
        recipeSection.removeAttribute('hidden');
      });
    }
  }

  showNutritionDetail(config, overlay, recipe) {
    this.log(
      'showNutritionDetail',
      'lifecycle',
      'recipesPage.showNutritionDetail: Starting',
      { id: recipe?.id, title: recipe?.title },
    );

    if (!overlay) {
      this.log(
        'showNutritionDetail',
        'info',
        'recipesPage.showNutritionDetail: No overlay provided',
      );
      return;
    }

    const recipeSection = overlay.querySelector('.recipe-detail');
    const nutritionSection = overlay.querySelector('.nutrition-detail');

    if (!nutritionSection || !recipeSection) {
      this.log(
        'showNutritionDetail',
        'info',
        'recipesPage.showNutritionDetail: Required sections not found',
      );
      return;
    }

    const titleEl = nutritionSection.querySelector('.nutrition-detail-title');
    const metaEl = nutritionSection.querySelector('.nutrition-detail-meta');
    const listEl = nutritionSection.querySelector('.nutrition-detail-list');
    const closeButton = nutritionSection.querySelector(
      '.nutrition-detail-close',
    );

    if (titleEl) {
      titleEl.textContent = 'Nutrition';
    }

    if (metaEl) {
      const servings =
        typeof recipe.servings === 'number' ? recipe.servings : 'N/A';
      metaEl.textContent = recipe.title
        ? `For ${servings} serving(s) of ${recipe.title}`
        : `For ${servings} serving(s)`;
    }

    if (listEl) {
      listEl.innerHTML = '';
      const nutrients =
        recipe && recipe.nutrition && Array.isArray(recipe.nutrition.nutrients)
          ? recipe.nutrition.nutrients
          : [];

      nutrients.forEach((nutrient) => {
        const li = document.createElement('li');
        const title = nutrient.title || '';
        const amount =
          typeof nutrient.amount === 'number' ? nutrient.amount : '';
        const unit = nutrient.unit || '';
        li.textContent = `${title}: ${amount} ${unit}`.trim();
        listEl.appendChild(li);
      });
    }

    recipeSection.setAttribute('hidden', 'true');
    nutritionSection.removeAttribute('hidden');

    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.log(
          'showNutritionDetail',
          'lifecycle',
          'recipesPage.showNutritionDetail: Close clicked, returning to recipe detail',
          { id: recipe?.id },
        );
        nutritionSection.setAttribute('hidden', 'true');
        recipeSection.removeAttribute('hidden');
      });
    }
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
