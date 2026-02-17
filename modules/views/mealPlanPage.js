import { bootLogger } from '../models/bootLogger.js';

import { Logger } from '../models/logger.js';
import { Site } from './site.js';
import { Meal, MealPlan, meals, Profile } from '../models/mealPlan.js';
import { ShoppingList, Inventory } from '../models/shoppingList.js';
import { Storage } from '../models/storage.js';
import { recipes, Recipes } from '../models/recipes.js';
import { RecipeApi } from '../models/apiAccess.js';
import { Main } from './main.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(import.meta.url, 'Defines MealPlanPage');

// Meal Plan page controller: configures profile-based meal plans,
// renders day/meal grids, and manages plan generation.
// Usage: const page = new MealPlanPage(config, { logger }); page.init(config);
class MealPlanPage {
  // constructor: Creates the MealPlanPage controller and optionally initializes.
  constructor(config = null, options = {}) {
    Object.defineProperties(this, MealPlanPage.descriptors);
    this.logger = options.logger || null;
    this.log(
      'constructor',
      'objectCreateStart',
      'MealPlanPage.constructor: Starting',
    );
    this.config = config;
    this.profile = Profile.getInstance();
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
    // Immediately initialize after construction
    if (config) {
      this.init(config);
    }
  }

  // init: Builds the initial Meal Plan page view model from the template.
  init(config) {
    if (this.initialized && this.view) {
      // State: Reuse existing MealPlanPage view model when already initialized.
      return this.log('init', 'passthroughMethodComplete', this.view, {
        toLogValue: (page) => ({
          title: page.title,
          hasContent: !!page.content,
        }),
      });
    }

    this.log('init', 'objectInitStart', 'MealPlanPage.init: Starting');
    // State: Capture the latest MealPlanPage configuration on the instance.
    this.config = config;
    const template = document.getElementById(config.ids.templates.mealPlanPage);
    if (!template) {
      const errorResult = { title: config.titles.errorPage, content: '' };
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
    // State: Mark MealPlanPage as initialized.
    this.initialized = true;
    this.log('init', 'objectInitComplete', 'MealPlanPage.init: Completed');
    this.log('init', 'info', 'MealPlanPage.init: MealPlanPage initialized');
    const result = {
      title: config.titles.mealPlanPage,
      content: template.innerHTML,
    };
    // State: Cache the rendered MealPlanPage view model.
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

  // log: Delegates logging to the shared Logger using MealPlanPage conventions.
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

  applyMealPlanClasses(config, rootElement) {
    if (!config || !config.classes || !config.ids || !rootElement) return;

    const { classes, ids } = config;

    const mappings = [
      [ids.mealPlanGenerateButton, classes.mealPlanGenerateBtn],
      [ids.mealPlanSaveButton, classes.mealPlanSaveBtn],
      [ids.mealPlanLoadButton, classes.mealPlanLoadBtn],
      [ids.mealPlanToShoppingButton, classes.mealPlanToShoppingBtn],
      [ids.mealPlanUsePantryButton, classes.mealPlanUsePantryBtn],
      [ids.mealPlanDaysSelect, classes.mealPlanDays],
      [ids.mealPlanPeopleInput, classes.mealPlanPeople],
      [ids.mealPlanMealsPerDayInput, classes.mealPlanMealsPerDay],
      [ids.mealPlanPeopleDecrementButton, classes.mealPlanPeopleDecrement],
      [ids.mealPlanPeopleIncrementButton, classes.mealPlanPeopleIncrement],
      [
        ids.mealPlanMealsPerDayDecrementButton,
        classes.mealPlanMealsPerDayDecrement,
      ],
      [
        ids.mealPlanMealsPerDayIncrementButton,
        classes.mealPlanMealsPerDayIncrement,
      ],
      [ids.mealPlanPageSection, classes.mealPlanPage],
      [ids.mealPlanHeader, classes.mealPlanHeader],
      [ids.mealPlanControls, classes.mealPlanControls],
      [ids.mealPlanCaloriesLabel, classes.mealPlanCaloriesLabel],
      [ids.mealPlanCalories, classes.mealPlanCalories],
      [ids.mealPlanCalorieGrid, classes.mealPlanCalorieGrid],
      [ids.mealPlanCalorieGridHeader, classes.mealPlanCalorieGridHeader],
      [ids.mealPlanCalorieGridRows, classes.mealPlanCalorieGridRows],
      [ids.mealPlanCalorieGridControls, classes.mealPlanCalorieGridControls],
      [ids.mealPlanSummarySection, classes.mealPlanSummarySection],
      [ids.mealPlanSummaryHint, classes.mealPlanSummaryHint],
      [ids.mealPlanGrid, classes.mealPlanGrid],
      [ids.mealPlanActions, classes.mealPlanActions],
    ];

    mappings.forEach(([idValue, className]) => {
      if (!idValue || !className) return;
      const element = rootElement.querySelector(`#${CSS.escape(idValue)}`);
      if (element && !element.classList.contains(className)) {
        element.classList.add(className);
      }
    });
  }

  // afterRender: Wires Meal Plan events and restores state after render.
  afterRender(config) {
    this.log(
      'afterRender',
      'lifecycle',
      'mealPlanPage.afterRender: Starting afterRender lifecycle hook',
    );
    this.log(
      'afterRender',
      'functionStart',
      'MealPlanPage.afterRender: Attaching event listeners and restoring state',
    );
    const mainElement = document.querySelector(`.${config.classes.main}`);
    if (mainElement) {
      this.applyMealPlanClasses(config, mainElement);
    }
    this.attachMealPlanEventListeners(config);
    if (mainElement && config.titles) {
      const summaryHeading = mainElement.querySelector(
        '.meal-plan-summary-section h3',
      );
      if (summaryHeading && config.titles.mealPlanSummary) {
        summaryHeading.textContent = config.titles.mealPlanSummary;
      }
    }
    if (mainElement && config.messages) {
      const mealPlanMessages = config.messages.mealPlan || null;
      const sharedMessages = config.messages.shared || null;

      if (mealPlanMessages) {
        const headerIntro = mainElement.querySelector('.meal-plan-header p');
        if (headerIntro && mealPlanMessages.intro) {
          headerIntro.textContent = mealPlanMessages.intro;
        }

        const daysLabel = mainElement.querySelector(
          'label[for="meal-plan-days"]',
        );
        if (daysLabel && mealPlanMessages.daysLabel) {
          daysLabel.textContent = mealPlanMessages.daysLabel;
        }

        const daysSelect = mainElement.querySelector('#meal-plan-days');
        if (daysSelect) {
          const option1 = daysSelect.querySelector('option[value="1"]');
          const option3 = daysSelect.querySelector('option[value="3"]');
          const option5 = daysSelect.querySelector('option[value="5"]');
          const option7 = daysSelect.querySelector('option[value="7"]');
          if (option1 && mealPlanMessages.daysOption1) {
            option1.textContent = mealPlanMessages.daysOption1;
          }
          if (option3 && mealPlanMessages.daysOption3) {
            option3.textContent = mealPlanMessages.daysOption3;
          }
          if (option5 && mealPlanMessages.daysOption5) {
            option5.textContent = mealPlanMessages.daysOption5;
          }
          if (option7 && mealPlanMessages.daysOption7) {
            option7.textContent = mealPlanMessages.daysOption7;
          }
        }

        const caloriesLabel = mainElement.querySelector(
          '.meal-plan-calories-label',
        );
        if (caloriesLabel && mealPlanMessages.caloriesLabel) {
          caloriesLabel.textContent = mealPlanMessages.caloriesLabel;
        }

        const peopleLabel = mainElement.querySelector(
          'label[for="meal-plan-people"]',
        );
        if (peopleLabel && mealPlanMessages.peopleLabel) {
          peopleLabel.textContent = mealPlanMessages.peopleLabel;
        }

        const mealsPerDayLabel = mainElement.querySelector(
          'label[for="meal-plan-meals-per-day"]',
        );
        if (mealsPerDayLabel && mealPlanMessages.mealsPerDayLabel) {
          mealsPerDayLabel.textContent = mealPlanMessages.mealsPerDayLabel;
        }

        const calorieGridHeader = mainElement.querySelector(
          '.meal-plan-calorie-grid-header span',
        );
        if (calorieGridHeader && mealPlanMessages.calorieGridHeader) {
          calorieGridHeader.textContent = mealPlanMessages.calorieGridHeader;
        }

        const generateButton = mainElement.querySelector(
          `#${CSS.escape(config.ids.mealPlanGenerateButton)}`,
        );
        if (generateButton && mealPlanMessages.generateButton) {
          generateButton.textContent = mealPlanMessages.generateButton;
        }

        const summaryHint = mainElement.querySelector(
          '.meal-plan-summary-hint',
        );
        if (summaryHint && mealPlanMessages.summaryHint) {
          summaryHint.textContent = mealPlanMessages.summaryHint;
        }

        const saveButton = mainElement.querySelector(
          `#${CSS.escape(config.ids.mealPlanSaveButton)}`,
        );
        if (saveButton && mealPlanMessages.saveButton) {
          saveButton.textContent = mealPlanMessages.saveButton;
        }

        const loadButton = mainElement.querySelector(
          `#${CSS.escape(config.ids.mealPlanLoadButton)}`,
        );
        if (loadButton && mealPlanMessages.loadButton) {
          loadButton.textContent = mealPlanMessages.loadButton;
        }

        const buildShoppingButton = mainElement.querySelector(
          `#${CSS.escape(config.ids.mealPlanToShoppingButton)}`,
        );
        if (buildShoppingButton && mealPlanMessages.buildShoppingButton) {
          buildShoppingButton.textContent =
            mealPlanMessages.buildShoppingButton;
        }

        const usePantryButton = mainElement.querySelector(
          `#${CSS.escape(config.ids.mealPlanUsePantryButton)}`,
        );
        if (usePantryButton && mealPlanMessages.usePantryButton) {
          usePantryButton.textContent = mealPlanMessages.usePantryButton;
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
              '.recipe-detail-nutrition-btn',
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
      'functionComplete',
      'MealPlanPage.afterRender: Completed afterRender lifecycle hook',
    );
  }

  // buildRecipesForMeal: Selects recipes for a meal given profile targets.
  buildRecipesForMeal(
    targetCaloriesPerPerson,
    usedRecipeIdsForCurrentPlan = null,
  ) {
    const method = 'buildRecipesForMeal';

    this.log(
      method,
      'functionStart',
      'MealPlanPage.buildRecipesForMeal: Starting',
      {
        targetCaloriesPerPerson,
        usedRecipeIdsForCurrentPlanSize:
          usedRecipeIdsForCurrentPlan instanceof Set
            ? usedRecipeIdsForCurrentPlan.size
            : null,
      },
    );
    const availableCount = Array.isArray(recipes) ? recipes.length : 0;

    if (availableCount === 0) {
      this.log(method, 'info', 'No recipes available to build meal');
      this.log(
        method,
        'functionComplete',
        'MealPlanPage.buildRecipesForMeal: Completed (no recipes available)',
      );
      return [];
    }

    const selected = MealPlan.buildRecipesForMeal({
      recipesCollection: recipes,
      profile: this.profile,
      targetCaloriesPerPerson,
      usedRecipeIdsForCurrentPlan,
    });

    this.log(method, 'info', 'Built recipes for meal', {
      targetCaloriesPerPerson,
      totalSelected: Array.isArray(selected) ? selected.length : 0,
    });

    this.log(
      method,
      'functionComplete',
      'MealPlanPage.buildRecipesForMeal: Completed selection',
      {
        selectedRecipeIds: Array.isArray(selected)
          ? selected.map((r) => r && r.id).filter((id) => id)
          : [],
      },
    );

    return selected;
  }

  showRecipeDetail(config, recipe) {
    const method = 'showRecipeDetail';
    this.log(method, 'lifecycle', 'MealPlanPage.showRecipeDetail: Starting', {
      id: recipe?.id,
      title: recipe?.title,
    });

    const mainElement = document.querySelector(`.${config.classes.main}`);
    if (!mainElement) return;

    const recipeCardContainer = mainElement.querySelector(
      `.${config.classes.mealPlanGrid}`,
    );

    const contentWrapper = mainElement.querySelector(
      `.${config.classes.mainContentWrapper}`,
    );

    let detailTemplate = contentWrapper
      ? contentWrapper.querySelector(
          `#${CSS.escape(config.ids.templates.recipeDetail)}`,
        )
      : null;
    if (!detailTemplate) {
      detailTemplate = document.getElementById(
        config.ids.templates.recipeDetail,
      );
    }
    if (!detailTemplate) {
      this.log(
        method,
        'info',
        'MealPlanPage.showRecipeDetail: No detail template found',
      );
      return;
    }

    const ingredientTemplate = contentWrapper
      ? contentWrapper.querySelector(
          `#${CSS.escape(config.ids.templates.ingredientDetail)}`,
        )
      : document.getElementById(config.ids.templates.ingredientDetail);
    const nutritionTemplate = contentWrapper
      ? contentWrapper.querySelector(
          `#${CSS.escape(config.ids.templates.nutritionDetail)}`,
        )
      : document.getElementById(config.ids.templates.nutritionDetail);

    const peopleCount =
      typeof this.profile?.mealPlanPeopleCount === 'number' &&
      this.profile.mealPlanPeopleCount > 0
        ? this.profile.mealPlanPeopleCount
        : null;
    const baseServings =
      typeof recipe?.servings === 'number' && recipe.servings > 0
        ? recipe.servings
        : null;
    const scale =
      baseServings && peopleCount && peopleCount > 0
        ? peopleCount / baseServings
        : 1;

    const sharedMessages =
      this.config && this.config.messages
        ? this.config.messages.shared || null
        : null;
    const notAvailable =
      sharedMessages && sharedMessages.notAvailable
        ? sharedMessages.notAvailable
        : '';

    const ready =
      typeof recipe?.readyInMinutes === 'number'
        ? `${recipe.readyInMinutes} min`
        : notAvailable;
    const servingsValue = peopleCount || baseServings || notAvailable;
    const likes =
      typeof recipe?.likes === 'number' && Number.isFinite(recipe.likes)
        ? recipe.likes
        : 0;

    let metaText = `Ready in ${ready} · Serves ${servingsValue}`;
    if (peopleCount && baseServings && peopleCount !== baseServings) {
      metaText += ` (scaled from ${baseServings})`;
    }
    metaText += ` · ${likes} likes`;

    // State: Build configured attributes to apply to detail overlay controls.
    const elementAttrs = Site.buildElementAttributes(config);
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

    const buildIngredientLabel = (ingredient, { scale: scaleArg }) => {
      const baseAmount =
        typeof ingredient.amount === 'number' &&
        Number.isFinite(ingredient.amount)
          ? ingredient.amount
          : null;
      const scaledAmount =
        baseAmount != null && scaleArg && Number.isFinite(scaleArg)
          ? baseAmount * scaleArg
          : baseAmount;
      const amountText = MealPlan.formatScaledAmount(scaledAmount);
      const unit = ingredient.unitLong || ingredient.unit || '';
      const name = ingredient.name || ingredient.originalString || '';
      const parts = [];
      if (amountText) parts.push(amountText);
      if (unit) parts.push(unit);
      if (name) parts.push(name);
      return parts.join(' ');
    };

    // State: Render scaled recipe detail overlay and hide meal plan grid.
    Main.renderRecipeDetailOverlay(config, {
      pageInstance: this,
      logPrefix: 'MealPlanPage',
      recipe,
      cardContainer: recipeCardContainer,
      contentWrapper,
      detailTemplate,
      ingredientTemplate,
      nutritionTemplate,
      profile: this.profile,
      scale,
      metaTextOverride: metaText,
      buildIngredientLabel,
      elementAttrs,
      applyAttrs,
    });
  }

  showIngredientDetail(config, overlay, recipe, ingredient, scale = 1) {
    // State: Build configured attributes for ingredient detail controls.
    const elementAttrs = Site.buildElementAttributes(config);
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

    // State: Swap visible sections to ingredient detail within the overlay.
    Main.showIngredientDetail(config, {
      overlay,
      recipe,
      ingredient,
      pageInstance: this,
      logPrefix: 'MealPlanPage',
      scale,
      formatScaledAmount: MealPlan.formatScaledAmount,
      elementAttrs,
      applyAttrs,
    });
  }

  showNutritionDetail(config, overlay, recipe) {
    // State: Swap visible sections to nutrition detail within the overlay.
    Main.showNutritionDetail(config, {
      overlay,
      recipe,
      pageInstance: this,
      logPrefix: 'MealPlanPage',
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
              if (!element || !attrs) return;
              Object.entries(attrs).forEach(([name, value]) => {
                if (value === false || value == null) {
                  element.removeAttribute(name);
                } else {
                  element.setAttribute(name, String(value));
                }
              });
            };

      // State: Apply configured attributes to nutrition close button.
      applyAttrs(closeButton, elementAttrs.nutritionDetailClose);
    }
  }

  syncFavoriteButtonsForRecipe(recipeId) {
    if (recipeId == null) return;

    const idString = String(recipeId);
    const isFavorite = Array.isArray(this.profile.favoriteRecipeIds)
      ? this.profile.favoriteRecipeIds.includes(recipeId)
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
  }

  updateFavoriteButtonState(button, isFavorite) {
    if (!button) return;
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
  }

  attachMealPlanEventListeners(config) {
    const mainElement = document.querySelector(`.${config.classes.main}`);
    if (!mainElement) return;

    this.log(
      'attachMealPlanEventListeners',
      'lifecycle',
      'MealPlanPage.attachMealPlanEventListeners: Starting wiring controls',
    );

    const daysSelect = mainElement.querySelector(
      `#${CSS.escape(config.ids.mealPlanDaysSelect)}`,
    );
    const caloriesPerDayDisplay = mainElement.querySelector(
      '.meal-plan-calories',
    );
    const peopleInput = mainElement.querySelector(
      `#${CSS.escape(config.ids.mealPlanPeopleInput)}`,
    );
    const mealsPerDayInput = mainElement.querySelector(
      `#${CSS.escape(config.ids.mealPlanMealsPerDayInput)}`,
    );
    const calorieGridRows = mainElement.querySelector(
      '.meal-plan-calorie-grid-rows',
    );
    const caloriesAllMealsInput = mainElement.querySelector(
      '.meal-plan-calories-all-meals',
    );
    const caloriesApplyAllBtn = mainElement.querySelector(
      '.meal-plan-calories-apply-all',
    );
    const peopleDecrement = mainElement.querySelector(
      `#${CSS.escape(config.ids.mealPlanPeopleDecrementButton)}`,
    );
    const peopleIncrement = mainElement.querySelector(
      `#${CSS.escape(config.ids.mealPlanPeopleIncrementButton)}`,
    );
    const mealsPerDayDecrement = mainElement.querySelector(
      `#${CSS.escape(config.ids.mealPlanMealsPerDayDecrementButton)}`,
    );
    const mealsPerDayIncrement = mainElement.querySelector(
      `#${CSS.escape(config.ids.mealPlanMealsPerDayIncrementButton)}`,
    );
    const generateMealPlanButton = mainElement.querySelector(
      `#${CSS.escape(config.ids.mealPlanGenerateButton)}`,
    );
    const saveMealPlanButton = mainElement.querySelector(
      `#${CSS.escape(config.ids.mealPlanSaveButton)}`,
    );
    const loadSavedMealPlanButton = mainElement.querySelector(
      `#${CSS.escape(config.ids.mealPlanLoadButton)}`,
    );
    const buildShoppingListButton = mainElement.querySelector(
      `#${CSS.escape(config.ids.mealPlanToShoppingButton)}`,
    );
    const usePantryButton = mainElement.querySelector(
      `#${CSS.escape(config.ids.mealPlanUsePantryButton)}`,
    );

    const storage = Storage.getInstance();
    const sharedShoppingList = ShoppingList.getInstance();
    const sharedInventory = Inventory.getInstance();

    const getMealPlanMessages = () =>
      this.config && this.config.messages
        ? this.config.messages.mealPlan || null
        : null;

    const elementAttrs = Site.buildElementAttributes(config);
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

    if (peopleDecrement && elementAttrs.mealPlanPeopleDecrement) {
      applyAttrs(peopleDecrement, elementAttrs.mealPlanPeopleDecrement);
    }
    if (peopleIncrement && elementAttrs.mealPlanPeopleIncrement) {
      applyAttrs(peopleIncrement, elementAttrs.mealPlanPeopleIncrement);
    }
    if (mealsPerDayDecrement && elementAttrs.mealPlanMealsPerDayDecrement) {
      applyAttrs(
        mealsPerDayDecrement,
        elementAttrs.mealPlanMealsPerDayDecrement,
      );
    }
    if (mealsPerDayIncrement && elementAttrs.mealPlanMealsPerDayIncrement) {
      applyAttrs(
        mealsPerDayIncrement,
        elementAttrs.mealPlanMealsPerDayIncrement,
      );
    }

    let mealNames = [];
    let personNames = [];

    if (this.profile) {
      if (peopleInput) {
        peopleInput.value =
          typeof this.profile.mealPlanPeopleCount === 'number' &&
          this.profile.mealPlanPeopleCount > 0
            ? String(this.profile.mealPlanPeopleCount)
            : '';
      }
      if (mealsPerDayInput) {
        mealsPerDayInput.value =
          typeof this.profile.mealPlanMealsPerDay === 'number' &&
          this.profile.mealPlanMealsPerDay > 0
            ? String(this.profile.mealPlanMealsPerDay)
            : '';
      }
      if (peopleInput && (!peopleInput.value || peopleInput.value === '0')) {
        peopleInput.value = '1';
        this.profile.setMealPlanSpec({ peopleCount: 1 });
      }

      if (
        mealsPerDayInput &&
        (!mealsPerDayInput.value || mealsPerDayInput.value === '0')
      ) {
        mealsPerDayInput.value = '1';
        this.profile.setMealPlanSpec({ mealsPerDay: 1 });
      }
    }

    const renderSummaryGridFromMeals = () => {
      const method = 'renderSummaryGridFromMeals';

      const summaryGrid = mainElement.querySelector(
        `.${config.classes.mealPlanGrid}`,
      );

      this.log(
        method,
        'functionStart',
        `MealPlanPage.renderSummaryGridFromMeals: Starting (hasMainElement=${!!mainElement}, hasSummaryGrid=${!!summaryGrid}, mealsLength=${
          Array.isArray(meals) ? meals.length : 'null'
        })`,
      );

      if (!summaryGrid || !Array.isArray(meals)) {
        this.log(
          method,
          'functionComplete',
          'MealPlanPage.renderSummaryGridFromMeals: Aborted - missing summaryGrid or meals',
        );
        return;
      }

      summaryGrid.innerHTML = '';

      const mealsByDay = new Map();
      meals.forEach((meal) => {
        const dayIndexValue =
          meal && typeof meal.dayIndex === 'number' && meal.dayIndex >= 0
            ? meal.dayIndex
            : 0;
        if (!mealsByDay.has(dayIndexValue)) {
          mealsByDay.set(dayIndexValue, []);
        }
        mealsByDay.get(dayIndexValue).push(meal);
      });

      const sortedDays = Array.from(mealsByDay.keys()).sort((a, b) => a - b);

      this.log(
        method,
        'functionStart',
        `MealPlanPage.renderSummaryGridFromMeals: Grouped meals by day (dayCount=${sortedDays.length})`,
      );

      sortedDays.forEach((dayIndexValue) => {
        const dayContainer = document.createElement('section');
        dayContainer.className = config.classes.mealPlanDay;

        const heading = document.createElement('h4');
        const mealPlanMessagesHeading =
          this.config && this.config.messages
            ? this.config.messages.mealPlan || null
            : null;
        const headingTemplate =
          mealPlanMessagesHeading &&
          typeof mealPlanMessagesHeading.summaryDayHeadingTemplate === 'string'
            ? mealPlanMessagesHeading.summaryDayHeadingTemplate
            : null;
        const dayIndexDisplay = dayIndexValue + 1;
        heading.textContent =
          headingTemplate && headingTemplate.includes('{index}')
            ? headingTemplate.replace('{index}', String(dayIndexDisplay))
            : String(dayIndexDisplay);
        dayContainer.appendChild(heading);

        const mealsForDay = mealsByDay.get(dayIndexValue) || [];

        mealsForDay.forEach((meal) => {
          const mealSection = document.createElement('section');
          mealSection.classList.add('meal-plan-meal');

          const mealTitle = document.createElement('h5');
          const mealPlanMessages =
            this.config && this.config.messages
              ? this.config.messages.mealPlan || null
              : null;
          const mealLabel =
            meal && meal.name
              ? meal.name
              : mealPlanMessages && mealPlanMessages.mealLabel
                ? mealPlanMessages.mealLabel
                : '';
          mealTitle.textContent = mealLabel;
          mealSection.appendChild(mealTitle);

          const recipesForMeal =
            meal && Array.isArray(meal.recipesForMeal)
              ? meal.recipesForMeal
              : [];

          if (!recipesForMeal || recipesForMeal.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.classList.add('meal-plan-meal-empty');
            const mealPlanMessages =
              this.config && this.config.messages
                ? this.config.messages.mealPlan || null
                : null;
            emptyMessage.textContent =
              mealPlanMessages && mealPlanMessages.noRecipesForMeal
                ? mealPlanMessages.noRecipesForMeal
                : '';
            mealSection.appendChild(emptyMessage);
          } else {
            const cardsContainer = document.createElement('div');
            cardsContainer.classList.add(
              'meal-plan-meal-cards',
              'recipe-cards',
            );

            const contentWrapper = mainElement.querySelector(
              `.${config.classes.mainContentWrapper}`,
            );
            let cardTemplate = contentWrapper
              ? contentWrapper.querySelector(
                  `#${CSS.escape(config.ids.templates.recipeCard)}`,
                )
              : null;
            let cardWrapperTemplate = contentWrapper
              ? contentWrapper.querySelector(
                  `#${CSS.escape(config.ids.templates.recipeCardWrapper)}`,
                )
              : null;

            if (!cardTemplate) {
              cardTemplate = document.getElementById(
                config.ids.templates.recipeCard,
              );
            }
            if (!cardWrapperTemplate) {
              cardWrapperTemplate = document.getElementById(
                config.ids.templates.recipeCardWrapper,
              );
            }

            recipesForMeal.forEach((recipe) => {
              if (!recipe || !cardTemplate || !cardWrapperTemplate) {
                return;
              }

              const wrapperFragment =
                cardWrapperTemplate.content.cloneNode(true);
              let wrapper = wrapperFragment.firstElementChild;
              if (!wrapper) {
                wrapper = document.createElement('div');
              }
              if (config.classes.recipeCard) {
                wrapper.classList.add(config.classes.recipeCard);
              }
              wrapper.classList.add('meal-plan-recipe-card');

              const cardClone = cardTemplate.content.cloneNode(true);

              const img = cardClone.querySelector(
                `.${config.classes.recipeCardImage}`,
              );
              const titleEl = cardClone.querySelector(
                `.${config.classes.recipeCardTitle}`,
              );
              const descriptionEl = cardClone.querySelector(
                `.${config.classes.recipeCardDescription}`,
              );
              const favoriteButton = cardClone.querySelector(
                '.recipe-favorite-toggle',
              );

              if (img) {
                img.src = recipe.image || '';
                const sharedMessages =
                  this.config && this.config.messages
                    ? this.config.messages.shared || null
                    : null;
                const imageAltFallback =
                  sharedMessages && sharedMessages.recipeImageAltFallback
                    ? sharedMessages.recipeImageAltFallback
                    : '';
                if (recipe.title) {
                  img.alt = recipe.title;
                } else if (imageAltFallback) {
                  img.alt = imageAltFallback;
                } else {
                  img.removeAttribute('alt');
                }
              }

              if (titleEl) {
                titleEl.textContent = recipe.title || '';
              }

              if (descriptionEl) {
                const sharedMessages =
                  this.config && this.config.messages
                    ? this.config.messages.shared || null
                    : null;
                const notAvailable =
                  sharedMessages && sharedMessages.notAvailable
                    ? sharedMessages.notAvailable
                    : '';
                const ready =
                  typeof recipe.readyInMinutes === 'number'
                    ? `${recipe.readyInMinutes} min`
                    : notAvailable;
                const servings =
                  typeof recipe.servings === 'number' && recipe.servings > 0
                    ? recipe.servings
                    : notAvailable;
                descriptionEl.textContent = `Ready in ${ready} · Serves ${servings}`;
              }

              if (
                favoriteButton &&
                recipe &&
                recipe.id != null &&
                this.profile
              ) {
                favoriteButton.dataset.recipeId = String(recipe.id);
                const isFavorite = Array.isArray(this.profile.favoriteRecipeIds)
                  ? this.profile.favoriteRecipeIds.includes(recipe.id)
                  : false;
                this.updateFavoriteButtonState(favoriteButton, isFavorite);
                favoriteButton.addEventListener('click', (event) => {
                  event.stopPropagation();
                  const currentlyFavorite = Array.isArray(
                    this.profile.favoriteRecipeIds,
                  )
                    ? this.profile.favoriteRecipeIds.includes(recipe.id)
                    : false;
                  if (currentlyFavorite) {
                    this.profile.removeFavoriteRecipe(recipe.id);
                  } else {
                    this.profile.addFavoriteRecipe(recipe.id);
                  }
                  const nowFavorite = !currentlyFavorite;
                  this.syncFavoriteButtonsForRecipe(recipe.id);
                  this.log(
                    'renderSummaryGridFromMeals',
                    'info',
                    'MealPlanPage.renderSummaryGridFromMeals: Toggled favorite from meal plan card',
                    { id: recipe.id, title: recipe.title, nowFavorite },
                  );
                });
              }

              wrapper.addEventListener('click', () => {
                this.showRecipeDetail(this.config, recipe);
              });

              wrapper.appendChild(cardClone);
              cardsContainer.appendChild(wrapper);
            });

            mealSection.appendChild(cardsContainer);
          }

          dayContainer.appendChild(mealSection);
        });

        summaryGrid.appendChild(dayContainer);
      });

      this.log(
        method,
        'functionComplete',
        `MealPlanPage.renderSummaryGridFromMeals: Completed (summaryChildCount=${summaryGrid.childElementCount})`,
      );
    };

    const restoreMealPlanFromSession = () => {
      if (!Array.isArray(meals) || meals.length > 0) {
        return;
      }

      const storedPlanData =
        storage && typeof storage.loadMealPlan === 'function'
          ? storage.loadMealPlan()
          : null;
      if (!storedPlanData || !Array.isArray(storedPlanData.mealsForPlan)) {
        return;
      }

      meals.splice(0, meals.length);
      storedPlanData.mealsForPlan.forEach((mealData) => {
        meals.push(new Meal(mealData));
      });

      if (typeof MealPlan === 'function') {
        const restoredPlan = new MealPlan(storedPlanData);
        MealPlan.setCurrentMealPlan(restoredPlan);
      }

      if (
        daysSelect &&
        typeof storedPlanData.days === 'number' &&
        Number.isFinite(storedPlanData.days) &&
        storedPlanData.days > 0
      ) {
        daysSelect.value = String(storedPlanData.days);
      }

      if (
        mealsPerDayInput &&
        typeof storedPlanData.mealsPerDay === 'number' &&
        Number.isFinite(storedPlanData.mealsPerDay) &&
        storedPlanData.mealsPerDay > 0
      ) {
        mealsPerDayInput.value = String(storedPlanData.mealsPerDay);
      }

      renderSummaryGridFromMeals();
    };

    const saveMealPlanPageStateToSession = () => {
      if (!storage || typeof storage.saveMealPlanState !== 'function') {
        return;
      }

      const rawDays = daysSelect ? daysSelect.value : '';
      const parsedDays = rawDays === '' ? NaN : Number.parseInt(rawDays, 10);
      const days =
        Number.isNaN(parsedDays) || parsedDays <= 0 ? null : parsedDays;

      const rawPeopleValue = peopleInput ? peopleInput.value : '';
      const parsedPeople =
        rawPeopleValue === '' ? NaN : Number.parseInt(rawPeopleValue, 10);
      const peopleCount =
        Number.isNaN(parsedPeople) || parsedPeople <= 0 ? null : parsedPeople;

      const rawMealsValue = mealsPerDayInput ? mealsPerDayInput.value : '';
      const parsedMeals =
        rawMealsValue === '' ? NaN : Number.parseInt(rawMealsValue, 10);
      const mealsPerDay =
        Number.isNaN(parsedMeals) || parsedMeals <= 0 ? null : parsedMeals;

      const currentPersonNames = [];
      const currentMealNames = [];

      if (calorieGridRows) {
        const personInputs = calorieGridRows.querySelectorAll(
          `.${config.classes.mealPlanPersonName}`,
        );
        personInputs.forEach((input, index) => {
          if (input instanceof HTMLInputElement) {
            currentPersonNames[index] = input.value || '';
          }
        });

        const mealInputs = calorieGridRows.querySelectorAll(
          '.meal-plan-calorie-meal-row .meal-plan-meal-name',
        );
        mealInputs.forEach((input, index) => {
          if (input instanceof HTMLInputElement) {
            currentMealNames[index] = input.value || '';
          }
        });
      }

      const slots =
        this.profile && Array.isArray(this.profile.mealPlanCaloriesPerMealSlots)
          ? this.profile.mealPlanCaloriesPerMealSlots
          : [];

      storage.saveMealPlanState({
        days,
        peopleCount,
        mealsPerDay,
        personNames: currentPersonNames,
        mealNames: currentMealNames,
        caloriesPerMealSlots: slots,
      });
    };

    const restoreMealPlanPageStateFromSession = () => {
      if (!storage || typeof storage.loadMealPlanState !== 'function') {
        return;
      }

      const state = storage.loadMealPlanState();
      if (!state || typeof state !== 'object') {
        return;
      }

      const {
        days,
        peopleCount,
        mealsPerDay,
        personNames: savedPersonNames,
        mealNames: savedMealNames,
        caloriesPerMealSlots,
      } = state;

      if (
        daysSelect &&
        typeof days === 'number' &&
        Number.isFinite(days) &&
        days > 0
      ) {
        daysSelect.value = String(days);
      }

      if (
        peopleInput &&
        typeof peopleCount === 'number' &&
        Number.isFinite(peopleCount) &&
        peopleCount > 0
      ) {
        peopleInput.value = String(peopleCount);
      }

      if (
        mealsPerDayInput &&
        typeof mealsPerDay === 'number' &&
        Number.isFinite(mealsPerDay) &&
        mealsPerDay > 0
      ) {
        mealsPerDayInput.value = String(mealsPerDay);
      }

      if (Array.isArray(savedPersonNames) && savedPersonNames.length > 0) {
        personNames = savedPersonNames.slice();
      }

      if (Array.isArray(savedMealNames) && savedMealNames.length > 0) {
        mealNames = savedMealNames.slice();
      }

      if (
        this.profile &&
        Array.isArray(caloriesPerMealSlots) &&
        caloriesPerMealSlots.length > 0
      ) {
        this.profile.setMealPlanSpec({
          caloriesPerMealSlots,
        });
      }
    };

    const renderCalorieGridRows = () => {
      if (!calorieGridRows) return;

      mealNames = [];
      personNames = [];
      const existingPersonNameInputs = calorieGridRows.querySelectorAll(
        '.meal-plan-person-name',
      );
      existingPersonNameInputs.forEach((input, index) => {
        if (input instanceof HTMLInputElement && input.value.trim() !== '') {
          personNames[index] = input.value;
        }
      });
      const existingMealRows = calorieGridRows.querySelectorAll(
        '.meal-plan-calorie-meal-row',
      );
      existingMealRows.forEach((row, index) => {
        const nameInput = row.querySelector(
          `.${config.classes.mealPlanMealName}`,
        );
        if (nameInput && nameInput.value.trim() !== '') {
          mealNames[index] = nameInput.value;
        } else {
          const firstCell = row.querySelector('td');
          if (firstCell && firstCell.textContent) {
            const label = firstCell.textContent.trim();
            if (label) {
              mealNames[index] = label;
            }
          }
        }
      });

      calorieGridRows.innerHTML = '';

      const rawMealsValue = mealsPerDayInput ? mealsPerDayInput.value : '';
      const parsedMeals =
        rawMealsValue === '' ? NaN : Number.parseInt(rawMealsValue, 10);
      const mealsPerDay =
        Number.isNaN(parsedMeals) || parsedMeals <= 0 ? null : parsedMeals;
      const rawPeopleValue = peopleInput ? peopleInput.value : '';
      const parsedPeople =
        rawPeopleValue === '' ? NaN : Number.parseInt(rawPeopleValue, 10);
      const peopleCount =
        Number.isNaN(parsedPeople) || parsedPeople <= 0 ? 1 : parsedPeople;

      if (!mealsPerDay) {
        if (caloriesPerDayDisplay) {
          caloriesPerDayDisplay.textContent = '';
        }
        return;
      }

      const slots =
        this.profile && Array.isArray(this.profile.mealPlanCaloriesPerMealSlots)
          ? this.profile.mealPlanCaloriesPerMealSlots
          : [];
      const table = document.createElement('table');
      table.className = config.classes.mealPlanCalorieTable;
      if (peopleCount === 1) {
        table.classList.add('meal-plan-calorie-table-single-person');
      }

      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      headerRow.className = config.classes.mealPlanCalorieGridHeader;

      const mealHeaderCell = document.createElement('th');
      const mealPlanMessagesHeader =
        this.config && this.config.messages
          ? this.config.messages.mealPlan || null
          : null;
      const caloriesHeader =
        mealPlanMessagesHeader &&
        typeof mealPlanMessagesHeader.calorieGridCaloriesHeader === 'string'
          ? mealPlanMessagesHeader.calorieGridCaloriesHeader
          : '';
      const personHeader =
        mealPlanMessagesHeader &&
        typeof mealPlanMessagesHeader.calorieGridPersonHeader === 'string'
          ? mealPlanMessagesHeader.calorieGridPersonHeader
          : '';
      const sumHeader =
        mealPlanMessagesHeader &&
        typeof mealPlanMessagesHeader.calorieGridSumHeader === 'string'
          ? mealPlanMessagesHeader.calorieGridSumHeader
          : '';
      const valueHeader =
        mealPlanMessagesHeader &&
        typeof mealPlanMessagesHeader.calorieGridValueHeader === 'string'
          ? mealPlanMessagesHeader.calorieGridValueHeader
          : '';
      const actionHeader =
        mealPlanMessagesHeader &&
        typeof mealPlanMessagesHeader.calorieGridActionHeader === 'string'
          ? mealPlanMessagesHeader.calorieGridActionHeader
          : '';
      const personValueHeader =
        mealPlanMessagesHeader &&
        typeof mealPlanMessagesHeader.calorieGridPersonValueHeader === 'string'
          ? mealPlanMessagesHeader.calorieGridPersonValueHeader
          : '';
      const sharedMessages =
        this.config && this.config.messages
          ? this.config.messages.shared || null
          : null;
      const caloriePlaceholder =
        (sharedMessages && sharedMessages.calorieInputPlaceholder) ||
        'e.g. 600';

      mealHeaderCell.textContent = caloriesHeader;
      mealHeaderCell.classList.add(
        'meal-plan-calorie-grid-primary-header-cell',
      );
      headerRow.appendChild(mealHeaderCell);

      for (let personIndex = 0; personIndex < peopleCount; personIndex += 1) {
        const headerCell = document.createElement('th');

        headerCell.classList.add('meal-plan-calorie-grid-primary-header-cell');

        if (peopleCount === 1) {
          // Single person: show static label, not editable
          headerCell.textContent = personHeader;
        } else {
          // Multiple people: allow naming each person
          const personInput = document.createElement('input');
          personInput.type = 'text';
          personInput.className = config.classes.mealPlanPersonName;
          const defaultLabel = `Person ${personIndex + 1}`;
          personInput.placeholder = defaultLabel;
          const savedName =
            Array.isArray(personNames) && personNames[personIndex]
              ? personNames[personIndex]
              : '';
          personInput.value = savedName || defaultLabel;
          headerCell.appendChild(personInput);
        }

        headerRow.appendChild(headerCell);
      }

      if (peopleCount > 1) {
        const sumHeaderCell = document.createElement('th');
        sumHeaderCell.textContent = sumHeader;
        sumHeaderCell.classList.add('meal-plan-calorie-grid-sum-column-header');
        headerRow.appendChild(sumHeaderCell);

        const valueHeaderCell = document.createElement('th');
        valueHeaderCell.textContent = valueHeader;
        valueHeaderCell.classList.add(
          'meal-plan-calorie-grid-value-column-header',
        );
        headerRow.appendChild(valueHeaderCell);

        const actionHeaderCell = document.createElement('th');
        actionHeaderCell.textContent = actionHeader;
        actionHeaderCell.classList.add(
          'meal-plan-calorie-grid-action-column-header',
        );
        headerRow.appendChild(actionHeaderCell);
      }

      thead.appendChild(headerRow);
      table.appendChild(thead);

      const tbody = document.createElement('tbody');

      for (let mealIndex = 0; mealIndex < mealsPerDay; mealIndex += 1) {
        const row = document.createElement('tr');
        row.className = `${config.classes.mealPlanCalorieGridRow} ${config.classes.mealPlanCalorieMealRow}`;

        const mealLabelCell = document.createElement('th');
        mealLabelCell.scope = 'row';
        mealLabelCell.classList.add('meal-plan-calorie-grid-meal-header-cell');

        if (mealsPerDay === 1) {
          const mealPlanMessagesRow =
            this.config && this.config.messages
              ? this.config.messages.mealPlan || null
              : null;
          const mealLabel =
            mealPlanMessagesRow && mealPlanMessagesRow.mealLabel
              ? mealPlanMessagesRow.mealLabel
              : '';
          mealLabelCell.textContent = mealLabel;
        } else {
          const mealNameInput = document.createElement('input');
          mealNameInput.type = 'text';
          mealNameInput.className = config.classes.mealPlanMealName;
          mealNameInput.placeholder = `Meal ${mealIndex + 1}`;
          const savedName =
            Array.isArray(mealNames) && mealNames[mealIndex]
              ? mealNames[mealIndex]
              : '';
          mealNameInput.value = savedName || `Meal ${mealIndex + 1}`;
          mealLabelCell.appendChild(mealNameInput);
        }

        row.appendChild(mealLabelCell);

        let rowTotal = 0;

        for (let personIndex = 0; personIndex < peopleCount; personIndex += 1) {
          const cell = document.createElement('td');
          cell.classList.add('meal-plan-calorie-grid-person-cell');

          const input = document.createElement('input');
          input.type = 'number';
          input.inputMode = 'numeric';
          input.min = '0';
          input.step = '25';
          input.placeholder = caloriePlaceholder;
          input.className = config.classes.mealPlanCaloriesMeal;
          input.dataset.mealIndex = String(mealIndex);
          input.dataset.personIndex = String(personIndex);

          const flatIndex = mealIndex * peopleCount + personIndex;
          const existing =
            typeof slots[flatIndex] === 'number' && slots[flatIndex] > 0
              ? slots[flatIndex]
              : null;
          if (existing != null) {
            input.value = String(existing);
            rowTotal += existing;
          }

          cell.appendChild(input);
          row.appendChild(cell);
        }

        if (peopleCount > 1) {
          const sumCell = document.createElement('td');
          sumCell.classList.add('meal-plan-calorie-grid-sum-column-cell');
          const sumDisplay = document.createElement('span');
          sumDisplay.className = config.classes.mealPlanCaloriesRowSum;
          sumDisplay.dataset.mealIndex = String(mealIndex);
          sumDisplay.textContent = String(rowTotal);
          sumCell.appendChild(sumDisplay);
          row.appendChild(sumCell);

          const valueCell = document.createElement('td');
          valueCell.classList.add('meal-plan-calorie-grid-value-column-cell');
          const rowValueInput = document.createElement('input');
          rowValueInput.type = 'number';
          rowValueInput.inputMode = 'numeric';
          rowValueInput.min = '0';
          rowValueInput.step = '25';
          rowValueInput.placeholder = caloriePlaceholder;
          rowValueInput.className = config.classes.mealPlanCaloriesRowValue;
          rowValueInput.dataset.mealIndex = String(mealIndex);
          valueCell.appendChild(rowValueInput);
          row.appendChild(valueCell);

          const actionCell = document.createElement('td');
          actionCell.classList.add('meal-plan-calorie-grid-action-column-cell');
          const rowControls = document.createElement('div');
          rowControls.className = config.classes.mealPlanCalorieGridRowControls;

          const rowApplyButton = document.createElement('button');
          rowApplyButton.type = 'button';
          rowApplyButton.className = config.classes.mealPlanCaloriesApplyRow;
          rowApplyButton.dataset.mealIndex = String(mealIndex);
          rowApplyButton.textContent = '←';
          const rowApplyAria =
            mealPlanMessagesHeader &&
            typeof mealPlanMessagesHeader.calorieRowApplyAria === 'string'
              ? mealPlanMessagesHeader.calorieRowApplyAria
              : null;
          if (rowApplyAria) {
            rowApplyButton.setAttribute('aria-label', rowApplyAria);
          }

          const rowDistributeButton = document.createElement('button');
          rowDistributeButton.type = 'button';
          rowDistributeButton.className =
            config.classes.mealPlanCaloriesDistributeRow;
          rowDistributeButton.dataset.mealIndex = String(mealIndex);
          rowDistributeButton.textContent = '✴';
          const rowDistributeAria =
            mealPlanMessagesHeader &&
            typeof mealPlanMessagesHeader.calorieRowDistributeAria === 'string'
              ? mealPlanMessagesHeader.calorieRowDistributeAria
              : null;
          if (rowDistributeAria) {
            rowDistributeButton.setAttribute('aria-label', rowDistributeAria);
          }

          rowControls.appendChild(rowApplyButton);
          rowControls.appendChild(rowDistributeButton);
          actionCell.appendChild(rowControls);
          row.appendChild(actionCell);
        }

        tbody.appendChild(row);
      }

      if (mealsPerDay && mealsPerDay > 1) {
        const columnTotals = new Array(peopleCount).fill(0);
        for (let personIndex = 0; personIndex < peopleCount; personIndex += 1) {
          let total = 0;
          for (let mealIndex = 0; mealIndex < mealsPerDay; mealIndex += 1) {
            const flatIndex = mealIndex * peopleCount + personIndex;
            const value = slots[flatIndex];
            if (typeof value === 'number' && value > 0) {
              total += value;
            }
          }
          columnTotals[personIndex] = total;
        }

        const sumRow = document.createElement('tr');
        sumRow.className =
          'meal-plan-calorie-grid-row meal-plan-calorie-grid-person-sum-row';

        const sumLabelCell = document.createElement('th');
        sumLabelCell.scope = 'row';
        sumLabelCell.textContent = sumHeader;
        sumRow.appendChild(sumLabelCell);

        for (let personIndex = 0; personIndex < peopleCount; personIndex += 1) {
          const cell = document.createElement('td');
          cell.className = config.classes.mealPlanCalorieGridPersonActionCell;
          cell.classList.add('meal-plan-calorie-grid-person-cell');

          const sumDisplay = document.createElement('span');
          sumDisplay.className = config.classes.mealPlanCaloriesPersonSum;
          sumDisplay.dataset.personIndex = String(personIndex);
          const total = columnTotals[personIndex];
          sumDisplay.textContent = String(total);

          cell.appendChild(sumDisplay);
          sumRow.appendChild(cell);
        }

        if (peopleCount > 1) {
          const sumRowSumCell = document.createElement('td');
          sumRowSumCell.classList.add('meal-plan-calorie-grid-sum-column-cell');
          sumRowSumCell.textContent = '';
          sumRow.appendChild(sumRowSumCell);

          const sumRowValueCell = document.createElement('td');
          sumRowValueCell.classList.add(
            'meal-plan-calorie-grid-value-column-cell',
          );
          sumRowValueCell.textContent = '';
          sumRow.appendChild(sumRowValueCell);

          const sumRowActionCell = document.createElement('td');
          sumRowActionCell.classList.add(
            'meal-plan-calorie-grid-action-column-cell',
          );
          sumRowActionCell.textContent = '';
          sumRow.appendChild(sumRowActionCell);
        }

        tbody.appendChild(sumRow);

        const valueRow = document.createElement('tr');
        valueRow.className =
          'meal-plan-calorie-grid-row meal-plan-calorie-grid-person-value-row';

        const valueLabelCell = document.createElement('th');
        valueLabelCell.scope = 'row';
        valueLabelCell.classList.add('meal-plan-calorie-grid-value-row-header');
        valueLabelCell.textContent = personValueHeader;
        valueRow.appendChild(valueLabelCell);

        for (let personIndex = 0; personIndex < peopleCount; personIndex += 1) {
          const cell = document.createElement('td');

          const input = document.createElement('input');
          input.type = 'number';
          input.inputMode = 'numeric';
          input.min = '0';
          input.step = '25';
          input.placeholder = caloriePlaceholder;
          input.className = config.classes.mealPlanCaloriesPersonValue;
          input.dataset.personIndex = String(personIndex);

          cell.appendChild(input);
          valueRow.appendChild(cell);
        }

        if (peopleCount > 1) {
          const valueRowSumCell = document.createElement('td');
          valueRowSumCell.classList.add(
            'meal-plan-calorie-grid-sum-column-cell',
          );
          valueRowSumCell.textContent = '';
          valueRow.appendChild(valueRowSumCell);

          const valueRowValueCell = document.createElement('td');
          valueRowValueCell.classList.add(
            'meal-plan-calorie-grid-value-column-cell',
          );
          const globalValueInput = document.createElement('input');
          globalValueInput.type = 'number';
          globalValueInput.inputMode = 'numeric';
          globalValueInput.min = '0';
          globalValueInput.step = '25';
          globalValueInput.placeholder = caloriePlaceholder;
          globalValueInput.className =
            config.classes.mealPlanCaloriesGlobalValue;
          valueRowValueCell.appendChild(globalValueInput);
          valueRow.appendChild(valueRowValueCell);

          const valueRowActionCell = document.createElement('td');
          valueRowActionCell.classList.add(
            'meal-plan-calorie-grid-action-column-cell',
          );
          valueRowActionCell.textContent = '';
          valueRow.appendChild(valueRowActionCell);
        }

        tbody.appendChild(valueRow);

        const actionRow = document.createElement('tr');
        actionRow.className =
          'meal-plan-calorie-grid-row meal-plan-calorie-grid-person-action-row';

        const actionLabelCell = document.createElement('th');
        actionLabelCell.scope = 'row';
        actionLabelCell.classList.add(
          'meal-plan-calorie-grid-action-row-header',
        );
        const personActionHeader =
          mealPlanMessagesHeader &&
          typeof mealPlanMessagesHeader.caloriePersonActionHeader === 'string'
            ? mealPlanMessagesHeader.caloriePersonActionHeader
            : '';
        actionLabelCell.textContent = personActionHeader;
        actionRow.appendChild(actionLabelCell);

        for (let personIndex = 0; personIndex < peopleCount; personIndex += 1) {
          const cell = document.createElement('td');
          cell.className = config.classes.mealPlanCalorieGridPersonActionCell;

          const controls = document.createElement('div');
          controls.className =
            config.classes.mealPlanCalorieGridPersonActionControls;

          const applyButton = document.createElement('button');
          applyButton.type = 'button';
          applyButton.className = config.classes.mealPlanCaloriesApplyPerson;
          applyButton.dataset.personIndex = String(personIndex);
          applyButton.textContent = '↑';
          const personApplyAria =
            mealPlanMessagesHeader &&
            typeof mealPlanMessagesHeader.caloriePersonApplyAria === 'string'
              ? mealPlanMessagesHeader.caloriePersonApplyAria
              : null;
          if (personApplyAria) {
            applyButton.setAttribute('aria-label', personApplyAria);
          }

          const distributeButton = document.createElement('button');
          distributeButton.type = 'button';
          distributeButton.className =
            config.classes.mealPlanCaloriesDistributePerson;
          distributeButton.dataset.personIndex = String(personIndex);
          distributeButton.textContent = '✴';
          const personDistributeAria =
            mealPlanMessagesHeader &&
            typeof mealPlanMessagesHeader.caloriePersonDistributeAria ===
              'string'
              ? mealPlanMessagesHeader.caloriePersonDistributeAria
              : null;
          if (personDistributeAria) {
            distributeButton.setAttribute('aria-label', personDistributeAria);
          }

          controls.appendChild(applyButton);
          controls.appendChild(distributeButton);
          cell.appendChild(controls);
          actionRow.appendChild(cell);
        }

        if (peopleCount > 1) {
          const actionRowSumCell = document.createElement('td');
          actionRowSumCell.classList.add(
            'meal-plan-calorie-grid-sum-column-cell',
          );
          actionRowSumCell.textContent = '';
          actionRow.appendChild(actionRowSumCell);

          const actionRowValueCell = document.createElement('td');
          actionRowValueCell.classList.add(
            'meal-plan-calorie-grid-value-column-cell',
          );
          actionRowValueCell.textContent = '';
          actionRow.appendChild(actionRowValueCell);

          // Inverted coordinate (1,1): global action buttons that operate
          // on all per-person, per-meal cells summed by cell (3,3).
          const actionRowActionCell = document.createElement('td');
          const globalControls = document.createElement('div');
          globalControls.className =
            'meal-plan-calorie-grid-person-action-controls';

          const globalApplyButton = document.createElement('button');
          globalApplyButton.type = 'button';
          globalApplyButton.className =
            config.classes.mealPlanCaloriesApplyGlobal;
          // Diagonal arrow from bottom-right to top-left
          globalApplyButton.textContent = '↖';
          const globalApplyAria =
            mealPlanMessagesHeader &&
            typeof mealPlanMessagesHeader.calorieGlobalApplyAria === 'string'
              ? mealPlanMessagesHeader.calorieGlobalApplyAria
              : null;
          if (globalApplyAria) {
            globalApplyButton.setAttribute('aria-label', globalApplyAria);
          }

          const globalDistributeButton = document.createElement('button');
          globalDistributeButton.type = 'button';
          globalDistributeButton.className =
            'meal-plan-calories-distribute-global';
          globalDistributeButton.textContent = '✴';
          const globalDistributeAria =
            mealPlanMessagesHeader &&
            typeof mealPlanMessagesHeader.calorieGlobalDistributeAria ===
              'string'
              ? mealPlanMessagesHeader.calorieGlobalDistributeAria
              : null;
          if (globalDistributeAria) {
            globalDistributeButton.setAttribute(
              'aria-label',
              globalDistributeAria,
            );
          }

          globalControls.appendChild(globalApplyButton);
          globalControls.appendChild(globalDistributeButton);
          actionRowActionCell.appendChild(globalControls);
          actionRow.appendChild(actionRowActionCell);
        }

        tbody.appendChild(actionRow);
      }

      table.appendChild(tbody);

      const debugRows = table.querySelectorAll('tr');
      const totalRows = debugRows.length;
      debugRows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('th, td');
        const totalCols = cells.length;
        cells.forEach((cell, colIndex) => {
          if (!(cell instanceof HTMLElement)) return;
          const hasChildElements = cell.children && cell.children.length > 0;

          // Only initialize the special 3,3 sum cell; no more debug coordinates.
          if (!hasChildElements && !cell.textContent) {
            const displayRow = totalRows - rowIndex;
            const displayCol = totalCols - colIndex;

            // If this is cell 3,3 (bottom row, third column from right), show the sum of all per-person, per-meal cell values.
            if (displayRow === 3 && displayCol === 3) {
              // Find all .meal-plan-calories-meal inputs in the table and sum their numeric values.
              let total = 0;
              const mealInputs = table.querySelectorAll(
                '.meal-plan-calories-meal',
              );
              mealInputs.forEach((input) => {
                if (input instanceof HTMLInputElement) {
                  const val = Number.parseFloat(input.value);
                  if (Number.isFinite(val) && val > 0) {
                    total += val;
                  }
                }
              });
              cell.textContent = String(total);
            }
          }
        });
      });

      calorieGridRows.appendChild(table);

      // Add live update for the sum cell at inverted 3,3
      const updateSumCell = () => {
        const debugRows = table.querySelectorAll('tr');
        const totalRows = debugRows.length;
        debugRows.forEach((row, rowIndex) => {
          const cells = row.querySelectorAll('th, td');
          const totalCols = cells.length;
          cells.forEach((cell, colIndex) => {
            const hasChildElements = cell.children && cell.children.length > 0;
            const displayRow = totalRows - rowIndex;
            const displayCol = totalCols - colIndex;
            if (!hasChildElements && displayRow === 3 && displayCol === 3) {
              let total = 0;
              const mealInputs = table.querySelectorAll(
                '.meal-plan-calories-meal',
              );
              mealInputs.forEach((input) => {
                if (input instanceof HTMLInputElement) {
                  const val = Number.parseFloat(input.value);
                  if (Number.isFinite(val) && val > 0) {
                    total += val;
                  }
                }
              });
              cell.textContent = String(total);
            }
          });
        });
      };

      // Attach change listeners to all meal inputs
      const mealInputs = table.querySelectorAll(
        `.${config.classes.mealPlanCaloriesMeal}`,
      );
      mealInputs.forEach((input) => {
        if (input instanceof HTMLInputElement) {
          input.addEventListener('input', updateSumCell);
        }
      });
    };

    const updateCaloriesFromGrid = () => {
      if (!this.profile || !calorieGridRows) return;

      const rawPeopleValue = peopleInput ? peopleInput.value : '';
      const parsedPeople =
        rawPeopleValue === '' ? NaN : Number.parseInt(rawPeopleValue, 10);
      const peopleCount =
        Number.isNaN(parsedPeople) || parsedPeople <= 0 ? 1 : parsedPeople;

      const rows = calorieGridRows.querySelectorAll(
        '.meal-plan-calorie-meal-row',
      );
      const slots2d = [];

      rows.forEach((row) => {
        const rowSlots = new Array(peopleCount).fill(null);
        for (let personIndex = 0; personIndex < peopleCount; personIndex += 1) {
          const cell = row.querySelector(
            `.meal-plan-calories-meal[data-person-index="${personIndex}"]`,
          );
          if (cell instanceof HTMLInputElement) {
            const raw = cell.value;
            if (raw !== '') {
              const parsed = Number.parseFloat(raw);
              if (
                typeof parsed === 'number' &&
                Number.isFinite(parsed) &&
                parsed > 0
              ) {
                rowSlots[personIndex] = parsed;
              }
            }
          }
        }
        slots2d.push(rowSlots);
      });

      const flatSlots = slots2d.flat();

      const perPersonTotals = new Array(peopleCount).fill(0);
      const perRowTotals = slots2d.map((rowSlots) => {
        let rowTotal = 0;
        rowSlots.forEach((value, personIndex) => {
          if (typeof value === 'number' && value > 0) {
            perPersonTotals[personIndex] += value;
            rowTotal += value;
          }
        });
        return rowTotal;
      });

      const totalAllPersons = perPersonTotals.reduce(
        (sum, value) => sum + value,
        0,
      );
      const activePersons = perPersonTotals.filter((value) => value > 0).length;
      const divisor = activePersons > 0 ? activePersons : peopleCount;
      const averagePerPerson =
        totalAllPersons > 0 && divisor > 0 ? totalAllPersons / divisor : null;

      this.profile.setMealPlanSpec({
        caloriesPerPersonPerDay:
          averagePerPerson != null && Number.isFinite(averagePerPerson)
            ? averagePerPerson
            : null,
        caloriesPerMealSlots: flatSlots,
      });

      if (caloriesPerDayDisplay) {
        if (
          averagePerPerson != null &&
          Number.isFinite(averagePerPerson) &&
          averagePerPerson > 0
        ) {
          caloriesPerDayDisplay.textContent = String(
            Math.round(averagePerPerson),
          );
        } else {
          caloriesPerDayDisplay.textContent = '';
        }
      }

      if (calorieGridRows) {
        const sumDisplays = calorieGridRows.querySelectorAll(
          '.meal-plan-calories-person-sum',
        );
        sumDisplays.forEach((element) => {
          if (!(element instanceof HTMLElement)) return;
          const indexAttr = element.dataset.personIndex;
          const personIndex =
            typeof indexAttr === 'string'
              ? Number.parseInt(indexAttr, 10)
              : NaN;
          if (Number.isNaN(personIndex) || personIndex < 0) {
            element.textContent = '';
            return;
          }
          const total =
            personIndex < perPersonTotals.length
              ? perPersonTotals[personIndex]
              : 0;
          element.textContent = String(total);
        });

        const rowSumDisplays = calorieGridRows.querySelectorAll(
          '.meal-plan-calories-row-sum',
        );
        rowSumDisplays.forEach((element) => {
          if (!(element instanceof HTMLElement)) return;
          const indexAttr = element.dataset.mealIndex;
          const mealIndex =
            typeof indexAttr === 'string'
              ? Number.parseInt(indexAttr, 10)
              : NaN;
          if (Number.isNaN(mealIndex) || mealIndex < 0) {
            element.textContent = '';
            return;
          }
          const total =
            mealIndex < perRowTotals.length ? perRowTotals[mealIndex] : 0;
          element.textContent = String(total);
        });
      }

      this.log(
        'attachMealPlanEventListeners',
        'info',
        'Updated meal plan calories from grid',
        {
          caloriesPerPersonPerDay: this.profile.mealPlanCaloriesPerPersonPerDay,
          slotsCount: flatSlots.length,
        },
      );
    };

    const updateSpecFromInputs = () => {
      if (!this.profile) return;

      const peopleRaw = peopleInput ? peopleInput.value : undefined;
      const mealsRaw = mealsPerDayInput ? mealsPerDayInput.value : undefined;

      this.profile.setMealPlanSpec({
        peopleCount: peopleRaw === '' ? null : peopleRaw,
        mealsPerDay: mealsRaw === '' ? null : mealsRaw,
      });

      this.log(
        'attachMealPlanEventListeners',
        'info',
        'Updated meal plan spec from controls',
        {
          peopleCount: this.profile.mealPlanPeopleCount,
          mealsPerDay: this.profile.mealPlanMealsPerDay,
          caloriesPerPersonPerDay: this.profile.mealPlanCaloriesPerPersonPerDay,
        },
      );

      renderCalorieGridRows();
      saveMealPlanPageStateToSession();
    };

    const inputs = [daysSelect, peopleInput, mealsPerDayInput];

    inputs.forEach((input) => {
      if (!input) return;
      input.addEventListener('change', updateSpecFromInputs);
      if (input.tagName === 'INPUT') {
        input.addEventListener('blur', updateSpecFromInputs);
      }
    });

    if (calorieGridRows) {
      calorieGridRows.addEventListener('change', (event) => {
        const target = event.target;
        if (
          target instanceof HTMLInputElement &&
          target.classList.contains('meal-plan-calories-meal')
        ) {
          updateCaloriesFromGrid();
        }
      });

      calorieGridRows.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLButtonElement)) {
          return;
        }

        const isApplyRow = target.classList.contains(
          'meal-plan-calories-apply-row',
        );
        const isDistributeRow = target.classList.contains(
          'meal-plan-calories-distribute-row',
        );

        if (!isApplyRow && !isDistributeRow) {
          return;
        }

        const mealIndexAttr = target.dataset.mealIndex;
        const mealIndex =
          typeof mealIndexAttr === 'string'
            ? Number.parseInt(mealIndexAttr, 10)
            : NaN;
        if (Number.isNaN(mealIndex) || mealIndex < 0) return;

        const row = target.closest('.meal-plan-calorie-grid-row');
        if (!row) return;

        const valueInput = row.querySelector(
          `.${config.classes.mealPlanCaloriesRowValue}`,
        );
        if (!(valueInput instanceof HTMLInputElement)) return;

        const raw = valueInput.value;
        if (raw === '') return;
        const parsed = Number.parseFloat(raw);
        if (!Number.isFinite(parsed) || parsed <= 0) return;

        const rawPeopleValue = peopleInput ? peopleInput.value : '';
        const parsedPeople =
          rawPeopleValue === '' ? NaN : Number.parseInt(rawPeopleValue, 10);
        const peopleCount =
          Number.isNaN(parsedPeople) || parsedPeople <= 0 ? 1 : parsedPeople;

        if (isApplyRow) {
          for (
            let personIndex = 0;
            personIndex < peopleCount;
            personIndex += 1
          ) {
            const cell = row.querySelector(
              `.meal-plan-calories-meal[data-person-index="${personIndex}"]`,
            );
            if (cell instanceof HTMLInputElement) {
              cell.value = String(parsed);
            }
          }
        } else if (isDistributeRow) {
          if (peopleCount <= 0) return;
          const perPersonValue = parsed / peopleCount;
          for (
            let personIndex = 0;
            personIndex < peopleCount;
            personIndex += 1
          ) {
            const cell = row.querySelector(
              `.meal-plan-calories-meal[data-person-index="${personIndex}"]`,
            );
            if (cell instanceof HTMLInputElement) {
              cell.value = String(perPersonValue);
            }
          }
        }

        updateCaloriesFromGrid();
      });
    }

    if (caloriesApplyAllBtn && caloriesAllMealsInput && calorieGridRows) {
      caloriesApplyAllBtn.addEventListener('click', () => {
        const raw = caloriesAllMealsInput.value;
        if (raw === '') {
          return;
        }
        const parsed = Number.parseFloat(raw);
        const value =
          typeof parsed === 'number' && Number.isFinite(parsed) && parsed > 0
            ? String(parsed)
            : '';

        const slotInputs = calorieGridRows.querySelectorAll(
          '.meal-plan-calories-meal',
        );
        slotInputs.forEach((input) => {
          input.value = value;
        });

        updateCaloriesFromGrid();
      });
    }

    if (calorieGridRows) {
      calorieGridRows.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLButtonElement)) {
          return;
        }

        const isApplyColumn = target.classList.contains(
          'meal-plan-calories-apply-person',
        );
        const isDistributeColumn = target.classList.contains(
          'meal-plan-calories-distribute-person',
        );

        if (!isApplyColumn && !isDistributeColumn) {
          return;
        }

        const personIndexAttr = target.dataset.personIndex;
        const personIndex =
          typeof personIndexAttr === 'string'
            ? Number.parseInt(personIndexAttr, 10)
            : NaN;
        if (Number.isNaN(personIndex) || personIndex < 0) return;

        const rawMealsValue = mealsPerDayInput ? mealsPerDayInput.value : '';
        const parsedMeals =
          rawMealsValue === '' ? NaN : Number.parseInt(rawMealsValue, 10);
        const mealsPerDay =
          Number.isNaN(parsedMeals) || parsedMeals <= 0 ? 0 : parsedMeals;
        if (mealsPerDay <= 0) return;

        const valueInput = calorieGridRows.querySelector(
          `.meal-plan-calories-person-value[data-person-index="${personIndex}"]`,
        );
        if (!(valueInput instanceof HTMLInputElement)) return;

        const raw = valueInput.value;
        if (raw === '') return;
        const parsed = Number.parseFloat(raw);
        if (!Number.isFinite(parsed) || parsed <= 0) return;

        if (!calorieGridRows) return;

        if (isApplyColumn) {
          const columnInputs = calorieGridRows.querySelectorAll(
            `.meal-plan-calories-meal[data-person-index="${personIndex}"]`,
          );
          columnInputs.forEach((input) => {
            if (input instanceof HTMLInputElement) {
              input.value = String(parsed);
            }
          });
        } else if (isDistributeColumn) {
          const perMealValue = parsed / mealsPerDay;
          const columnInputs = calorieGridRows.querySelectorAll(
            `.meal-plan-calories-meal[data-person-index="${personIndex}"]`,
          );
          columnInputs.forEach((input) => {
            if (input instanceof HTMLInputElement) {
              input.value = String(perMealValue);
            }
          });
        }

        updateCaloriesFromGrid();
      });

      // Global controls in cell (1,1): operate on all meal cells
      calorieGridRows.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLButtonElement)) {
          return;
        }

        const isApplyGlobal = target.classList.contains(
          'meal-plan-calories-apply-global',
        );
        const isDistributeGlobal = target.classList.contains(
          'meal-plan-calories-distribute-global',
        );

        if (!isApplyGlobal && !isDistributeGlobal) {
          return;
        }

        if (!calorieGridRows) return;

        const valueInput = calorieGridRows.querySelector(
          '.meal-plan-calories-global-value',
        );
        if (!(valueInput instanceof HTMLInputElement)) return;

        const raw = valueInput.value;
        if (raw === '') return;
        const parsed = Number.parseFloat(raw);
        if (!Number.isFinite(parsed) || parsed <= 0) return;

        const slotInputs = calorieGridRows.querySelectorAll(
          '.meal-plan-calories-meal',
        );
        if (slotInputs.length === 0) return;

        if (isApplyGlobal) {
          slotInputs.forEach((input) => {
            if (input instanceof HTMLInputElement) {
              input.value = String(parsed);
            }
          });
        } else if (isDistributeGlobal) {
          const perCellValue = parsed / slotInputs.length;
          slotInputs.forEach((input) => {
            if (input instanceof HTMLInputElement) {
              input.value = String(perCellValue);
            }
          });
        }

        updateCaloriesFromGrid();

        // Trigger an input event on one cell so the (3,3) sum cell updates
        const firstInput = slotInputs[0];
        if (firstInput instanceof HTMLInputElement) {
          firstInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    }

    const ensureRecipesLoaded = async () => {
      if (Array.isArray(recipes) && recipes.length > 0) {
        this.log(
          'attachMealPlanEventListeners',
          'functionComplete',
          'MealPlanPage.ensureRecipesLoaded: Recipes already loaded',
          {
            recipeCount: recipes.length,
          },
        );
        return;
      }

      try {
        const api = RecipeApi.getInstance();
        const dataset = await api.fetchRecipesDataset(config);
        Recipes.populateRecipes(dataset);
        this.log(
          'attachMealPlanEventListeners',
          'info',
          'MealPlanPage.ensureRecipesLoaded: Recipes dataset loaded for meal plan generation',
          {
            recipeCount: Array.isArray(recipes) ? recipes.length : 0,
          },
        );
        this.log(
          'attachMealPlanEventListeners',
          'functionComplete',
          'MealPlanPage.ensureRecipesLoaded: Completed load',
          {
            recipeCount: Array.isArray(recipes) ? recipes.length : 0,
          },
        );
      } catch (error) {
        this.log(
          'attachMealPlanEventListeners',
          'info',
          'MealPlanPage.ensureRecipesLoaded: Failed to load recipes dataset',
          {
            errorMessage:
              error && typeof error.message === 'string'
                ? error.message
                : String(error),
          },
        );
      }
    };

    const generateMealPlanFromGrid = async () => {
      this.log(
        'generateMealPlanFromGrid',
        'functionStart',
        'MealPlanPage.generateMealPlanFromGrid: Starting',
        {
          hasProfile: !!this.profile,
          hasCalorieGridRows: !!calorieGridRows,
        },
      );
      if (!this.profile || !calorieGridRows) return;

      await ensureRecipesLoaded();

      if (!Array.isArray(recipes) || recipes.length === 0) {
        const mealPlanMessages = getMealPlanMessages();
        const message =
          mealPlanMessages && mealPlanMessages.noRecipesAvailableForPlan
            ? mealPlanMessages.noRecipesAvailableForPlan
            : '';
        if (
          message &&
          typeof window !== 'undefined' &&
          typeof window.alert === 'function'
        ) {
          window.alert(message);
        }
        this.log(
          'generateMealPlanFromGrid',
          'functionComplete',
          'MealPlanPage.generateMealPlanFromGrid: Aborted due to no recipes',
        );
        return;
      }

      updateCaloriesFromGrid();

      const slots = Array.isArray(this.profile.mealPlanCaloriesPerMealSlots)
        ? this.profile.mealPlanCaloriesPerMealSlots
        : [];

      const hasCalories = slots.some(
        (value) =>
          typeof value === 'number' && Number.isFinite(value) && value > 0,
      );

      if (!hasCalories) {
        const mealPlanMessages = getMealPlanMessages();
        const message =
          mealPlanMessages && mealPlanMessages.missingCalorieRequirementsAlert
            ? mealPlanMessages.missingCalorieRequirementsAlert
            : '';
        if (
          message &&
          typeof window !== 'undefined' &&
          typeof window.alert === 'function'
        ) {
          window.alert(message);
        }
        this.log(
          'generateMealPlanFromGrid',
          'functionComplete',
          'MealPlanPage.generateMealPlanFromGrid: Aborted due to missing calorie slots',
        );
        return;
      }

      const rawDays = daysSelect ? daysSelect.value : '';
      const parsedDays = rawDays === '' ? NaN : Number.parseInt(rawDays, 10);
      const days = Number.isNaN(parsedDays) || parsedDays <= 0 ? 1 : parsedDays;

      const rawMeals = mealsPerDayInput ? mealsPerDayInput.value : '';
      const parsedMeals = rawMeals === '' ? NaN : Number.parseInt(rawMeals, 10);
      const mealsPerDay =
        Number.isNaN(parsedMeals) || parsedMeals <= 0 ? 0 : parsedMeals;
      if (mealsPerDay <= 0) return;

      const rawPeople = peopleInput ? peopleInput.value : '';
      const parsedPeople =
        rawPeople === '' ? NaN : Number.parseInt(rawPeople, 10);
      const peopleCount =
        Number.isNaN(parsedPeople) || parsedPeople <= 0 ? 1 : parsedPeople;

      const mealNameInputs = calorieGridRows.querySelectorAll(
        '.meal-plan-calorie-meal-row .meal-plan-meal-name',
      );
      const generatedMealNames = [];
      mealNameInputs.forEach((input, index) => {
        if (input instanceof HTMLInputElement && input.value.trim() !== '') {
          generatedMealNames[index] = input.value.trim();
        } else {
          generatedMealNames[index] = `Meal ${index + 1}`;
        }
      });

      if (Array.isArray(meals)) {
        meals.splice(0, meals.length);
        let idCounter = 1;
        const usedRecipeIdsForCurrentPlan = new Set();

        for (let dayIndex = 0; dayIndex < days; dayIndex += 1) {
          for (let mealIndex = 0; mealIndex < mealsPerDay; mealIndex += 1) {
            const name =
              generatedMealNames[mealIndex] || `Meal ${mealIndex + 1}`;
            const perPersonCalories = [];
            for (
              let personIndex = 0;
              personIndex < peopleCount;
              personIndex += 1
            ) {
              const flatIndex = mealIndex * peopleCount + personIndex;
              const value =
                typeof slots[flatIndex] === 'number' && slots[flatIndex] > 0
                  ? slots[flatIndex]
                  : null;
              perPersonCalories.push(value);
            }

            const nonNullPerPerson = perPersonCalories.filter(
              (value) => typeof value === 'number' && value > 0,
            );
            const targetCaloriesPerPerson =
              nonNullPerPerson.length > 0
                ? nonNullPerPerson.reduce((sum, value) => sum + value, 0) /
                  nonNullPerPerson.length
                : null;

            const recipesForMeal = this.buildRecipesForMeal(
              targetCaloriesPerPerson,
              usedRecipeIdsForCurrentPlan,
            );

            recipesForMeal.forEach((recipe) => {
              if (recipe && recipe.id != null) {
                usedRecipeIdsForCurrentPlan.add(recipe.id);
              }
            });

            meals.push(
              new Meal({
                id: idCounter,
                name,
                dayIndex,
                mealType: name,
                recipesForMeal,
                notes: JSON.stringify({ perPersonCalories }),
              }),
            );
            idCounter += 1;
          }
        }
        this.log(
          'generateMealPlanFromGrid',
          'info',
          'MealPlanPage.generateMealPlanFromGrid: Finished building meals array',
          {
            totalMeals: meals.length,
          },
        );
      }

      if (typeof MealPlan === 'function') {
        const profileSnapshot = this.profile
          ? {
              dietType: this.profile.dietType,
              allergensText: this.profile.allergensText,
              maxReadyMinutes: this.profile.maxReadyMinutes,
              mealPlanPeopleCount: this.profile.mealPlanPeopleCount,
              mealPlanMealsPerDay: this.profile.mealPlanMealsPerDay,
              mealPlanCaloriesPerPersonPerDay:
                this.profile.mealPlanCaloriesPerPersonPerDay,
            }
          : null;

        const mealPlanMessages = getMealPlanMessages();
        const generatedName =
          mealPlanMessages && mealPlanMessages.generatedMealPlanName
            ? mealPlanMessages.generatedMealPlanName
            : '';

        const plan = new MealPlan({
          id: null,
          name: generatedName,
          profileSnapshot,
          days,
          mealsPerDay,
          mealsForPlan: Array.isArray(meals) ? meals : [],
        });

        // Expose the latest plan via the shared reference
        MealPlan.setCurrentMealPlan(plan);

        if (storage && typeof storage.saveMealPlan === 'function') {
          storage.saveMealPlan(plan);
        }

        this.log(
          'attachMealPlanEventListeners',
          'info',
          'Generated MealPlan object from grid and profile',
          {
            days: plan.days,
            mealsPerDay: plan.mealsPerDay,
            mealCount: plan.mealsForPlan.length,
          },
        );
      } else {
        this.log(
          'attachMealPlanEventListeners',
          'info',
          'Generated meal plan from grid and profile',
          {
            days,
            mealsPerDay,
            mealCount: Array.isArray(meals) ? meals.length : 0,
          },
        );
      }
      renderSummaryGridFromMeals();
      saveMealPlanPageStateToSession();

      this.log(
        'generateMealPlanFromGrid',
        'functionComplete',
        'MealPlanPage.generateMealPlanFromGrid: Completed end-to-end',
        {
          mealsLength: Array.isArray(meals) ? meals.length : null,
        },
      );
    };

    if (generateMealPlanButton) {
      generateMealPlanButton.addEventListener('click', async (event) => {
        event.preventDefault();
        await generateMealPlanFromGrid();
      });
    }

    const getOrBuildCurrentPlan = () => {
      const existingPlan = MealPlan.getCurrentMealPlan();
      let plan = existingPlan instanceof MealPlan ? existingPlan : null;

      if (!plan) {
        if (!Array.isArray(meals) || meals.length === 0) {
          return null;
        }

        let maxDayIndex = 0;
        meals.forEach((meal) => {
          if (
            meal &&
            typeof meal.dayIndex === 'number' &&
            Number.isFinite(meal.dayIndex) &&
            meal.dayIndex > maxDayIndex
          ) {
            maxDayIndex = meal.dayIndex;
          }
        });
        const days = maxDayIndex + 1;

        const dayCounts = new Map();
        meals.forEach((meal) => {
          if (
            meal &&
            typeof meal.dayIndex === 'number' &&
            Number.isFinite(meal.dayIndex) &&
            meal.dayIndex >= 0
          ) {
            const key = meal.dayIndex;
            dayCounts.set(key, (dayCounts.get(key) || 0) + 1);
          }
        });
        const mealsPerDayCandidate =
          dayCounts.size > 0 ? Math.max(...Array.from(dayCounts.values())) : 0;

        const profileSnapshot = this.profile
          ? {
              dietType: this.profile.dietType,
              allergensText: this.profile.allergensText,
              maxReadyMinutes: this.profile.maxReadyMinutes,
              mealPlanPeopleCount: this.profile.mealPlanPeopleCount,
              mealPlanMealsPerDay: this.profile.mealPlanMealsPerDay,
              mealPlanCaloriesPerPersonPerDay:
                this.profile.mealPlanCaloriesPerPersonPerDay,
            }
          : null;

        const mealPlanMessages = getMealPlanMessages();
        const defaultPlanName =
          mealPlanMessages && mealPlanMessages.defaultPlanName
            ? mealPlanMessages.defaultPlanName
            : '';

        plan = new MealPlan({
          id: null,
          name: defaultPlanName,
          profileSnapshot,
          days,
          mealsPerDay: mealsPerDayCandidate,
          mealsForPlan: Array.isArray(meals) ? meals : [],
        });
      }

      return plan;
    };

    const saveCurrentPlanToLocal = () => {
      const plan = getOrBuildCurrentPlan();
      if (
        !plan ||
        !Array.isArray(plan.mealsForPlan) ||
        plan.mealsForPlan.length === 0
      ) {
        const mealPlanMessages = getMealPlanMessages();
        const message =
          mealPlanMessages && mealPlanMessages.savePlanMissingPlanAlert
            ? mealPlanMessages.savePlanMissingPlanAlert
            : '';
        if (
          message &&
          typeof window !== 'undefined' &&
          typeof window.alert === 'function'
        ) {
          window.alert(message);
        }
        return;
      }

      const mealPlanMessages = getMealPlanMessages();
      const generatedName =
        mealPlanMessages && mealPlanMessages.generatedMealPlanName
          ? mealPlanMessages.generatedMealPlanName
          : '';
      const defaultPlanName =
        mealPlanMessages && mealPlanMessages.defaultPlanName
          ? mealPlanMessages.defaultPlanName
          : '';

      const defaultName =
        plan.name && plan.name !== generatedName && plan.name !== ''
          ? plan.name
          : defaultPlanName || plan.name || '';

      const promptMessage =
        mealPlanMessages && mealPlanMessages.savePlanPrompt
          ? mealPlanMessages.savePlanPrompt
          : '';

      const rawName =
        typeof window !== 'undefined' &&
        typeof window.prompt === 'function' &&
        promptMessage
          ? window.prompt(promptMessage, defaultName)
          : defaultName;

      if (rawName == null) {
        return;
      }

      const name = String(rawName).trim();
      if (!name) {
        const message =
          mealPlanMessages && mealPlanMessages.savePlanNameRequiredAlert
            ? mealPlanMessages.savePlanNameRequiredAlert
            : '';
        if (
          message &&
          typeof window !== 'undefined' &&
          typeof window.alert === 'function'
        ) {
          window.alert(message);
        }
        return;
      }

      const existing =
        storage && typeof storage.loadSavedMealPlans === 'function'
          ? storage.loadSavedMealPlans()
          : [];

      const plans = Array.isArray(existing) ? existing.slice() : [];

      let planId =
        typeof plan.id === 'number' && Number.isFinite(plan.id)
          ? plan.id
          : null;
      let existingIndex = -1;

      if (planId != null) {
        existingIndex = plans.findIndex(
          (record) => record && record.id === planId,
        );
      }

      if (existingIndex === -1) {
        const maxId = plans.reduce((max, record) => {
          const value =
            record &&
            typeof record.id === 'number' &&
            Number.isFinite(record.id)
              ? record.id
              : null;
          return value != null && value > max ? value : max;
        }, 0);
        planId = maxId + 1;
      }

      const record = {
        id: planId,
        name,
        profileSnapshot: plan.profileSnapshot || null,
        days: plan.days,
        mealsPerDay: plan.mealsPerDay,
        mealsForPlan: Array.isArray(plan.mealsForPlan)
          ? plan.mealsForPlan.map((meal) => ({ ...meal }))
          : [],
      };

      if (existingIndex >= 0) {
        plans[existingIndex] = record;
      } else {
        plans.push(record);
      }

      if (storage && typeof storage.saveSavedMealPlans === 'function') {
        storage.saveSavedMealPlans(plans);
      }

      plan.id = planId;
      plan.name = name;
      MealPlan.setCurrentMealPlan(plan);

      if (this.profile && typeof this.profile.addSavedMealPlan === 'function') {
        this.profile.addSavedMealPlan(planId);
      }

      if (storage && typeof storage.saveMealPlan === 'function') {
        storage.saveMealPlan(plan);
      }

      this.log(
        'attachMealPlanEventListeners',
        'info',
        'Saved current meal plan to local storage',
        {
          id: planId,
          name,
          mealCount: Array.isArray(plan.mealsForPlan)
            ? plan.mealsForPlan.length
            : 0,
        },
      );

      if (typeof window !== 'undefined' && typeof window.alert === 'function') {
        const mealPlanMessages = getMealPlanMessages();
        const template =
          mealPlanMessages && mealPlanMessages.savePlanSuccessTemplate
            ? mealPlanMessages.savePlanSuccessTemplate
            : '';
        const message = template ? template.replace('{name}', name) : '';
        if (message) {
          window.alert(message);
        }
      }
    };

    const loadSavedPlanFromLocal = () => {
      const plansResult =
        storage && typeof storage.loadSavedMealPlans === 'function'
          ? storage.loadSavedMealPlans()
          : [];

      const plans = Array.isArray(plansResult) ? plansResult : [];

      if (plans.length === 0) {
        const mealPlanMessages = getMealPlanMessages();
        const message =
          mealPlanMessages && mealPlanMessages.loadNoSavedPlansAlert
            ? mealPlanMessages.loadNoSavedPlansAlert
            : '';
        if (
          message &&
          typeof window !== 'undefined' &&
          typeof window.alert === 'function'
        ) {
          window.alert(message);
        }
        return;
      }

      let chosenRecord;

      const mealPlanMessages = getMealPlanMessages();

      if (plans.length === 1) {
        const only = plans[0];
        const defaultPlanName =
          mealPlanMessages && mealPlanMessages.defaultPlanName
            ? mealPlanMessages.defaultPlanName
            : '';
        const label = only && only.name ? only.name : defaultPlanName;
        if (
          typeof window !== 'undefined' &&
          typeof window.confirm === 'function' &&
          label
        ) {
          const template =
            mealPlanMessages && mealPlanMessages.loadSinglePlanConfirmTemplate
              ? mealPlanMessages.loadSinglePlanConfirmTemplate
              : '';
          const message = template ? template.replace('{name}', label) : '';
          if (!message || !window.confirm(message)) {
            return;
          }
        }
        chosenRecord = only;
      } else {
        let message =
          mealPlanMessages && mealPlanMessages.loadPromptHeader
            ? `${mealPlanMessages.loadPromptHeader}\n`
            : '';
        plans.forEach((plan, index) => {
          const defaultLabelTemplate =
            mealPlanMessages &&
            mealPlanMessages.loadPromptDefaultPlanLabelTemplate
              ? mealPlanMessages.loadPromptDefaultPlanLabelTemplate
              : '';
          const labelBase = defaultLabelTemplate
            ? defaultLabelTemplate.replace('{index}', String(index + 1))
            : '';
          const label = plan && plan.name ? plan.name : labelBase;

          const daysTemplate =
            mealPlanMessages && mealPlanMessages.loadPromptDaysLabelTemplate
              ? mealPlanMessages.loadPromptDaysLabelTemplate
              : '';
          const daysLabel =
            typeof plan.days === 'number' &&
            Number.isFinite(plan.days) &&
            daysTemplate
              ? daysTemplate.replace('{days}', String(plan.days))
              : '';

          const mealsPerDayTemplate =
            mealPlanMessages &&
            mealPlanMessages.loadPromptMealsPerDayLabelTemplate
              ? mealPlanMessages.loadPromptMealsPerDayLabelTemplate
              : '';
          const mealsPerDayLabel =
            typeof plan.mealsPerDay === 'number' &&
            Number.isFinite(plan.mealsPerDay) &&
            mealsPerDayTemplate
              ? mealsPerDayTemplate.replace(
                  '{mealsPerDay}',
                  String(plan.mealsPerDay),
                )
              : '';
          const meta = [daysLabel, mealsPerDayLabel].filter(Boolean).join(', ');
          message += `${index + 1}. ${label}${meta ? ` (${meta})` : ''}\n`;
        });

        const raw =
          typeof window !== 'undefined' &&
          typeof window.prompt === 'function' &&
          message
            ? window.prompt(message, '1')
            : '1';
        if (raw == null) {
          return;
        }
        const parsed = Number.parseInt(String(raw), 10);
        if (!Number.isFinite(parsed) || parsed < 1 || parsed > plans.length) {
          const invalidMessage =
            mealPlanMessages && mealPlanMessages.loadInvalidSelectionAlert
              ? mealPlanMessages.loadInvalidSelectionAlert
              : '';
          if (
            invalidMessage &&
            typeof window !== 'undefined' &&
            typeof window.alert === 'function'
          ) {
            window.alert(invalidMessage);
          }
          return;
        }
        chosenRecord = plans[parsed - 1];
      }

      if (
        !chosenRecord ||
        !Array.isArray(chosenRecord.mealsForPlan) ||
        chosenRecord.mealsForPlan.length === 0
      ) {
        const failedMessage =
          mealPlanMessages && mealPlanMessages.loadFailedAlert
            ? mealPlanMessages.loadFailedAlert
            : '';
        if (
          failedMessage &&
          typeof window !== 'undefined' &&
          typeof window.alert === 'function'
        ) {
          window.alert(failedMessage);
        }
        return;
      }

      const plan = new MealPlan(chosenRecord);

      if (Array.isArray(meals)) {
        meals.splice(0, meals.length);
        plan.mealsForPlan.forEach((meal) => {
          meals.push(meal instanceof Meal ? meal : new Meal(meal));
        });
      }

      const snapshot =
        plan && plan.profileSnapshot && typeof plan.profileSnapshot === 'object'
          ? plan.profileSnapshot
          : null;

      if (this.profile && snapshot) {
        this.profile.setDietaryPreferences({
          dietType: snapshot.dietType,
          allergensText: snapshot.allergensText,
          maxReadyMinutes: snapshot.maxReadyMinutes,
        });

        this.profile.setMealPlanSpec({
          peopleCount: snapshot.mealPlanPeopleCount,
          mealsPerDay: snapshot.mealPlanMealsPerDay,
          caloriesPerPersonPerDay: snapshot.mealPlanCaloriesPerPersonPerDay,
        });
      }

      if (
        daysSelect &&
        typeof plan.days === 'number' &&
        Number.isFinite(plan.days) &&
        plan.days > 0
      ) {
        daysSelect.value = String(plan.days);
      }

      if (
        mealsPerDayInput &&
        typeof plan.mealsPerDay === 'number' &&
        Number.isFinite(plan.mealsPerDay) &&
        plan.mealsPerDay > 0
      ) {
        mealsPerDayInput.value = String(plan.mealsPerDay);
      }

      if (
        peopleInput &&
        this.profile &&
        typeof this.profile.mealPlanPeopleCount === 'number' &&
        Number.isFinite(this.profile.mealPlanPeopleCount) &&
        this.profile.mealPlanPeopleCount > 0
      ) {
        peopleInput.value = String(this.profile.mealPlanPeopleCount);
      }

      MealPlan.setCurrentMealPlan(plan);
      if (storage && typeof storage.saveMealPlan === 'function') {
        storage.saveMealPlan(plan);
      }

      renderCalorieGridRows();
      updateCaloriesFromGrid();
      renderSummaryGridFromMeals();
      saveMealPlanPageStateToSession();

      this.log(
        'attachMealPlanEventListeners',
        'info',
        'Loaded saved meal plan from local storage',
        {
          id: plan.id,
          name: plan.name,
          mealCount: Array.isArray(plan.mealsForPlan)
            ? plan.mealsForPlan.length
            : 0,
        },
      );
    };

    if (saveMealPlanButton) {
      saveMealPlanButton.addEventListener('click', (event) => {
        event.preventDefault();
        saveCurrentPlanToLocal();
      });
    }

    if (loadSavedMealPlanButton) {
      loadSavedMealPlanButton.addEventListener('click', (event) => {
        event.preventDefault();
        loadSavedPlanFromLocal();
      });
    }

    if (buildShoppingListButton) {
      buildShoppingListButton.addEventListener('click', (event) => {
        event.preventDefault();

        if (!Array.isArray(meals) || meals.length === 0) {
          const mealPlanMessages = getMealPlanMessages();
          const message =
            mealPlanMessages && mealPlanMessages.buildShoppingMissingPlanAlert
              ? mealPlanMessages.buildShoppingMissingPlanAlert
              : '';
          if (
            message &&
            typeof window !== 'undefined' &&
            typeof window.alert === 'function'
          ) {
            window.alert(message);
          }
          return;
        }

        const peopleCount =
          typeof this.profile?.mealPlanPeopleCount === 'number' &&
          this.profile.mealPlanPeopleCount > 0
            ? this.profile.mealPlanPeopleCount
            : null;

        const aggregate = MealPlan.buildRequiredIngredientsForPlan(
          meals,
          peopleCount,
        );

        if (aggregate.size === 0) {
          const mealPlanMessages = getMealPlanMessages();
          const message =
            mealPlanMessages && mealPlanMessages.buildShoppingNoIngredientsAlert
              ? mealPlanMessages.buildShoppingNoIngredientsAlert
              : '';
          if (
            message &&
            typeof window !== 'undefined' &&
            typeof window.alert === 'function'
          ) {
            window.alert(message);
          }
          return;
        }

        // Ensure pantry inventory is hydrated from persistent storage so
        // meal-plan-built shopping lists correctly account for existing stock
        if (
          sharedInventory &&
          (!Array.isArray(sharedInventory.items) ||
            sharedInventory.items.length === 0)
        ) {
          const persistedInventory =
            storage && typeof storage.loadInventory === 'function'
              ? storage.loadInventory()
              : null;
          if (
            persistedInventory &&
            Array.isArray(persistedInventory.items) &&
            persistedInventory.items.length > 0
          ) {
            if (!Array.isArray(sharedInventory.items)) {
              sharedInventory.items = [];
            }
            sharedInventory.items.splice(
              0,
              sharedInventory.items.length,
              ...persistedInventory.items,
            );
          }
        }

        // Build a map of pantry quantities for in-stock items keyed by name+unit
        const pantryTotals = new Map();
        if (sharedInventory && Array.isArray(sharedInventory.items)) {
          sharedInventory.items.forEach((entry) => {
            if (!entry || !entry.inStock) return;
            const pantryName = (entry.name || '').trim();
            if (!pantryName) return;
            const pantryUnit = (entry.unit || '').trim();
            const pantryQuantity =
              typeof entry.quantity === 'number' &&
              Number.isFinite(entry.quantity) &&
              entry.quantity > 0
                ? entry.quantity
                : 0;
            if (pantryQuantity <= 0) return;

            const pantryKey = MealPlan.makeIngredientKey(
              pantryName,
              pantryUnit,
            );
            const existingTotal = pantryTotals.get(pantryKey) || 0;
            pantryTotals.set(pantryKey, existingTotal + pantryQuantity);
          });
        }

        // Subtract pantry quantities from aggregated requirements
        const finalItems = new Map();
        const epsilon = 1e-6;
        aggregate.forEach((entry, key) => {
          const requiredQuantity =
            typeof entry.quantity === 'number' &&
            Number.isFinite(entry.quantity) &&
            entry.quantity > 0
              ? entry.quantity
              : 0;
          if (requiredQuantity <= 0) return;

          const pantryQuantity = pantryTotals.get(key) || 0;
          let needed = requiredQuantity - pantryQuantity;

          if (needed <= epsilon) return;

          if (!Number.isInteger(needed)) {
            needed = Math.round(needed * 1000) / 1000;
          }

          if (needed > 0) {
            finalItems.set(key, {
              name: entry.name,
              quantity: needed,
              unit: entry.unit,
            });
          }
        });

        if (finalItems.size === 0) {
          const mealPlanMessages = getMealPlanMessages();
          const message =
            mealPlanMessages &&
            mealPlanMessages.buildShoppingPantryAlreadyCoversAlert
              ? mealPlanMessages.buildShoppingPantryAlreadyCoversAlert
              : '';
          if (
            message &&
            typeof window !== 'undefined' &&
            typeof window.alert === 'function'
          ) {
            window.alert(message);
          }
          return;
        }

        finalItems.forEach((entry) => {
          const quantity =
            typeof entry.quantity === 'number' &&
            Number.isFinite(entry.quantity) &&
            entry.quantity > 0
              ? entry.quantity
              : 1;
          sharedShoppingList.addItem(entry.name, {
            quantity,
            unit: entry.unit || '',
          });
        });

        if (storage && typeof storage.saveShoppingList === 'function') {
          storage.saveShoppingList(sharedShoppingList);
        }

        this.log(
          'attachMealPlanEventListeners',
          'info',
          'Built shopping list from current meal plan (accounting for pantry)',
          {
            mealCount: Array.isArray(meals) ? meals.length : 0,
            requestedItemCount: aggregate.size,
            finalItemCount: finalItems.size,
          },
        );

        const mealPlanMessages = getMealPlanMessages();
        const successMessage =
          mealPlanMessages && mealPlanMessages.buildShoppingSuccessAlert
            ? mealPlanMessages.buildShoppingSuccessAlert
            : '';
        if (
          successMessage &&
          typeof window !== 'undefined' &&
          typeof window.alert === 'function'
        ) {
          window.alert(successMessage);
        }

        const site = window.site instanceof Site ? window.site : null;
        if (site && typeof site.loadPage === 'function') {
          site.loadPage('shopping');
        }
      });
    }

    if (usePantryButton) {
      usePantryButton.addEventListener('click', (event) => {
        event.preventDefault();

        if (!Array.isArray(meals) || meals.length === 0) {
          const mealPlanMessages = getMealPlanMessages();
          const message =
            mealPlanMessages && mealPlanMessages.usePantryMissingPlanAlert
              ? mealPlanMessages.usePantryMissingPlanAlert
              : '';
          if (
            message &&
            typeof window !== 'undefined' &&
            typeof window.alert === 'function'
          ) {
            window.alert(message);
          }
          return;
        }

        const peopleCount =
          typeof this.profile?.mealPlanPeopleCount === 'number' &&
          this.profile.mealPlanPeopleCount > 0
            ? this.profile.mealPlanPeopleCount
            : null;

        const aggregate = MealPlan.buildRequiredIngredientsForPlan(
          meals,
          peopleCount,
        );

        if (!aggregate || aggregate.size === 0) {
          const mealPlanMessages = getMealPlanMessages();
          const message =
            mealPlanMessages && mealPlanMessages.usePantryNoIngredientsAlert
              ? mealPlanMessages.usePantryNoIngredientsAlert
              : '';
          if (
            message &&
            typeof window !== 'undefined' &&
            typeof window.alert === 'function'
          ) {
            window.alert(message);
          }
          return;
        }

        // Ensure pantry inventory is hydrated from persistent storage
        if (
          sharedInventory &&
          (!Array.isArray(sharedInventory.items) ||
            sharedInventory.items.length === 0)
        ) {
          const persistedInventory =
            storage && typeof storage.loadInventory === 'function'
              ? storage.loadInventory()
              : null;
          if (
            persistedInventory &&
            Array.isArray(persistedInventory.items) &&
            persistedInventory.items.length > 0
          ) {
            if (!Array.isArray(sharedInventory.items)) {
              sharedInventory.items = [];
            }
            sharedInventory.items.splice(
              0,
              sharedInventory.items.length,
              ...persistedInventory.items,
            );
          }
        }

        // Build pantry totals by name+unit for in-stock items
        const pantryTotals = new Map();
        if (sharedInventory && Array.isArray(sharedInventory.items)) {
          sharedInventory.items.forEach((entry) => {
            if (!entry || !entry.inStock) return;
            const pantryName = (entry.name || '').trim();
            if (!pantryName) return;
            const pantryUnit = (entry.unit || '').trim();
            const pantryQuantity =
              typeof entry.quantity === 'number' &&
              Number.isFinite(entry.quantity) &&
              entry.quantity > 0
                ? entry.quantity
                : 0;
            if (pantryQuantity <= 0) return;

            const pantryKey = MealPlan.makeIngredientKey(
              pantryName,
              pantryUnit,
            );
            const existingTotal = pantryTotals.get(pantryKey) || 0;
            pantryTotals.set(pantryKey, existingTotal + pantryQuantity);
          });
        }

        let allCovered = true;
        aggregate.forEach((entry, key) => {
          const requiredQuantity =
            typeof entry.quantity === 'number' &&
            Number.isFinite(entry.quantity) &&
            entry.quantity > 0
              ? entry.quantity
              : 0;
          if (requiredQuantity <= 0) {
            return;
          }

          const pantryQuantity = pantryTotals.get(key) || 0;
          if (pantryQuantity + 1e-6 < requiredQuantity) {
            allCovered = false;
          }
        });

        if (!allCovered) {
          this.log(
            'attachMealPlanEventListeners',
            'info',
            'Pantry does not fully cover ingredients for current meal plan',
            {
              mealCount: Array.isArray(meals) ? meals.length : 0,
              requiredItemCount: aggregate.size,
            },
          );

          const mealPlanMessages = getMealPlanMessages();
          const notEnoughMessage =
            mealPlanMessages && mealPlanMessages.usePantryNotEnoughAlert
              ? mealPlanMessages.usePantryNotEnoughAlert
              : '';
          if (
            notEnoughMessage &&
            typeof window !== 'undefined' &&
            typeof window.alert === 'function'
          ) {
            window.alert(notEnoughMessage);
          }

          const confirmMessage =
            mealPlanMessages && mealPlanMessages.usePantryBuildShoppingConfirm
              ? mealPlanMessages.usePantryBuildShoppingConfirm
              : '';

          const shouldBuildShoppingList =
            typeof window !== 'undefined' &&
            typeof window.confirm === 'function' &&
            confirmMessage
              ? window.confirm(confirmMessage)
              : false;

          if (shouldBuildShoppingList && buildShoppingListButton) {
            buildShoppingListButton.click();
          }
          return;
        }

        const epsilon = 1e-6;

        if (sharedInventory && Array.isArray(sharedInventory.items)) {
          aggregate.forEach((entry, key) => {
            const requiredQuantity =
              typeof entry.quantity === 'number' &&
              Number.isFinite(entry.quantity) &&
              entry.quantity > 0
                ? entry.quantity
                : 0;
            if (requiredQuantity <= 0) {
              return;
            }

            let remaining = requiredQuantity;

            sharedInventory.items.forEach((invEntry) => {
              if (!invEntry || !invEntry.inStock) return;
              const pantryName = (invEntry.name || '').trim();
              if (!pantryName) return;
              const pantryUnit = (invEntry.unit || '').trim();
              const pantryKey = MealPlan.makeIngredientKey(
                pantryName,
                pantryUnit,
              );
              if (pantryKey !== key) return;

              const currentQuantity =
                typeof invEntry.quantity === 'number' &&
                Number.isFinite(invEntry.quantity) &&
                invEntry.quantity > 0
                  ? invEntry.quantity
                  : 0;
              if (currentQuantity <= 0 || remaining <= epsilon) return;

              const subtract =
                currentQuantity < remaining ? currentQuantity : remaining;
              const nextQuantity = currentQuantity - subtract;
              invEntry.quantity = nextQuantity > epsilon ? nextQuantity : 0;
              if (!invEntry.quantity || invEntry.quantity <= epsilon) {
                invEntry.inStock = false;
              }
              invEntry.partialQuantity = 0;
              invEntry.selected = false;

              remaining -= subtract;
            });
          });
        }

        if (storage && typeof storage.saveInventory === 'function') {
          storage.saveInventory(sharedInventory);
        }

        this.log(
          'attachMealPlanEventListeners',
          'info',
          'Pantry fully covers ingredients for current meal plan; inventory updated to reflect usage',
          {
            mealCount: Array.isArray(meals) ? meals.length : 0,
            requiredItemCount: aggregate.size,
          },
        );

        const mealPlanMessages = getMealPlanMessages();
        const successMessage =
          mealPlanMessages && mealPlanMessages.usePantrySuccessAlert
            ? mealPlanMessages.usePantrySuccessAlert
            : '';
        if (
          successMessage &&
          typeof window !== 'undefined' &&
          typeof window.alert === 'function'
        ) {
          window.alert(successMessage);
        }
      });
    }

    const adjustCounter = (input, delta, min) => {
      if (!input) return;

      const fieldName =
        input === peopleInput
          ? 'peopleCount'
          : input === mealsPerDayInput
            ? 'mealsPerDay'
            : 'unknown';

      const raw = input.value;
      const parsed = raw === '' ? NaN : Number.parseInt(raw, 10);
      const current =
        Number.isNaN(parsed) || parsed < min ? min : Math.trunc(parsed);
      let next = current + delta;
      if (next < min) {
        next = min;
      }

      this.log(
        'attachMealPlanEventListeners',
        'functionStart',
        'MealPlanPage.adjustCounter: Updating counter',
        {
          fieldName,
          delta,
          min,
          raw,
          parsed,
          current,
          next,
        },
      );

      input.value = String(next);
      updateSpecFromInputs();

      this.log(
        'attachMealPlanEventListeners',
        'functionComplete',
        'MealPlanPage.adjustCounter: Counter updated',
        {
          fieldName,
          value: input.value,
          profilePeopleCount: this.profile
            ? this.profile.mealPlanPeopleCount
            : null,
          profileMealsPerDay: this.profile
            ? this.profile.mealPlanMealsPerDay
            : null,
        },
      );
    };

    if (peopleDecrement) {
      peopleDecrement.addEventListener('click', () => {
        adjustCounter(peopleInput, -1, 1);
        renderCalorieGridRows();
        updateCaloriesFromGrid();
      });
    }

    if (peopleIncrement) {
      peopleIncrement.addEventListener('click', () => {
        adjustCounter(peopleInput, 1, 1);
        renderCalorieGridRows();
        updateCaloriesFromGrid();
      });
    }

    if (mealsPerDayDecrement) {
      mealsPerDayDecrement.addEventListener('click', () => {
        adjustCounter(mealsPerDayInput, -1, 1);
        renderCalorieGridRows();
        updateCaloriesFromGrid();
      });
    }

    if (mealsPerDayIncrement) {
      mealsPerDayIncrement.addEventListener('click', () => {
        adjustCounter(mealsPerDayInput, 1, 1);
        renderCalorieGridRows();
        updateCaloriesFromGrid();
      });
    }

    restoreMealPlanFromSession();
    restoreMealPlanPageStateFromSession();
    renderCalorieGridRows();
    updateCaloriesFromGrid();
    renderSummaryGridFromMeals();

    this.log(
      'attachMealPlanEventListeners',
      'lifecycle',
      'MealPlanPage.attachMealPlanEventListeners: Completed wiring controls',
    );
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'MealPlanPage');

Logger.instrumentClass(MealPlanPage, 'MealPlanPage');

export { MealPlanPage };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
