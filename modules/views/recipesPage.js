import { bootLogger } from '../models/bootLogger.js';

import { Logger } from '../models/logger.js';
import { Site } from './site.js';
import { Main } from './main.js';
import { Recipes } from '../models/recipes.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(import.meta.url, 'Defines RecipesPage');

// Recipes page controller: renders the full recipes search view
// with name/ingredient/nutrition filters and results.
// Usage: const page = new RecipesPage(config, { logger }); page.init(config);
class RecipesPage {
  // constructor: Creates the RecipesPage controller and optionally initializes.
  constructor(config = null, options = {}) {
    Object.defineProperties(this, RecipesPage.descriptors);
    this.logger = options.logger || null;
    this.log(
      'constructor',
      'objectCreateStart',
      'RecipesPage.constructor: Starting',
    );
    this.config = config;
    this.profile = options.profile || null;
    this.recipeApi = options.recipeApi || null;
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
    // Immediately initialize after construction
    if (config) {
      this.init(config);
    }
  }

  // init: Builds the initial Recipes page view model from the template.
  init(config) {
    this.log('init', 'methodStart', 'RecipesPage.init: Starting', {
      hasConfig: !!config,
      alreadyInitialized: !!this.initialized,
    });

    if (this.initialized && this.view) {
      // State: Reuse existing RecipesPage view model when already initialized.
      return this.log('init', 'passthroughMethodComplete', this.view, {
        toLogValue: (page) => ({
          title: page.title,
          hasContent: !!page.content,
        }),
      });
    }

    this.log('init', 'objectInitStart', 'RecipesPage.init: Starting');
    // State: Capture the latest RecipesPage configuration on the instance.
    this.config = config;
    const template = document.getElementById(config.ids.templates.recipesPage);
    if (!template) {
      const errorResult = { title: config.titles.errorPage, content: '' };
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
    // State: Mark RecipesPage as initialized.
    this.initialized = true;
    this.log('init', 'objectInitComplete', 'RecipesPage.init: Completed');
    this.log('init', 'info', 'RecipesPage.init: RecipesPage initialized');
    const result = {
      title: config.titles.recipesPage,
      content: template.innerHTML,
    };
    // State: Cache the rendered RecipesPage view model.
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
    };
  }

