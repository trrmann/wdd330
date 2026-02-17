import { bootLogger } from '../models/bootLogger.js';

import { Logger } from '../models/logger.js';
import { Site } from './site.js';
import { ShoppingList, Inventory } from '../models/shoppingList.js';
import { Storage } from '../models/storage.js';
import { recipes } from '../models/recipes.js';
import { meals, Meal, Profile } from '../models/mealPlan.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(import.meta.url, 'Defines ToolsPage');
// ToolsPage controller for Chow Tools (profile + import/export helpers).
// Usage: const page = new ToolsPage(config, { logger }); page.init(config);
class ToolsPage {
  // constructor: Creates the ToolsPage controller and optionally initializes.
  constructor(config = null, options = {}) {
    Object.defineProperties(this, ToolsPage.descriptors);
    this.logger = options.logger || null;
    this.log(
      'constructor',
      'objectCreateStart',
      'ToolsPage.constructor: Starting',
    );
    this.config = config;
    this.profile = Profile.getInstance();
    this.shoppingList = ShoppingList.getInstance();
    this.inventory = Inventory.getInstance();
    this.log(
      'constructor',
      'objectCreateComplete',
      'ToolsPage.constructor: Completed',
    );
    this.log('constructor', 'info', 'ToolsPage.constructor: ToolsPage created');
    // Immediately initialize after construction
    if (config) {
      this.init(config);
    }
  }