  // addRecipesPageEventListeners: Attaches filter controls and search trigger.
  addRecipesPageEventListeners(config) {
    this.log(
      'addRecipesPageEventListeners',
      'methodStart',
      'recipesPage.addRecipesPageEventListeners: Starting',
      {
        hasConfig: !!config,
        hasClasses: !!(config && config.classes),
      },
    );

    const mainElement = document.querySelector(`.${config.classes.main}`);
    if (!mainElement) {
      return this.log(
        'addRecipesPageEventListeners',
        'passthroughMethodComplete',
        undefined,
        {
          toLogValue: () => ({
            reason:
              'recipesPage.addRecipesPageEventListeners: Main element not found',
            hasConfig: !!config,
            hasClasses: !!(config && config.classes),
          }),
        },
      );
    }
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
    const nameInput = mainElement.querySelector(
      `#${CSS.escape(config.ids.recipesSearchNameInput)}`,
    );

    const ingredientInputContainer = mainElement.querySelector(
      '.recipes-search-input-ingredient',
    );
    const ingredientInput = mainElement.querySelector(
      `#${CSS.escape(config.ids.recipesSearchIngredientInput)}`,
    );

    const nutritionContainer = mainElement.querySelector(
      '.recipes-search-input-nutrition',
    );
    const nutrientNameInput = nutritionContainer
      ? nutritionContainer.querySelector(
          `#${CSS.escape(config.ids.recipesNutritionName)}`,
        )
      : null;
    const nutritionModeInputs = nutritionContainer
      ? nutritionContainer.querySelectorAll(
          'input[name="recipes-nutrition-mode"]',
        )
      : null;
    const nutritionMinWrapper = nutritionContainer
      ? nutritionContainer.querySelector(
          `#${CSS.escape(config.ids.recipesNutritionMin)}`,
        )
      : null;
    const nutritionMinInput = nutritionContainer
      ? nutritionContainer.querySelector(
          `#${CSS.escape(config.ids.recipesNutritionMinValue)}`,
        )
      : null;
    const nutritionMaxWrapper = nutritionContainer
      ? nutritionContainer.querySelector(
          `#${CSS.escape(config.ids.recipesNutritionMax)}`,
        )
      : null;
    const nutritionMaxInput = nutritionContainer
      ? nutritionContainer.querySelector(
          `#${CSS.escape(config.ids.recipesNutritionMaxValue)}`,
        )
      : null;

    const searchButton = mainElement.querySelector(
      `#${CSS.escape(config.ids.recipesSearchSubmitButton)}`,
    );

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
        if (nutrientNameInput) {
          nutrientNameInput.setCustomValidity('');
        }

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

        const hasMinOrMax = min !== null || max !== null;

        if (hasMinOrMax && !nutrientName) {
          this.log(
            'addRecipesPageEventListeners',
            'info',
            'recipesPage.addRecipesPageEventListeners: Nutrition filter missing nutrient name',
            { mode, min, max },
          );
          if (nutrientNameInput) {
            nutrientNameInput.setCustomValidity(
              'Enter a nutrient name (e.g. Calories, Protein) to filter by nutrition.',
            );
            nutrientNameInput.reportValidity();
          }
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

    this.log(
      'addRecipesPageEventListeners',
      'info',
      'recipesPage.addRecipesPageEventListeners: Attached Recipes page event listeners',
      {
        hasNameCheckbox: !!nameCheckbox,
        hasIngredientCheckbox: !!ingredientCheckbox,
        hasNutritionCheckbox: !!nutritionCheckbox,
        hasSearchButton: !!searchButton,
      },
    );

    return this.log(
      'addRecipesPageEventListeners',
      'passthroughMethodComplete',
      undefined,
    );
  }

  // afterRender: Wires Recipes page filters after content render.
  afterRender(config) {
    this.log(
      'afterRender',
      'methodStart',
      'recipesPage.afterRender: Starting',
      {
        hasConfig: !!config,
      },
    );
    this.log(
      'afterRender',
      'lifecycle',
      'recipesPage.afterRender: Starting afterRender lifecycle hook',
    );
    const mainElement = document.querySelector(`.${config.classes.main}`);
    if (mainElement) {
      this.applyRecipesClasses(config, mainElement);
    }

    this.loadRecipeCards(config);
    this.addRecipesPageEventListeners(config);
    if (mainElement && config.classes && config.classes.visuallyHidden) {
      ['recipes-search-name-input', 'recipes-search-ingredient-input'].forEach(
        (id) => {
          const label = mainElement.querySelector(`label[for="${id}"]`);
          if (label) {
            label.classList.add(config.classes.visuallyHidden);
          }
        },
      );
    }
    if (mainElement && config.messages) {
      const recipesMessages = config.messages.recipes || null;
      const sharedMessages = config.messages.shared || null;
      const controlsMessages = config.messages.controls || null;

      if (recipesMessages) {
        const legend = mainElement.querySelector(
          '.recipes-search-type-group legend',
        );
        if (legend && recipesMessages.searchByLegend) {
          legend.textContent = recipesMessages.searchByLegend;
        }

        const nameLabel = mainElement.querySelector(
          'label input[name="recipes-search-type"][value="name"]',
        );
        if (
          nameLabel &&
          nameLabel.parentElement &&
          recipesMessages.searchTypeNameLabel
        ) {
          nameLabel.parentElement.lastChild.textContent =
            recipesMessages.searchTypeNameLabel;
        }

        const ingredientLabel = mainElement.querySelector(
          'label input[name="recipes-search-type"][value="ingredient"]',
        );
        if (
          ingredientLabel &&
          ingredientLabel.parentElement &&
          recipesMessages.searchTypeIngredientLabel
        ) {
          ingredientLabel.parentElement.lastChild.textContent =
            recipesMessages.searchTypeIngredientLabel;
        }

        const nutritionLabel = mainElement.querySelector(
          'label input[name="recipes-search-type"][value="nutrition"]',
        );
        if (
          nutritionLabel &&
          nutritionLabel.parentElement &&
          recipesMessages.searchTypeNutritionLabel
        ) {
          nutritionLabel.parentElement.lastChild.textContent =
            recipesMessages.searchTypeNutritionLabel;
        }

        const nameInputLabel = mainElement.querySelector(
          'label[for="recipes-search-name-input"]',
        );
        if (nameInputLabel && recipesMessages.searchByNameLabel) {
          nameInputLabel.textContent = recipesMessages.searchByNameLabel;
        }

        const ingredientInputLabel = mainElement.querySelector(
          'label[for="recipes-search-ingredient-input"]',
        );
        if (ingredientInputLabel && recipesMessages.searchByIngredientLabel) {
          ingredientInputLabel.textContent =
            recipesMessages.searchByIngredientLabel;
        }

        const nutrientLabel = mainElement.querySelector(
          '.recipes-nutrition-row label',
        );
        if (nutrientLabel && recipesMessages.nutritionNutrientLabel) {
          nutrientLabel.firstChild.textContent =
            recipesMessages.nutritionNutrientLabel;
        }

        const useLabel = mainElement.querySelector(
          '.recipes-nutrition-mode-label',
        );
        if (useLabel && recipesMessages.nutritionUseLabel) {
          useLabel.textContent = recipesMessages.nutritionUseLabel;
        }

        const minModeLabel = mainElement.querySelector(
          '.recipes-nutrition-mode label input[value="min"]',
        );
        if (minModeLabel && minModeLabel.parentElement) {
          const minModeText =
            controlsMessages && typeof controlsMessages.minLabel === 'string'
              ? controlsMessages.minLabel
              : '';
          minModeLabel.parentElement.lastChild.textContent = minModeText;
        }

        const maxModeLabel = mainElement.querySelector(
          '.recipes-nutrition-mode label input[value="max"]',
        );
        if (maxModeLabel && maxModeLabel.parentElement) {
          const maxModeText =
            controlsMessages && typeof controlsMessages.maxLabel === 'string'
              ? controlsMessages.maxLabel
              : '';
          maxModeLabel.parentElement.lastChild.textContent = maxModeText;
        }

        const rangeModeLabel = mainElement.querySelector(
          '.recipes-nutrition-mode label input[value="range"]',
        );
        if (
          rangeModeLabel &&
          rangeModeLabel.parentElement &&
          recipesMessages.nutritionModeRangeLabel
        ) {
          rangeModeLabel.parentElement.lastChild.textContent =
            recipesMessages.nutritionModeRangeLabel;
        }

        const minLabel = mainElement.querySelector('.recipes-nutrition-min');
        if (minLabel) {
          const minLabelText =
            controlsMessages && typeof controlsMessages.minLabel === 'string'
              ? controlsMessages.minLabel
              : '';
          minLabel.firstChild.textContent = minLabelText;
        }

        const maxLabel = mainElement.querySelector('.recipes-nutrition-max');
        if (maxLabel) {
          const maxLabelText =
            controlsMessages && typeof controlsMessages.maxLabel === 'string'
              ? controlsMessages.maxLabel
              : '';
          maxLabel.firstChild.textContent = maxLabelText;
        }

        const searchButton = mainElement.querySelector(
          `#${CSS.escape(config.ids.recipesSearchSubmitButton)}`,
        );
        const searchLabelText =
          controlsMessages && typeof controlsMessages.searchButton === 'string'
            ? controlsMessages.searchButton
            : '';
        if (searchButton) {
          searchButton.textContent = searchLabelText;
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

    this.log(
      'afterRender',
      'info',
      'recipesPage.afterRender: Completed afterRender lifecycle hook',
      {
        hasMainElement: !!mainElement,
      },
    );
    return this.log('afterRender', 'passthroughMethodComplete', undefined);
  }

  applyRecipesClasses(config, rootElement) {
    this.log(
      'applyRecipesClasses',
      'methodStart',
      'recipesPage.applyRecipesClasses: Starting',
      {
        hasConfig: !!config,
        hasClasses: !!(config && config.classes),
        hasIds: !!(config && config.ids),
        hasRootElement: !!rootElement,
      },
    );

    if (!config || !config.classes || !config.ids || !rootElement) {
      return this.log(
        'applyRecipesClasses',
        'passthroughMethodComplete',
        undefined,
        {
          toLogValue: () => ({
            reason:
              'recipesPage.applyRecipesClasses: Missing config, classes, ids, or rootElement',
            hasConfig: !!config,
            hasClasses: !!(config && config.classes),
            hasIds: !!(config && config.ids),
            hasRootElement: !!rootElement,
          }),
        },
      );
    }

    const { classes, ids } = config;

    let appliedCount = 0;
    let structuralAppliedCount = 0;

    const mappings = [
      [ids.recipesSearchBar, classes.homeSearchBar],
      [ids.recipesSearchSubmitButton, classes.recipesSearchSubmit],
      [ids.recipesSearchSubmitButton, classes.searchButton],
      [ids.recipesSearchNameInput, classes.recipesSearchNameInput],
      [ids.recipesSearchNameInput, classes.searchInput],
      [ids.recipesSearchIngredientInput, classes.recipesSearchIngredientInput],
      [ids.recipesSearchIngredientInput, classes.searchInput],
      [ids.recipesNutritionName, classes.recipesNutritionName],
      [ids.recipesNutritionMin, classes.recipesNutritionMin],
      [ids.recipesNutritionMinValue, classes.recipesNutritionMinValue],
      [ids.recipesNutritionMax, classes.recipesNutritionMax],
      [ids.recipesNutritionMaxValue, classes.recipesNutritionMaxValue],
      [ids.recipesSearchControls, classes.recipesSearchControls],
      [ids.recipesSearchInputs, classes.recipesSearchInputs],
      [ids.recipesSearchNameContainer, classes.recipesSearchInputName],
      [
        ids.recipesSearchIngredientContainer,
        classes.recipesSearchInputIngredient,
      ],
      [
        ids.recipesSearchNutritionContainer,
        classes.recipesSearchInputNutrition,
      ],
      [ids.recipesNutritionNameRow, classes.recipesNutritionRow],
      [ids.recipesNutritionModeRow, classes.recipesNutritionRow],
      [ids.recipesNutritionModeRow, classes.recipesNutritionMode],
      [ids.recipesNutritionValues, classes.recipesNutritionValues],
      [ids.recipesRecipeCardsContainer, classes.recipeCards],
    ];

    mappings.forEach(([idValue, className]) => {
      if (!idValue || !className) return;
      const element = rootElement.querySelector(`#${CSS.escape(idValue)}`);
      if (element && !element.classList.contains(className)) {
        element.classList.add(className);
        appliedCount += 1;
      }
    });

    // Apply classes for elements that do not have dedicated ids but
    // still need structural classes for messaging and layout.
    const typeGroup = rootElement.querySelector(
      `#${CSS.escape(ids.recipesSearchTypeGroup || 'recipes-search-type-group')}`,
    );
    if (typeGroup && classes.recipesSearchTypeGroup) {
      typeGroup.classList.add(classes.recipesSearchTypeGroup);
      structuralAppliedCount += 1;
    }

    // Nutrition mode label span inside the nutrition mode row.
    if (ids.recipesNutritionModeRow && classes.recipesNutritionModeLabel) {
      const modeRow = rootElement.querySelector(
        `#${CSS.escape(ids.recipesNutritionModeRow)}`,
      );
      const modeLabelSpan = modeRow ? modeRow.querySelector('span') : null;
      if (modeLabelSpan) {
        modeLabelSpan.classList.add(classes.recipesNutritionModeLabel);
        structuralAppliedCount += 1;
      }
    }

    this.log(
      'applyRecipesClasses',
      'info',
      'recipesPage.applyRecipesClasses: Applied classes to Recipes page controls',
      {
        appliedCount,
        structuralAppliedCount,
      },
    );

    return this.log(
      'applyRecipesClasses',
      'passthroughMethodComplete',
      undefined,
    );
  }

  async loadRecipeCards(config, filters = null) {
    this.log(
      'loadRecipeCards',
      'lifecycle',
      'recipesPage.loadRecipeCards: Starting...',
      { filters },
    );
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

    try {
      const api = this.recipeApi;
      if (!api) {
        this.log(
          'attachRecipesEventListeners',
          'info',
          'RecipesPage.ensureRecipesLoaded: No RecipeApi instance available',
        );
        return;
      }
      const dataset = await api.fetchRecipesDataset(config);
      const profile = this.profile;

      // State: Populate shared recipes collection from the fetched dataset.
      Recipes.populateRecipes(dataset);

      // State: Use shared recipes collection as the in-memory filter source.
      let recipeModels = Recipes.getAll();

      // State: Apply current search filters to in-memory recipes.
      recipeModels = Recipes.filter(recipeModels, filters);

      this.log(
        'loadRecipeCards',
        'info',
        'recipesPage.loadRecipeCards: Rendering recipe cards:',
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
        'RecipesPage.loadRecipeCards: Error loading recipe cards',
        error,
      );
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
        // State: Show a fallback error message when recipes fail to load.
        messageElement.textContent = errorMessage;
        // State: Replace existing recipe cards with the error message.
        recipeCardContainer.innerHTML = '';
        recipeCardContainer.appendChild(messageElement);
      }
    }
  }

  showIngredientDetail(config, overlay, recipe, ingredient) {
    this.log(
      'showIngredientDetail',
      'methodStart',
      'recipesPage.showIngredientDetail: Starting',
      {
        recipeId: recipe?.id,
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
              'RecipesPage.showIngredientDetail: Site.applyAttributes not available, skipping attribute application',
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
      logPrefix: 'recipesPage',
      scale: 1,
      elementAttrs,
      applyAttrs,
    });

    return this.log(
      'showIngredientDetail',
      'passthroughMethodComplete',
      undefined,
    );
  }

  showNutritionDetail(config, overlay, recipe) {
    this.log(
      'showNutritionDetail',
      'methodStart',
      'recipesPage.showNutritionDetail: Starting',
      { recipeId: recipe?.id },
    );
    // State: Swap visible sections to nutrition detail within the overlay.
    Main.showNutritionDetail(config, {
      overlay,
      recipe,
      pageInstance: this,
      logPrefix: 'recipesPage',
    });

    return this.log(
      'showNutritionDetail',
      'passthroughMethodComplete',
      undefined,
    );
  }

  showRecipeDetail(config, recipe) {
    this.log(
      'showRecipeDetail',
      'methodStart',
      'recipesPage.showRecipeDetail: Starting',
      { id: recipe?.id, title: recipe?.title },
    );
    this.log(
      'showRecipeDetail',
      'lifecycle',
      'recipesPage.showRecipeDetail: Starting',
      { id: recipe?.id, title: recipe?.title },
    );

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

    const profile = this.profile;

    // State: Render recipe detail overlay and hide underlying recipe cards.
    Main.renderRecipeDetailOverlay(config, {
      pageInstance: this,
      logPrefix: 'recipesPage',
      recipe,
      cardContainer: recipeCardContainer,
      contentWrapper,
      detailTemplate,
      ingredientTemplate,
      nutritionTemplate,
      profile,
      scale: 1,
      elementAttrs,
      applyAttrs:
        site && typeof site.applyAttributes === 'function'
          ? site.applyAttributes.bind(site)
          : (element, attrs) => {
              this.log(
                'showRecipeDetail',
                'info',
                'RecipesPage.showRecipeDetail: Site.applyAttributes not available, skipping attribute application',
                {
                  hasElement: !!element,
                  hasAttrs: !!attrs,
                  hasSite: !!site,
                },
              );
            },
    });

    return this.log('showRecipeDetail', 'passthroughMethodComplete', undefined);
  }

  syncFavoriteButtonsForRecipe(recipeId) {
    this.log(
      'syncFavoriteButtonsForRecipe',
      'methodStart',
      'recipesPage.syncFavoriteButtonsForRecipe: Starting',
      { recipeId },
    );

    if (recipeId == null) {
      return this.log(
        'syncFavoriteButtonsForRecipe',
        'passthroughMethodComplete',
        undefined,
        {
          toLogValue: () => ({
            reason:
              'recipesPage.syncFavoriteButtonsForRecipe: Missing recipeId',
          }),
        },
      );
    }

    const idString = String(recipeId);
    const profile = this.profile;
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
    const buttonCount = buttons.length;
    buttons.forEach((button) => {
      this.updateFavoriteButtonState(button, isFavorite);
    });

    this.log(
      'syncFavoriteButtonsForRecipe',
      'info',
      'recipesPage.syncFavoriteButtonsForRecipe: Synced favorite buttons for recipe',
      {
        recipeId,
        buttonCount,
        isFavorite,
      },
    );

    return this.log(
      'syncFavoriteButtonsForRecipe',
      'passthroughMethodComplete',
      undefined,
    );
  }

  updateFavoriteButtonState(button, isFavorite) {
    this.log(
      'updateFavoriteButtonState',
      'methodStart',
      'recipesPage.updateFavoriteButtonState: Starting',
      {
        hasButton: !!button,
        isFavorite: !!isFavorite,
      },
    );

    if (!button) {
      return this.log(
        'updateFavoriteButtonState',
        'passthroughMethodComplete',
        undefined,
        {
          toLogValue: () => ({
            reason: 'recipesPage.updateFavoriteButtonState: No button provided',
            isFavorite: !!isFavorite,
          }),
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
      'recipesPage.updateFavoriteButtonState: Updated favorite button state',
      {
        isFavorite: !!isFavorite,
        className: button.className,
      },
    );

    return this.log(
      'updateFavoriteButtonState',
      'passthroughMethodComplete',
      undefined,
    );
  }

  // log: Delegates logging to the shared Logger using RecipesPage conventions.
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
}

bootLogger.moduleClassLoaded(import.meta.url, 'RecipesPage');

Logger.instrumentClass(RecipesPage, 'RecipesPage');

export { RecipesPage };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