  // init: Builds the initial Tools page view model from the template.
  init(config) {
    if (this.initialized && this.view) {
      // State: Reuse existing ToolsPage view model when already initialized.
      return this.log('init', 'passthroughMethodComplete', this.view, {
        toLogValue: (page) => ({
          title: page.title,
          hasContent: !!page.content,
        }),
      });
    }

    this.log('init', 'objectInitStart', 'ToolsPage.init: Starting');
    // State: Capture the latest ToolsPage configuration on the instance.
    this.config = config;
    const template = document.getElementById(config.ids.templates.toolsPage);
    if (!template) {
      const errorResult = { title: config.titles.errorPage, content: '' };
      this.log(
        'init',
        'info',
        'ToolsPage.init: No tools-page template found, returning error page',
      );
      return this.log('init', 'passthroughMethodComplete', errorResult, {
        toLogValue: (page) => ({
          title: page.title,
          hasContent: !!page.content,
        }),
      });
    }
    // State: Mark ToolsPage as initialized.
    this.initialized = true;
    this.log('init', 'objectInitComplete', 'ToolsPage.init: Completed');
    this.log('init', 'info', 'ToolsPage.init: ToolsPage initialized');
    const result = {
      title: config.titles.toolsPage,
      content: template.innerHTML,
    };
    // State: Cache the rendered ToolsPage view model.
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
    };
  }

  // log: Delegates logging to the shared Logger using ToolsPage conventions.
  log(methodName, level, ...args) {
    if (!this.logger) return;

    if (this.logger.isSignatureLevel(level)) {
      if (typeof methodName === 'string') {
        if (level.startsWith('passthrough')) {
          return this.logger.passthroughMethod(
            'ToolsPage',
            methodName,
            ...args,
          );
        }
        this.logger.classMethodLog(level, 'ToolsPage', methodName, ...args);
      } else if (typeof methodName === 'object' && methodName !== null) {
        if (level.startsWith('function')) {
          this.logger.functionLog(level, ...args);
        } else {
          this.logger.classLog(level, ...args);
        }
      }
    } else {
      this.logger.classMethodLog(level, 'ToolsPage', methodName, ...args);
    }
  }

  applyToolsClasses(config, rootElement) {
    if (!config || !config.classes || !config.ids || !rootElement) return;

    const { classes, ids } = config;

    const mappings = [
      [ids.exportMealplanButton, classes.exportMealplanBtn],
      [ids.importMealplanButton, classes.importMealplanBtn],
      [ids.exportShoppingButton, classes.exportShoppingBtn],
      [ids.importShoppingButton, classes.importShoppingBtn],
      [ids.clearFavoritesButton, classes.clearFavoritesBtn],
      [ids.clearPlansButton, classes.clearPlansBtn],
      [ids.clearAllDataButton, classes.clearAllDataBtn],
      [ids.dietType, classes.dietType],
      [ids.dietAllergens, classes.dietAllergens],
      [ids.dietMaxTime, classes.dietMaxTime],
      [ids.chowToolsPageSection, classes.chowToolsPage],
      [ids.chowToolsHeader, classes.chowToolsHeader],
      [ids.chowToolsGrid, classes.chowToolsGrid],
    ];

    mappings.forEach(([idValue, className]) => {
      if (!idValue || !className) return;
      const element = rootElement.querySelector(`#${CSS.escape(idValue)}`);
      if (element && !element.classList.contains(className)) {
        element.classList.add(className);
      }
    });

    // Apply classes to tool cards and their internal layout elements, which
    // no longer have hardcoded classes in the template.
    const toolsGrid = rootElement.querySelector(
      `#${CSS.escape(ids.chowToolsGrid || 'chow-tools-grid')}`,
    );
    if (!toolsGrid) return;

    const toolCards = Array.from(toolsGrid.children).filter(
      (child) => child && child.tagName === 'SECTION',
    );

    toolCards.forEach((card, index) => {
      if (classes.toolCard && !card.classList.contains(classes.toolCard)) {
        card.classList.add(classes.toolCard);
      }

      const hint = card.querySelector('p');
      if (hint && classes.toolCardHint) {
        hint.classList.add(classes.toolCardHint);
      }

      if (index === 0) {
        const body = card.querySelector('div');
        if (body && classes.toolCardBody) {
          body.classList.add(classes.toolCardBody);
        }
        const columns = body ? body.querySelectorAll('div') : [];
        columns.forEach((col) => {
          if (classes.toolCardColumn) {
            col.classList.add(classes.toolCardColumn);
          }
        });
        const lists = body ? body.querySelectorAll('ul') : [];
        if (lists[0] && classes.favoritesRecipesList) {
          lists[0].classList.add(classes.favoritesRecipesList);
        }
        if (lists[1] && classes.favoritesMealplansList) {
          lists[1].classList.add(classes.favoritesMealplansList);
        }
      } else if (index === 1) {
        const form = card.querySelector('form');
        if (form && classes.dietaryProfileForm) {
          form.classList.add(classes.dietaryProfileForm);
        }
        const columns = form ? form.querySelectorAll('div') : [];
        columns.forEach((col, colIndex) => {
          if (classes.toolCardColumn && colIndex < 2) {
            col.classList.add(classes.toolCardColumn);
          }
          if (classes.toolCardRow && colIndex === 2) {
            col.classList.add(classes.toolCardRow);
          }
        });
      } else if (index === 2) {
        const body = card.querySelector('div');
        if (body && classes.toolCardBody) {
          body.classList.add(classes.toolCardBody);
        }
        const label = body ? body.querySelector('label') : null;
        if (label && classes.toolToggle) {
          label.classList.add(classes.toolToggle);
        }
        const summary = body ? body.querySelector('p') : null;
        if (summary && classes.nutritionSummaryPlaceholder) {
          summary.classList.add(classes.nutritionSummaryPlaceholder);
        }
      } else if (index === 3 || index === 4) {
        const actions = card.querySelector('div');
        if (actions && classes.toolCardActions) {
          actions.classList.add(classes.toolCardActions);
        }
      }
    });
  }

  // afterRender: Wires profile/tools events and syncs UI after render.
  afterRender(config) {
    this.log(
      'afterRender',
      'lifecycle',
      'toolsPage.afterRender: Starting afterRender lifecycle hook',
    );
    const mainElement = document.querySelector(`.${config.classes.main}`);
    if (mainElement) {
      this.applyToolsClasses(config, mainElement);
    }
    this.attachToolsPageEventListeners(config);
    this.syncProfileToUi(config);
    if (mainElement && config.titles) {
      const toolCards = mainElement.querySelectorAll('.tool-card');
      if (toolCards[0]) {
        const heading = toolCards[0].querySelector('h3');
        const subHeadings = toolCards[0].querySelectorAll('h4');
        if (heading && config.titles.toolsFavoritesHistoryHeading) {
          heading.textContent = config.titles.toolsFavoritesHistoryHeading;
        }
        if (subHeadings[0] && config.titles.toolsFavoriteRecipesHeading) {
          subHeadings[0].textContent =
            config.titles.toolsFavoriteRecipesHeading;
        }
        if (subHeadings[1] && config.titles.toolsSavedMealPlansHeading) {
          subHeadings[1].textContent = config.titles.toolsSavedMealPlansHeading;
        }
      }

      if (toolCards[1]) {
        const heading = toolCards[1].querySelector('h3');
        if (heading && config.titles.toolsDietaryProfileHeading) {
          heading.textContent = config.titles.toolsDietaryProfileHeading;
        }
      }

      if (toolCards[2]) {
        const heading = toolCards[2].querySelector('h3');
        if (heading && config.titles.toolsNutritionAlertsHeading) {
          heading.textContent = config.titles.toolsNutritionAlertsHeading;
        }
      }

      if (toolCards[3]) {
        const heading = toolCards[3].querySelector('h3');
        if (heading && config.titles.toolsExportSharingHeading) {
          heading.textContent = config.titles.toolsExportSharingHeading;
        }
      }

      if (toolCards[4]) {
        const heading = toolCards[4].querySelector('h3');
        if (heading && config.titles.toolsDataManagementHeading) {
          heading.textContent = config.titles.toolsDataManagementHeading;
        }
      }
    }
    if (mainElement && config.messages) {
      const toolsMessages = config.messages.tools || null;

      if (toolsMessages) {
        const headerIntro = mainElement.querySelector('.chow-tools-header p');
        if (headerIntro && toolsMessages.headerIntro) {
          headerIntro.textContent = toolsMessages.headerIntro;
        }

        const toolCards = mainElement.querySelectorAll('.tool-card');

        if (toolCards[0]) {
          const hint = toolCards[0].querySelector('.tool-card-hint');
          if (hint && toolsMessages.favoritesHistoryHint) {
            hint.textContent = toolsMessages.favoritesHistoryHint;
          }
        }

        if (toolCards[1]) {
          const hint = toolCards[1].querySelector('.tool-card-hint');
          if (hint && toolsMessages.dietaryProfileHint) {
            hint.textContent = toolsMessages.dietaryProfileHint;
          }

          const dietTypeLabel = toolCards[1].querySelector(
            'label[for="diet-type"]',
          );
          if (dietTypeLabel && toolsMessages.dietTypeLabel) {
            dietTypeLabel.textContent = toolsMessages.dietTypeLabel;
          }

          const dietTypeSelect = toolCards[1].querySelector('#diet-type');
          const dietTypeOptions = toolsMessages.dietTypeOptions || null;
          if (dietTypeSelect && dietTypeOptions) {
            Array.from(dietTypeSelect.options).forEach((option) => {
              const value = option.value;
              if (
                Object.prototype.hasOwnProperty.call(dietTypeOptions, value)
              ) {
                option.textContent = dietTypeOptions[value];
              }
            });
          }

          const allergensLabel = toolCards[1].querySelector(
            'label[for="diet-allergens"]',
          );
          if (allergensLabel && toolsMessages.allergensLabel) {
            allergensLabel.textContent = toolsMessages.allergensLabel;
          }

          const maxTimeLabel = toolCards[1].querySelector(
            'label[for="diet-max-time"]',
          );
          if (maxTimeLabel && toolsMessages.maxTimeLabel) {
            maxTimeLabel.textContent = toolsMessages.maxTimeLabel;
          }
        }

        if (toolCards[2]) {
          const hint = toolCards[2].querySelector('.tool-card-hint');
          if (hint && toolsMessages.nutritionAlertsHint) {
            hint.textContent = toolsMessages.nutritionAlertsHint;
          }

          const conflictLabelInput = toolCards[2].querySelector(
            `#${CSS.escape(config.ids.nutritionConflictToggle)}`,
          );
          if (
            conflictLabelInput &&
            conflictLabelInput.parentElement &&
            toolsMessages.nutritionConflictLabel
          ) {
            conflictLabelInput.parentElement.lastChild.textContent =
              toolsMessages.nutritionConflictLabel;
          }

          const summaryPlaceholder = toolCards[2].querySelector(
            '.nutrition-summary-placeholder',
          );
          if (summaryPlaceholder && toolsMessages.nutritionSummaryPlaceholder) {
            summaryPlaceholder.textContent =
              toolsMessages.nutritionSummaryPlaceholder;
          }
        }

        if (toolCards[3]) {
          const hint = toolCards[3].querySelector('.tool-card-hint');
          if (hint && toolsMessages.exportSharingHint) {
            hint.textContent = toolsMessages.exportSharingHint;
          }

          const exportMealplanBtn = mainElement.querySelector(
            `#${CSS.escape(config.ids.exportMealplanButton)}`,
          );
          if (exportMealplanBtn && toolsMessages.exportMealPlanButton) {
            exportMealplanBtn.textContent = toolsMessages.exportMealPlanButton;
          }

          const importMealplanBtn = mainElement.querySelector(
            `#${CSS.escape(config.ids.importMealplanButton)}`,
          );
          if (importMealplanBtn && toolsMessages.importMealPlanButton) {
            importMealplanBtn.textContent = toolsMessages.importMealPlanButton;
          }

          const exportShoppingBtn = mainElement.querySelector(
            `#${CSS.escape(config.ids.exportShoppingButton)}`,
          );
          if (exportShoppingBtn && toolsMessages.exportShoppingButton) {
            exportShoppingBtn.textContent = toolsMessages.exportShoppingButton;
          }

          const importShoppingBtn = mainElement.querySelector(
            `#${CSS.escape(config.ids.importShoppingButton)}`,
          );
          if (importShoppingBtn && toolsMessages.importShoppingButton) {
            importShoppingBtn.textContent = toolsMessages.importShoppingButton;
          }
        }

        if (toolCards[4]) {
          const hint = toolCards[4].querySelector('.tool-card-hint');
          if (hint && toolsMessages.dataManagementHint) {
            hint.textContent = toolsMessages.dataManagementHint;
          }

          const clearFavoritesBtn = mainElement.querySelector(
            `#${CSS.escape(config.ids.clearFavoritesButton)}`,
          );
          if (clearFavoritesBtn && toolsMessages.clearFavoritesButton) {
            clearFavoritesBtn.textContent = toolsMessages.clearFavoritesButton;
          }

          const clearPlansBtn = mainElement.querySelector(
            `#${CSS.escape(config.ids.clearPlansButton)}`,
          );
          if (clearPlansBtn && toolsMessages.clearPlansButton) {
            clearPlansBtn.textContent = toolsMessages.clearPlansButton;
          }

          const clearAllDataBtn = mainElement.querySelector(
            `#${CSS.escape(config.ids.clearAllDataButton)}`,
          );
          if (clearAllDataBtn && toolsMessages.clearAllDataButton) {
            clearAllDataBtn.textContent = toolsMessages.clearAllDataButton;
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

  // attachToolsPageEventListeners: Attaches profile, export/import, and clear handlers.
  attachToolsPageEventListeners(config) {
    const mainElement = document.querySelector(`.${config.classes.main}`);
    if (!mainElement) return;

    const dietaryForm = mainElement.querySelector(
      `.${config.classes.dietaryProfileForm}`,
    );
    const dietTypeSelect = mainElement.querySelector(
      `#${CSS.escape(config.ids.dietType)}`,
    );
    const allergensInput = mainElement.querySelector(
      `#${CSS.escape(config.ids.dietAllergens)}`,
    );
    const maxTimeInput = mainElement.querySelector(
      `#${CSS.escape(config.ids.dietMaxTime)}`,
    );
    const conflictToggle = mainElement.querySelector(
      `#${CSS.escape(config.ids.nutritionConflictToggle)}`,
    );

    const favoritesRecipesList = mainElement.querySelector(
      '.favorites-recipes-list',
    );
    const favoritesMealplansList = mainElement.querySelector(
      '.favorites-mealplans-list',
    );

    const exportMealplanBtn = mainElement.querySelector(
      `#${CSS.escape(config.ids.exportMealplanButton)}`,
    );
    const importMealplanBtn = mainElement.querySelector(
      `#${CSS.escape(config.ids.importMealplanButton)}`,
    );
    const exportShoppingBtn = mainElement.querySelector(
      `#${CSS.escape(config.ids.exportShoppingButton)}`,
    );
    const importShoppingBtn = mainElement.querySelector(
      `#${CSS.escape(config.ids.importShoppingButton)}`,
    );
    const importMealplanFileInput = mainElement.querySelector(
      `#${CSS.escape(config.ids.importMealplanFile)}`,
    );
    const importShoppingFileInput = mainElement.querySelector(
      `#${CSS.escape(config.ids.importShoppingFile)}`,
    );

    const clearFavoritesBtn = mainElement.querySelector(
      `#${CSS.escape(config.ids.clearFavoritesButton)}`,
    );
    const clearPlansBtn = mainElement.querySelector(
      `#${CSS.escape(config.ids.clearPlansButton)}`,
    );
    const clearAllDataBtn = mainElement.querySelector(
      `#${CSS.escape(config.ids.clearAllDataButton)}`,
    );

    if (dietaryForm) {
      dietaryForm.addEventListener('change', () => {
        const dietType = dietTypeSelect ? dietTypeSelect.value : '';
        const allergensText = allergensInput ? allergensInput.value : '';
        const rawMax = maxTimeInput ? maxTimeInput.value : '';
        const parsedMax = rawMax === '' ? null : Number.parseInt(rawMax, 10);

        if (this.profile) {
          this.profile.setDietaryPreferences({
            dietType,
            allergensText,
            maxReadyMinutes: Number.isNaN(parsedMax) ? null : parsedMax,
          });
        }

        this.log(
          'attachToolsPageEventListeners',
          'info',
          'Updated profile from dietary form',
          {
            dietType,
            hasAllergens: !!allergensText,
            maxReadyMinutes: Number.isNaN(parsedMax) ? null : parsedMax,
          },
        );
      });
    }

    if (conflictToggle) {
      conflictToggle.addEventListener('change', () => {
        const enabled = conflictToggle.checked;
        if (this.profile) {
          this.profile.setHighlightConflicts(enabled);
        }
        this.log(
          'attachToolsPageEventListeners',
          'info',
          'Updated nutrition conflict highlight setting',
          { enabled },
        );
      });
    }

    if (clearFavoritesBtn) {
      clearFavoritesBtn.addEventListener('click', () => {
        const previousIds =
          this.profile && Array.isArray(this.profile.favoriteRecipeIds)
            ? [...this.profile.favoriteRecipeIds]
            : [];
        if (this.profile) {
          this.profile.clearFavorites();
        }
        this.renderFavoritesLists(favoritesRecipesList, favoritesMealplansList);
        previousIds.forEach((id) => {
          this.syncFavoriteButtonsForRecipe(id);
        });
        this.log(
          'attachToolsPageEventListeners',
          'info',
          'Cleared favorite recipes from profile',
        );
      });
    }

    if (clearPlansBtn) {
      clearPlansBtn.addEventListener('click', () => {
        if (this.profile) {
          this.profile.clearSavedMealPlans();
        }

        const storage = Storage.getInstance();
        if (storage && typeof storage.saveMealPlan === 'function') {
          storage.saveMealPlan(null);
        }

        if (storage && typeof storage.saveSavedMealPlans === 'function') {
          storage.saveSavedMealPlans([]);
        }

        this.renderFavoritesLists(favoritesRecipesList, favoritesMealplansList);
        this.log(
          'attachToolsPageEventListeners',
          'info',
          'Cleared saved meal plans from profile and session storage',
        );
      });
    }

    if (clearAllDataBtn) {
      clearAllDataBtn.addEventListener('click', () => {
        const previousIds =
          this.profile && Array.isArray(this.profile.favoriteRecipeIds)
            ? [...this.profile.favoriteRecipeIds]
            : [];
        if (this.profile) {
          this.profile.clearAll();
        }
        // Clear shared shopping list and inventory
        if (
          this.shoppingList &&
          typeof this.shoppingList.clearItems === 'function'
        ) {
          this.shoppingList.clearItems();
        }
        if (this.inventory && typeof this.inventory.clearItems === 'function') {
          this.inventory.clearItems();
        }
        // Clear shared meals collection
        if (Array.isArray(meals)) {
          meals.splice(0, meals.length);
        }

        // Clear any session-backed meal plan so the current
        // browser session no longer restores an old plan.
        const storage = Storage.getInstance();
        if (storage && typeof storage.saveMealPlan === 'function') {
          storage.saveMealPlan(null);
        }
        if (storage && typeof storage.saveMealPlanState === 'function') {
          storage.saveMealPlanState(null);
        }
        if (storage && typeof storage.saveSavedMealPlans === 'function') {
          storage.saveSavedMealPlans([]);
        }
        if (dietTypeSelect) dietTypeSelect.value = '';
        if (allergensInput) allergensInput.value = '';
        if (maxTimeInput) maxTimeInput.value = '';
        if (conflictToggle) conflictToggle.checked = false;
        this.renderFavoritesLists(favoritesRecipesList, favoritesMealplansList);
        previousIds.forEach((id) => {
          this.syncFavoriteButtonsForRecipe(id);
        });
        this.log(
          'attachToolsPageEventListeners',
          'info',
          'Cleared all profile, shopping, and meal plan data',
        );
        if (storage && typeof storage.saveShoppingList === 'function') {
          storage.saveShoppingList(this.shoppingList);
        }
        if (storage && typeof storage.clearInventory === 'function') {
          storage.clearInventory();
        }
        if (
          typeof window !== 'undefined' &&
          typeof window.alert === 'function'
        ) {
          const toolsMessages =
            this.config && this.config.messages
              ? this.config.messages.tools || null
              : null;
          const message =
            toolsMessages && toolsMessages.clearAllDataAlert
              ? toolsMessages.clearAllDataAlert
              : '';
          if (message) {
            window.alert(message);
          }
        }
      });
    }

    // Populate favorites and saved meal plans lists on initial render
    this.renderFavoritesLists(favoritesRecipesList, favoritesMealplansList);

    if (exportMealplanBtn) {
      exportMealplanBtn.addEventListener('click', async () => {
        const json = this.exportMealPlanToJson();
        if (!json) {
          this.log(
            'attachToolsPageEventListeners',
            'info',
            'Export meal plan requested but no meals were available',
          );
          return;
        }

        try {
          if (typeof document !== 'undefined') {
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const toolsMessages =
              this.config && this.config.messages
                ? this.config.messages.tools || null
                : null;
            const filename =
              toolsMessages && toolsMessages.exportMealPlanFilename
                ? toolsMessages.exportMealPlanFilename
                : '';
            if (filename) {
              a.download = filename;
            }
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.log(
              'attachToolsPageEventListeners',
              'info',
              'Triggered meal plan JSON download link',
              { length: json.length },
            );
          }
        } catch (error) {
          this.log(
            'attachToolsPageEventListeners',
            'info',
            'Failed to export meal plan JSON',
            { error: String(error) },
          );
        }
      });
    }

    if (importMealplanBtn && importMealplanFileInput) {
      importMealplanBtn.addEventListener('click', () => {
        importMealplanFileInput.click();
      });

      importMealplanFileInput.addEventListener('change', async () => {
        const file = importMealplanFileInput.files
          ? importMealplanFileInput.files[0]
          : null;
        if (!file) {
          return;
        }

        try {
          const text = await (file.text
            ? file.text()
            : this.readFileAsText(file));
          const success = this.importMealPlanFromJson(text);
          this.log(
            'attachToolsPageEventListeners',
            'info',
            'Meal plan import requested from file picker',
            { success, fileName: file.name, size: file.size },
          );
        } catch (error) {
          this.log(
            'attachToolsPageEventListeners',
            'info',
            'Meal plan file import failed',
            { error: String(error) },
          );
        } finally {
          importMealplanFileInput.value = '';
        }
      });
    }

    if (exportShoppingBtn) {
      exportShoppingBtn.addEventListener('click', async () => {
        const json = this.exportShoppingListToJson();
        if (!json) {
          this.log(
            'attachToolsPageEventListeners',
            'info',
            'Export shopping list requested but no items were available',
          );
          return;
        }

        try {
          if (typeof document !== 'undefined') {
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const toolsMessages =
              this.config && this.config.messages
                ? this.config.messages.tools || null
                : null;
            const filename =
              toolsMessages && toolsMessages.exportShoppingListFilename
                ? toolsMessages.exportShoppingListFilename
                : '';
            if (filename) {
              a.download = filename;
            }
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.log(
              'attachToolsPageEventListeners',
              'info',
              'Triggered shopping list JSON download link',
              { length: json.length },
            );
          }
        } catch (error) {
          this.log(
            'attachToolsPageEventListeners',
            'info',
            'Failed to export shopping list JSON',
            { error: String(error) },
          );
        }
      });
    }

    if (importShoppingBtn && importShoppingFileInput) {
      importShoppingBtn.addEventListener('click', () => {
        importShoppingFileInput.click();
      });

      importShoppingFileInput.addEventListener('change', async () => {
        const file = importShoppingFileInput.files
          ? importShoppingFileInput.files[0]
          : null;
        if (!file) {
          return;
        }

        try {
          const text = await (file.text
            ? file.text()
            : this.readFileAsText(file));
          const success = this.importShoppingListFromJson(text);
          this.log(
            'attachToolsPageEventListeners',
            'info',
            'Shopping list import requested from file picker',
            { success, fileName: file.name, size: file.size },
          );
        } catch (error) {
          this.log(
            'attachToolsPageEventListeners',
            'info',
            'Shopping list file import failed',
            { error: String(error) },
          );
        } finally {
          importShoppingFileInput.value = '';
        }
      });
    }

    this.renderFavoritesLists(favoritesRecipesList, favoritesMealplansList);
  }

  exportMealPlanToJson() {
    if (!Array.isArray(meals) || meals.length === 0) {
      return '';
    }

    const payload = {
      meals: meals.map((meal) => ({ ...meal })),
    };

    const json = JSON.stringify(payload);
    this.log('exportMealPlanToJson', 'info', 'Exported meal plan to JSON', {
      mealCount: payload.meals.length,
      length: json.length,
    });
    return json;
  }

  exportShoppingListToJson() {
    if (!this.shoppingList || !Array.isArray(this.shoppingList.items)) {
      return '';
    }

    const list = this.shoppingList;
    const payload = {
      id: list.id ?? null,
      name: list.name || '',
      items: list.items.map((item) => ({ ...item })),
    };

    const json = JSON.stringify(payload);
    this.log(
      'exportShoppingListToJson',
      'info',
      'Exported shopping list to JSON',
      {
        itemCount: Array.isArray(payload.items) ? payload.items.length : 0,
        length: json.length,
      },
    );
    return json;
  }

  importMealPlanFromJson(jsonText) {
    if (!jsonText) {
      return false;
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (error) {
      this.log(
        'importMealPlanFromJson',
        'info',
        'Failed to parse meal plan JSON',
        { error: String(error) },
      );
      return false;
    }

    const incoming = Array.isArray(parsed?.meals)
      ? parsed.meals
      : Array.isArray(parsed)
        ? parsed
        : null;

    if (!incoming) {
      this.log(
        'importMealPlanFromJson',
        'info',
        'Parsed meal plan JSON did not contain a meals array',
      );
      return false;
    }

    if (!Array.isArray(meals)) {
      return false;
    }

    meals.splice(0, meals.length);
    incoming.forEach((raw) => {
      meals.push(new Meal(raw));
    });

    this.log('importMealPlanFromJson', 'info', 'Imported meal plan from JSON', {
      mealCount: meals.length,
    });
    return true;
  }

  importShoppingListFromJson(jsonText) {
    if (!jsonText) {
      return false;
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (error) {
      this.log(
        'importShoppingListFromJson',
        'info',
        'Failed to parse shopping list JSON',
        { error: String(error) },
      );
      return false;
    }

    const incomingItems = Array.isArray(parsed?.items)
      ? parsed.items
      : Array.isArray(parsed)
        ? parsed
        : null;

    if (!incomingItems) {
      this.log(
        'importShoppingListFromJson',
        'info',
        'Parsed shopping list JSON did not contain an items array',
      );
      return false;
    }

    if (!this.shoppingList) {
      return false;
    }

    const nextList = new ShoppingList({
      id: parsed?.id ?? null,
      name: parsed?.name || '',
      items: incomingItems,
    });

    this.shoppingList.id = nextList.id;
    this.shoppingList.name = nextList.name;
    this.shoppingList.items = nextList.items;

    this.log(
      'importShoppingListFromJson',
      'info',
      'Imported shopping list from JSON',
      {
        itemCount: Array.isArray(this.shoppingList.items)
          ? this.shoppingList.items.length
          : 0,
      },
    );
    return true;
  }

  readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () =>
        reject(reader.error || new Error('File read error'));
      reader.readAsText(file);
    });
  }

  renderFavoritesLists(recipesListElement, mealPlansListElement) {
    const toolsMessages =
      this.config && this.config.messages
        ? this.config.messages.tools || null
        : null;
    const recipeFallbackTemplate =
      toolsMessages &&
      typeof toolsMessages.favoriteRecipeFallbackNameTemplate === 'string'
        ? toolsMessages.favoriteRecipeFallbackNameTemplate
        : null;
    const mealPlanFallbackTemplate =
      toolsMessages &&
      typeof toolsMessages.savedMealPlanFallbackNameTemplate === 'string'
        ? toolsMessages.savedMealPlanFallbackNameTemplate
        : null;

    if (recipesListElement) {
      recipesListElement.innerHTML = '';
    }
    if (mealPlansListElement) {
      mealPlansListElement.innerHTML = '';
    }

    if (
      this.profile &&
      recipesListElement &&
      Array.isArray(this.profile.favoriteRecipeIds)
    ) {
      this.profile.favoriteRecipeIds.forEach((id) => {
        const recipe = recipes.find((r) => r && r.id === id);
        const li = document.createElement('li');
        const icon = document.createElement('span');
        icon.className = `${this.config.classes.favoriteListIcon} tool-mealplan-remove-icon`;
        icon.dataset.recipeId = String(id);
        icon.setAttribute('role', 'button');
        icon.setAttribute('tabindex', '0');
        const text = document.createElement('span');
        const displayName =
          recipe && recipe.title
            ? recipe.title
            : recipeFallbackTemplate && recipeFallbackTemplate.includes('{id}')
              ? recipeFallbackTemplate.replace('{id}', String(id))
              : String(id);
        text.textContent = displayName;
        const removeFavorite = (event) => {
          event.stopPropagation();
          if (this.profile) {
            this.profile.removeFavoriteRecipe(id);
          }
          this.syncFavoriteButtonsForRecipe(id);
          this.renderFavoritesLists(recipesListElement, mealPlansListElement);
          this.log(
            'renderFavoritesLists',
            'info',
            'Removed favorite recipe from Chow Tools favorites list',
            {
              id,
              title: recipe && recipe.title ? recipe.title : null,
            },
          );
        };
        icon.addEventListener('click', removeFavorite);
        icon.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            removeFavorite(event);
          }
        });
        li.appendChild(icon);
        li.appendChild(text);
        recipesListElement.appendChild(li);
      });
    }

    if (this.profile && mealPlansListElement) {
      const savedPlans = (() => {
        const storage = Storage.getInstance();
        return storage && typeof storage.loadSavedMealPlans === 'function'
          ? storage.loadSavedMealPlans()
          : [];
      })();

      const plansById = new Map();
      if (Array.isArray(savedPlans)) {
        savedPlans.forEach((plan) => {
          if (plan && plan.id != null) {
            plansById.set(plan.id, plan);
          }
        });
      }

      const profileIds = Array.isArray(this.profile.savedMealPlanIds)
        ? this.profile.savedMealPlanIds
        : [];

      let idsToRender = profileIds;
      if (idsToRender.length === 0 && Array.isArray(savedPlans)) {
        idsToRender = savedPlans
          .map((plan) => (plan && plan.id != null ? plan.id : null))
          .filter((id) => id != null);
      }

      idsToRender.forEach((id) => {
        const plan = plansById.get(id);
        const li = document.createElement('li');
        const rawName = plan && plan.name ? plan.name : null;
        const name =
          rawName ||
          (mealPlanFallbackTemplate && mealPlanFallbackTemplate.includes('{id}')
            ? mealPlanFallbackTemplate.replace('{id}', String(id))
            : String(id));

        const text = document.createElement('span');
        text.className = 'mealplan-name';
        text.textContent = name;

        const icon = document.createElement('span');
        icon.className = 'mealplan-remove-icon';
        icon.dataset.mealPlanId = String(id);
        icon.setAttribute('role', 'button');
        icon.setAttribute('tabindex', '0');

        li.dataset.mealPlanId = String(id);
        li.setAttribute('role', 'button');
        li.setAttribute('tabindex', '0');

        const removeSavedPlan = (event) => {
          event.stopPropagation();

          if (
            this.profile &&
            typeof this.profile.removeSavedMealPlan === 'function'
          ) {
            this.profile.removeSavedMealPlan(id);
          }

          const currentPlans = Array.isArray(savedPlans) ? savedPlans : [];
          const updatedPlans = currentPlans.filter(
            (planRecord) => !(planRecord && planRecord.id === id),
          );

          const storage = Storage.getInstance();
          if (storage && typeof storage.saveSavedMealPlans === 'function') {
            storage.saveSavedMealPlans(updatedPlans);
          }

          this.renderFavoritesLists(recipesListElement, mealPlansListElement);

          this.log(
            'renderFavoritesLists',
            'info',
            'Removed saved meal plan from Chow Tools list',
            {
              id,
              name,
            },
          );
        };

        icon.addEventListener('click', removeSavedPlan);
        icon.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            removeSavedPlan(event);
          }
        });

        const handleActivate = (event) => {
          event.preventDefault();

          const record = plansById.get(id);
          if (!record) {
            if (
              typeof window !== 'undefined' &&
              typeof window.alert === 'function'
            ) {
              const toolsMessages =
                this.config && this.config.messages
                  ? this.config.messages.tools || null
                  : null;
              const message =
                toolsMessages && toolsMessages.missingSavedMealPlanAlert
                  ? toolsMessages.missingSavedMealPlanAlert
                  : '';
              if (message) {
                window.alert(message);
              }
            }
            return;
          }

          const storage = Storage.getInstance();
          if (storage && typeof storage.saveMealPlan === 'function') {
            storage.saveMealPlan(record);
          }

          this.log(
            'renderFavoritesLists',
            'info',
            'Requested load of saved meal plan from Chow Tools list',
            {
              id,
              name,
            },
          );

          const site = window.site instanceof Site ? window.site : null;
          if (site && typeof site.loadPage === 'function') {
            site.loadPage('mealplan');
          }
        };

        li.addEventListener('click', handleActivate);
        li.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleActivate(event);
          }
        });

        li.appendChild(text);
        li.appendChild(icon);

        mealPlansListElement.appendChild(li);
      });
    }
  }

  syncFavoriteButtonsForRecipe(recipeId) {
    if (recipeId == null) return;

    if (typeof document === 'undefined') return;

    const idString = String(recipeId);
    const isFavorite =
      this.profile && Array.isArray(this.profile.favoriteRecipeIds)
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

  syncProfileToUi(config) {
    const mainElement = document.querySelector(`.${config.classes.main}`);
    if (!mainElement || !this.profile) return;

    const dietTypeSelect = mainElement.querySelector(
      `#${CSS.escape(config.ids.dietType)}`,
    );
    const allergensInput = mainElement.querySelector(
      `#${CSS.escape(config.ids.dietAllergens)}`,
    );
    const maxTimeInput = mainElement.querySelector(
      `#${CSS.escape(config.ids.dietMaxTime)}`,
    );
    const conflictToggle = mainElement.querySelector(
      `#${CSS.escape(config.ids.nutritionConflictToggle)}`,
    );

    if (dietTypeSelect) {
      dietTypeSelect.value = this.profile.dietType || '';
    }
    if (allergensInput) {
      allergensInput.value = this.profile.allergensText || '';
    }
    if (maxTimeInput) {
      maxTimeInput.value =
        this.profile.maxReadyMinutes != null
          ? String(this.profile.maxReadyMinutes)
          : '';
    }
    if (conflictToggle) {
      conflictToggle.checked = !!this.profile.highlightConflicts;
    }
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
}

bootLogger.moduleClassLoaded(import.meta.url, 'ToolsPage');

Logger.instrumentClass(ToolsPage, 'ToolsPage');

export { ToolsPage };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
