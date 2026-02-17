import { bootLogger } from '../models/bootLogger.js';

import { Logger } from '../models/logger.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(import.meta.url, 'Defines Main shell component');

// Main Module
// Purpose: Manages the main content container wrapper and related styling hooks.
// Usage: const main = new Main(config, { logger });
class Main {
  // constructor: Creates the Main container and starts initialization.
  constructor(config, options = {}) {
    Object.defineProperties(this, Main.descriptors);
    this.logger = options.logger || null;
    this.log('constructor', 'objectCreateStart', 'Main.constructor: Starting');
    this.config = config;
    this.log(
      'constructor',
      'objectCreateComplete',
      'Main.constructor: Completed',
    );
    this.log('constructor', 'info', 'Main.constructor: Main created');
    // Immediately initialize after construction
    this.init();
  }

  // init: Builds main DOM, titles, content wrapper, and heart icon.
  init() {
    if (this.initialized) {
      // State: Reuse existing main element when already initialized.
      return this.log('init', 'passthroughMethodComplete', this.element, {
        toLogValue: (el) =>
          el ? { tag: el.tagName, class: el.className } : null,
      });
    }

    this.log('init', 'objectInitStart', 'Main.init: Starting');

    const template = document.getElementById(this.config.ids.templates.main);
    if (!template) {
      return this.log('init', 'passthroughMethodComplete', undefined, {
        canLogReturnValue: false,
        toLogValue: undefined,
        message: 'Main.init: Early return - no main template found',
      });
    }

    const mainElem = template.content.firstElementChild.cloneNode(true);
    // State: Configure main root element classes and id.
    if (this.config.classes.main) {
      mainElem.className = this.config.classes.main;
    }
    if (this.config.ids.main) {
      mainElem.id = this.config.ids.main;
    }

    const titleElement = mainElem.querySelector('h2');
    if (titleElement && this.config.classes.mainTitle) {
      // State: Apply main title styling class.
      titleElement.classList.add(this.config.classes.mainTitle);
    }

    const contentWrapper = mainElem.querySelector('div');
    if (contentWrapper && this.config.classes.mainContentWrapper) {
      // State: Apply main content wrapper styling class.
      contentWrapper.classList.add(this.config.classes.mainContentWrapper);
    }

    // Apply the heart icon mask from the configuration.
    // State: Update root CSS variable mask for the heart icon.
    this.applyHeartIconFromConfig();

    // State: Capture the main root element on the instance.
    this.element = mainElem;
    // State: Mark Main as fully initialized.
    this.initialized = true;
    this.log('init', 'objectInitComplete', 'Main.init: Completed');
    this.log('init', 'info', 'Main.init: Main initialized');
    return this.log('init', 'passthroughMethodComplete', this.element, {
      toLogValue: (el) =>
        el ? { tag: el.tagName, class: el.className } : null,
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
      element: {
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
      logger: {
        value: null,
        writable: true,
        enumerable: false,
        configurable: false,
      },
    };
  }

  // applyHeartIconFromConfig: Sets the CSS heart icon mask from config.
  applyHeartIconFromConfig() {
    if (!this.config || !this.config.images || !this.config.images.heart) {
      return;
    }

    const heartUrl = this.config.images.heart;
    const resolvedUrl = heartUrl.startsWith('/') ? heartUrl : `/${heartUrl}`;
    const maskValue = `url('${resolvedUrl}') no-repeat center / contain`;

    const root = document.documentElement;
    root.style.setProperty('--heart-icon-mask', maskValue);
  }

  // log: Delegates logging to the shared Logger using Main conventions.
  log(methodName, level, ...args) {
    if (!this.logger) return;

    if (this.logger.isSignatureLevel(level)) {
      if (typeof methodName === 'string') {
        if (level.startsWith('passthrough')) {
          return this.logger.passthroughMethod('Main', methodName, ...args);
        }
        this.logger.classMethodLog(level, 'Main', methodName, ...args);
      } else if (typeof methodName === 'object' && methodName !== null) {
        if (level.startsWith('function')) {
          this.logger.functionLog(level, ...args);
        } else {
          this.logger.classLog(level, ...args);
        }
      }
    } else {
      this.logger.classMethodLog(level, 'Main', methodName, ...args);
    }
  }

  // renderRecipeCards: Renders standard recipe cards into a container.
  static renderRecipeCards(config, options = {}) {
    const {
      recipeCardContainer,
      // contentWrapper is currently unused but kept for future extension.
      // eslint-disable-next-line no-unused-vars
      contentWrapper,
      template,
      wrapperTemplate,
      messageTemplate,
      recipeModels,
      profile,
      pageInstance,
      onCardClick,
    } = options;

    if (!recipeCardContainer || !template) {
      return;
    }

    // State: Clear existing recipe cards before rendering new ones.
    recipeCardContainer.innerHTML = '';

    const models = Array.isArray(recipeModels) ? recipeModels : [];

    if (models.length === 0) {
      let messageElement;
      if (messageTemplate && messageTemplate.content) {
        const fragment = messageTemplate.content.cloneNode(true);
        messageElement = fragment.firstElementChild;
      } else {
        messageElement = document.createElement('p');
      }
      if (messageElement && config.classes.recipeCardsEmptyMessage) {
        messageElement.className = config.classes.recipeCardsEmptyMessage;
      }
      // State: Show empty state message when no recipes are available.
      messageElement.textContent =
        config.messages && config.messages.noRecipesFound
          ? config.messages.noRecipesFound
          : '';
      recipeCardContainer.appendChild(messageElement);
      return;
    }

    models.forEach((recipe) => {
      let cardWrapper;
      if (wrapperTemplate && wrapperTemplate.content) {
        const fragment = wrapperTemplate.content.cloneNode(true);
        cardWrapper = fragment.firstElementChild;
      } else {
        cardWrapper = document.createElement('div');
      }
      if (cardWrapper && config.classes.recipeCard) {
        cardWrapper.classList.add(config.classes.recipeCard);
      }

      const cardClone = template.content.cloneNode(true);
      const favoriteButton = cardClone.querySelector('button');
      const img = cardClone.querySelector('img');
      const titleEl = cardClone.querySelector('h3');
      const descriptionEl = cardClone.querySelector('p');

      if (favoriteButton && config.classes.recipeDetailFavoriteToggle) {
        favoriteButton.classList.add(config.classes.recipeDetailFavoriteToggle);
      }
      if (img && config.classes.recipeCardImage) {
        img.classList.add(config.classes.recipeCardImage);
      }
      if (titleEl && config.classes.recipeCardTitle) {
        titleEl.classList.add(config.classes.recipeCardTitle);
      }
      if (descriptionEl && config.classes.recipeCardDescription) {
        descriptionEl.classList.add(config.classes.recipeCardDescription);
      }

      if (img) {
        img.src = recipe.image;
        const sharedMessages =
          config && config.messages ? config.messages.shared || null : null;
        const imageAltFallback =
          sharedMessages && sharedMessages.recipeImageAltFallback
            ? sharedMessages.recipeImageAltFallback
            : '';
        if (recipe.title) {
          img.alt = recipe.title;
        } else if (recipe.image && typeof recipe.image === 'string') {
          const fileName = recipe.image.split('/').pop() || imageAltFallback;
          img.alt = fileName;
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
        const used =
          typeof recipe.usedIngredientCount === 'number'
            ? recipe.usedIngredientCount
            : 0;
        const missed =
          typeof recipe.missedIngredientCount === 'number'
            ? recipe.missedIngredientCount
            : 0;
        const likes = typeof recipe.likes === 'number' ? recipe.likes : 0;

        const sharedMessages =
          config && config.messages ? config.messages.shared || null : null;
        const templateText =
          sharedMessages && sharedMessages.recipeCardSummaryTemplate
            ? sharedMessages.recipeCardSummaryTemplate
            : '';
        const summary = templateText
          .replace('{used}', String(used))
          .replace('{missed}', String(missed))
          .replace('{likes}', String(likes));
        descriptionEl.textContent = summary;
      }

      if (
        favoriteButton &&
        recipe &&
        recipe.id != null &&
        profile &&
        pageInstance &&
        typeof pageInstance.updateFavoriteButtonState === 'function' &&
        typeof pageInstance.syncFavoriteButtonsForRecipe === 'function'
      ) {
        // State: Initialize favorite toggle based on current profile favorites.
        favoriteButton.dataset.recipeId = String(recipe.id);
        const isFavorite = Array.isArray(profile?.favoriteRecipeIds)
          ? profile.favoriteRecipeIds.includes(recipe.id)
          : false;
        pageInstance.updateFavoriteButtonState(favoriteButton, isFavorite);
        favoriteButton.addEventListener('click', (event) => {
          event.stopPropagation();
          const currentlyFavorite = Array.isArray(profile?.favoriteRecipeIds)
            ? profile.favoriteRecipeIds.includes(recipe.id)
            : false;
          if (currentlyFavorite) {
            // State: Remove recipe from user's favorite recipes.
            profile.removeFavoriteRecipe(recipe.id);
          } else {
            // State: Add recipe to user's favorite recipes.
            profile.addFavoriteRecipe(recipe.id);
          }
          const nowFavorite = !currentlyFavorite;
          // State: Sync favorite button visuals across all recipe cards.
          pageInstance.syncFavoriteButtonsForRecipe(recipe.id);
          if (
            typeof pageInstance.log === 'function' &&
            typeof pageInstance.config === 'object'
          ) {
            pageInstance.log(
              'loadRecipeCards',
              'info',
              `${pageInstance.constructor.name}.loadRecipeCards: Toggled favorite for recipe`,
              { id: recipe.id, title: recipe.title, nowFavorite },
            );
          }
        });
      }

      cardWrapper.appendChild(cardClone);

      let cardClickHandler = onCardClick;
      if (
        typeof cardClickHandler !== 'function' &&
        pageInstance &&
        typeof pageInstance.showRecipeDetail === 'function'
      ) {
        cardClickHandler = (recipeForClick) => {
          pageInstance.showRecipeDetail(config, recipeForClick);
        };
      }

      if (typeof cardClickHandler === 'function') {
        cardWrapper.addEventListener('click', () => {
          cardClickHandler(recipe);
        });
      }

      // State: Add rendered recipe card to the cards container.
      recipeCardContainer.appendChild(cardWrapper);
    });
  }

  // renderRecipeDetailOverlay: Builds standard recipe detail overlay UI.
  static renderRecipeDetailOverlay(config, options = {}) {
    const {
      pageInstance,
      logPrefix = 'page',
      recipe,
      cardContainer,
      contentWrapper,
      detailTemplate,
      ingredientTemplate,
      nutritionTemplate,
      profile,
      scale = 1,
      metaTextOverride,
      buildIngredientLabel,
      elementAttrs,
      applyAttrs,
    } = options;

    const method = 'showRecipeDetail';

    if (!pageInstance || typeof pageInstance.log !== 'function') {
      return;
    }

    pageInstance.log(
      method,
      'lifecycle',
      `${logPrefix}.showRecipeDetail: Building detail overlay`,
      { id: recipe?.id, title: recipe?.title },
    );

    if (!contentWrapper) {
      pageInstance.log(
        method,
        'info',
        `${logPrefix}.showRecipeDetail: No content wrapper found`,
      );
      return;
    }

    if (!detailTemplate) {
      pageInstance.log(
        method,
        'info',
        `${logPrefix}.showRecipeDetail: No detail template found`,
      );
      return;
    }

    const overlay = document.createElement('div');
    overlay.className = config.classes.recipeDetailOverlay;

    const detailFragment = detailTemplate.content.cloneNode(true);

    const detailSection = detailFragment.querySelector('section');
    if (detailSection) {
      if (config.classes.recipeDetail) {
        detailSection.classList.add(config.classes.recipeDetail);
      }
      const closeBtn = detailSection.querySelector('button');
      if (closeBtn && config.classes.recipeDetailClose) {
        closeBtn.classList.add(config.classes.recipeDetailClose);
      }
      const headerDiv = detailSection.querySelector('div');
      if (headerDiv) {
        const img = headerDiv.querySelector('img');
        if (img && config.classes.recipeDetailImage) {
          img.classList.add(config.classes.recipeDetailImage);
        }
        const summaryDiv = headerDiv.querySelector('div');
        if (summaryDiv) {
          const title = summaryDiv.querySelector('h3');
          if (title && config.classes.recipeDetailTitle) {
            title.classList.add(config.classes.recipeDetailTitle);
          }
          const meta = summaryDiv.querySelector('p');
          if (meta && config.classes.recipeDetailMeta) {
            meta.classList.add(config.classes.recipeDetailMeta);
          }
        }
      }
      const bodyDiv = detailSection.querySelector('div:nth-of-type(2)');
      if (bodyDiv) {
        const ingredientsSection = bodyDiv.querySelector('section');
        if (ingredientsSection) {
          const hint = ingredientsSection.querySelector('p');
          const list = ingredientsSection.querySelector('ul');
          if (hint && config.classes.recipeDetailIngredientsHint) {
            hint.classList.add(config.classes.recipeDetailIngredientsHint);
          }
          if (list && config.classes.recipeDetailIngredientsList) {
            list.classList.add(config.classes.recipeDetailIngredientsList);
          }
        }
        const instructionsSection = bodyDiv.querySelector(
          'section:nth-of-type(2)',
        );
        if (instructionsSection) {
          const instructions = instructionsSection.querySelector('p');
          if (instructions && config.classes.recipeDetailInstructionsText) {
            instructions.classList.add(
              config.classes.recipeDetailInstructionsText,
            );
          }
        }
        const actionsSection = bodyDiv.querySelector('section:nth-of-type(3)');
        if (actionsSection) {
          const favBtn = actionsSection.querySelector('button');
          const nutritionBtn = actionsSection.querySelector(
            'button:nth-of-type(2)',
          );
          if (favBtn && config.classes.recipeDetailFavoriteToggle) {
            favBtn.classList.add(config.classes.recipeDetailFavoriteToggle);
          }
          if (nutritionBtn && config.classes.recipeDetailNutritionBtn) {
            nutritionBtn.classList.add(config.classes.recipeDetailNutritionBtn);
          }
        }
      }
    }

    const closeButton = detailFragment.querySelector(
      `.${config.classes.recipeDetailClose}`,
    );
    const nutritionButton = detailFragment.querySelector(
      `.${config.classes.recipeDetailNutritionBtn}`,
    );
    const favoriteButton = detailFragment.querySelector(
      `.${config.classes.recipeDetailFavoriteToggle}`,
    );
    const titleEl = detailFragment.querySelector(
      `.${config.classes.recipeDetailTitle}`,
    );
    const metaEl = detailFragment.querySelector(
      `.${config.classes.recipeDetailMeta}`,
    );
    const imgEl = detailFragment.querySelector(
      `.${config.classes.recipeDetailImage}`,
    );
    const ingredientsList = detailFragment.querySelector(
      `.${config.classes.recipeDetailIngredientsList}`,
    );
    const instructionsEl = detailFragment.querySelector(
      `.${config.classes.recipeDetailInstructionsText}`,
    );

    if (titleEl) {
      titleEl.textContent = recipe?.title || '';
    }

    if (metaEl) {
      if (typeof metaTextOverride === 'string' && metaTextOverride.length > 0) {
        metaEl.textContent = metaTextOverride;
      } else {
        const sharedMessages =
          config && config.messages ? config.messages.shared || null : null;
        const notAvailable =
          sharedMessages && sharedMessages.notAvailable
            ? sharedMessages.notAvailable
            : '';
        const metaTemplate =
          sharedMessages &&
          typeof sharedMessages.recipeDetailMetaTemplate === 'string'
            ? sharedMessages.recipeDetailMetaTemplate
            : null;
        const readyDisplay =
          typeof recipe?.readyInMinutes === 'number'
            ? `${recipe.readyInMinutes} min`
            : notAvailable;
        const servingsDisplay =
          typeof recipe?.servings === 'number' ? recipe.servings : notAvailable;
        const likesDisplay =
          typeof recipe?.likes === 'number' && Number.isFinite(recipe.likes)
            ? recipe.likes
            : 0;
        if (metaTemplate) {
          const metaText = metaTemplate
            .replace('{ready}', String(readyDisplay))
            .replace('{servings}', String(servingsDisplay))
            .replace('{likes}', String(likesDisplay));
          metaEl.textContent = metaText;
        } else {
          metaEl.textContent = '';
        }
      }
    }

    if (imgEl) {
      imgEl.src = recipe?.image || '';
      const sharedMessages =
        config && config.messages ? config.messages.shared || null : null;
      const imageAltFallback =
        sharedMessages && sharedMessages.recipeImageAltFallback
          ? sharedMessages.recipeImageAltFallback
          : '';
      if (recipe?.title) {
        imgEl.alt = recipe.title;
      } else if (imageAltFallback) {
        imgEl.alt = imageAltFallback;
      } else {
        imgEl.removeAttribute('alt');
      }
    }

    if (ingredientsList && Array.isArray(recipe?.extendedIngredients)) {
      // State: Clear existing ingredient items before populating detail list.
      ingredientsList.innerHTML = '';
      recipe.extendedIngredients.forEach((ingredient) => {
        if (!ingredient) return;
        const li = document.createElement('li');

        if (typeof buildIngredientLabel === 'function') {
          li.textContent = buildIngredientLabel(ingredient, {
            recipe,
            scale,
          });
        } else if (ingredient.originalString) {
          li.textContent = ingredient.originalString;
        } else {
          li.textContent = ingredient.name || '';
        }

        li.addEventListener('click', () => {
          if (typeof pageInstance.showIngredientDetail === 'function') {
            pageInstance.showIngredientDetail(
              config,
              overlay,
              recipe,
              ingredient,
              scale,
            );
          }
        });

        ingredientsList.appendChild(li);
      });
    }

    if (instructionsEl) {
      instructionsEl.textContent = recipe?.instructions || '';
    }

    if (
      favoriteButton &&
      recipe &&
      recipe.id != null &&
      profile &&
      typeof pageInstance.updateFavoriteButtonState === 'function' &&
      typeof pageInstance.syncFavoriteButtonsForRecipe === 'function'
    ) {
      // State: Initialize favorite toggle within recipe detail overlay.
      favoriteButton.dataset.recipeId = String(recipe.id);
      const isFavorite = Array.isArray(profile?.favoriteRecipeIds)
        ? profile.favoriteRecipeIds.includes(recipe.id)
        : false;
      pageInstance.updateFavoriteButtonState(favoriteButton, isFavorite);
      favoriteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const currentlyFavorite = Array.isArray(profile?.favoriteRecipeIds)
          ? profile.favoriteRecipeIds.includes(recipe.id)
          : false;
        if (currentlyFavorite) {
          // State: Remove recipe from user's favorite recipes.
          profile.removeFavoriteRecipe(recipe.id);
        } else {
          // State: Add recipe to user's favorite recipes.
          profile.addFavoriteRecipe(recipe.id);
        }
        const nowFavorite = !currentlyFavorite;
        // State: Sync favorite button visuals for this recipe across views.
        pageInstance.syncFavoriteButtonsForRecipe(recipe.id);
        if (typeof pageInstance.log === 'function') {
          pageInstance.log(
            method,
            'info',
            `${logPrefix}.showRecipeDetail: Toggled favorite for recipe from detail`,
            { id: recipe.id, title: recipe.title, nowFavorite },
          );
        }
      });
    }

    if (
      typeof applyAttrs === 'function' &&
      elementAttrs &&
      closeButton &&
      elementAttrs.recipeDetailClose
    ) {
      applyAttrs(closeButton, elementAttrs.recipeDetailClose);
    }

    if (
      typeof applyAttrs === 'function' &&
      elementAttrs &&
      favoriteButton &&
      elementAttrs.recipeDetailFavoriteToggle
    ) {
      applyAttrs(favoriteButton, elementAttrs.recipeDetailFavoriteToggle);
    }

    if (nutritionButton) {
      nutritionButton.addEventListener('click', () => {
        if (typeof pageInstance.showNutritionDetail === 'function') {
          pageInstance.showNutritionDetail(config, overlay, recipe);
        }
      });
    }

    if (closeButton) {
      closeButton.addEventListener('click', () => {
        if (typeof pageInstance.log === 'function') {
          pageInstance.log(
            method,
            'lifecycle',
            `${logPrefix}.showRecipeDetail: Close clicked, removing overlay`,
            { id: recipe?.id },
          );
        }
        // State: Remove recipe detail overlay from the DOM.
        overlay.remove();

        if (cardContainer) {
          // State: Restore recipe cards visibility and accessibility after closing.
          cardContainer.classList.remove(config.classes.recipeCardsHidden);
          cardContainer.removeAttribute('aria-hidden');
        }
      });
    }

    overlay.appendChild(detailFragment);

    if (ingredientTemplate) {
      const ingredientFragment = ingredientTemplate.content.cloneNode(true);
      const ingredientSection = ingredientFragment.querySelector('section');
      if (ingredientSection) {
        if (config.classes.ingredientDetail) {
          ingredientSection.classList.add(config.classes.ingredientDetail);
        }
        const closeBtn = ingredientSection.querySelector('button');
        if (closeBtn && config.classes.ingredientDetailClose) {
          closeBtn.classList.add(config.classes.ingredientDetailClose);
        }
        const headerDiv = ingredientSection.querySelector('div');
        if (headerDiv) {
          const img = headerDiv.querySelector('img');
          if (img && config.classes.ingredientDetailImage) {
            img.classList.add(config.classes.ingredientDetailImage);
          }
          const summaryDiv = headerDiv.querySelector('div');
          if (summaryDiv) {
            const title = summaryDiv.querySelector('h3');
            const meta = summaryDiv.querySelector('p');
            if (title && config.classes.ingredientDetailTitle) {
              title.classList.add(config.classes.ingredientDetailTitle);
            }
            if (meta && config.classes.ingredientDetailMeta) {
              meta.classList.add(config.classes.ingredientDetailMeta);
            }
          }
        }
        const bodyDiv = ingredientSection.querySelector('div:nth-of-type(2)');
        if (bodyDiv) {
          const original = bodyDiv.querySelector('p');
          const amount = bodyDiv.querySelector('p:nth-of-type(2)');
          const aisle = bodyDiv.querySelector('p:nth-of-type(3)');
          const metaInfo = bodyDiv.querySelector('p:nth-of-type(4)');
          if (original && config.classes.ingredientDetailOriginal) {
            original.classList.add(config.classes.ingredientDetailOriginal);
          }
          if (amount && config.classes.ingredientDetailAmount) {
            amount.classList.add(config.classes.ingredientDetailAmount);
          }
          if (aisle && config.classes.ingredientDetailAisle) {
            aisle.classList.add(config.classes.ingredientDetailAisle);
          }
          if (metaInfo && config.classes.ingredientDetailMetaInfo) {
            metaInfo.classList.add(config.classes.ingredientDetailMetaInfo);
          }
        }
        ingredientSection.setAttribute('hidden', 'true');
      }
      overlay.appendChild(ingredientFragment);
    }

    if (nutritionTemplate) {
      const nutritionFragment = nutritionTemplate.content.cloneNode(true);
      const nutritionSection = nutritionFragment.querySelector('section');
      if (nutritionSection) {
        if (config.classes.nutritionDetail) {
          nutritionSection.classList.add(config.classes.nutritionDetail);
        }
        const headerDiv = nutritionSection.querySelector('div');
        if (headerDiv) {
          const summaryDiv = headerDiv.querySelector('div');
          if (summaryDiv) {
            const title = summaryDiv.querySelector('h3');
            const meta = summaryDiv.querySelector('p');
            if (title && config.classes.nutritionDetailTitle) {
              title.classList.add(config.classes.nutritionDetailTitle);
            }
            if (meta && config.classes.nutritionDetailMeta) {
              meta.classList.add(config.classes.nutritionDetailMeta);
            }
          }
        }
        const bodyDiv = nutritionSection.querySelector('div:nth-of-type(2)');
        if (bodyDiv) {
          const list = bodyDiv.querySelector('ul');
          if (list && config.classes.nutritionDetailList) {
            list.classList.add(config.classes.nutritionDetailList);
          }
        }
        nutritionSection.setAttribute('hidden', 'true');
      }
      overlay.appendChild(nutritionFragment);
    }

    // State: Attach recipe detail overlay into main content.
    contentWrapper.appendChild(overlay);

    if (cardContainer) {
      // State: Hide recipe cards while recipe detail overlay is visible.
      cardContainer.classList.add(config.classes.recipeCardsHidden);
      cardContainer.setAttribute('aria-hidden', 'true');
    }

    pageInstance.log(
      method,
      'lifecycle',
      `${logPrefix}.showRecipeDetail: Overlay rendered`,
      { id: recipe?.id },
    );

    return overlay;
  }

  // showIngredientDetail: Shared implementation for ingredient detail overlays.
  static showIngredientDetail(config, options = {}) {
    const {
      overlay,
      recipe,
      ingredient,
      pageInstance,
      logPrefix = 'page',
      scale = 1,
      formatScaledAmount,
      elementAttrs,
      applyAttrs,
    } = options;

    const method = 'showIngredientDetail';

    if (!pageInstance || typeof pageInstance.log !== 'function') {
      return;
    }

    pageInstance.log(
      method,
      'lifecycle',
      `${logPrefix}.showIngredientDetail: Starting`,
      {
        recipeId: recipe?.id,
        ingredientId: ingredient?.id,
        ingredientName: ingredient?.name,
      },
    );

    if (!overlay) {
      pageInstance.log(
        method,
        'info',
        `${logPrefix}.showIngredientDetail: No overlay provided`,
      );
      return;
    }

    const recipeSection = overlay.querySelector(
      `.${config.classes.recipeDetail}`,
    );
    const ingredientSection = overlay.querySelector(
      `.${config.classes.ingredientDetail}`,
    );

    if (!ingredientSection || !recipeSection) {
      pageInstance.log(
        method,
        'info',
        `${logPrefix}.showIngredientDetail: Required sections not found`,
      );
      return;
    }

    const titleEl = ingredientSection.querySelector(
      `.${config.classes.ingredientDetailTitle}`,
    );
    const metaEl = ingredientSection.querySelector(
      `.${config.classes.ingredientDetailMeta}`,
    );
    const imgEl = ingredientSection.querySelector(
      `.${config.classes.ingredientDetailImage}`,
    );
    const originalEl = ingredientSection.querySelector(
      `.${config.classes.ingredientDetailOriginal}`,
    );
    const amountEl = ingredientSection.querySelector(
      `.${config.classes.ingredientDetailAmount}`,
    );
    const aisleEl = ingredientSection.querySelector(
      `.${config.classes.ingredientDetailAisle}`,
    );
    const metaInfoEl = ingredientSection.querySelector(
      `.${config.classes.ingredientDetailMetaInfo}`,
    );
    const closeButton = ingredientSection.querySelector(
      `.${config.classes.ingredientDetailClose}`,
    );

    if (titleEl) {
      titleEl.textContent = ingredient.name || ingredient.originalString || '';
    }

    if (metaEl) {
      metaEl.textContent = recipe?.title ? `From recipe: ${recipe.title}` : '';
    }

    if (imgEl) {
      imgEl.src = ingredient.image || '';
      imgEl.alt = ingredient.name || 'Ingredient image';
    }

    if (originalEl) {
      originalEl.textContent = ingredient.originalString || '';
    }

    if (amountEl) {
      const baseAmount =
        typeof ingredient.amount === 'number' &&
        Number.isFinite(ingredient.amount)
          ? ingredient.amount
          : null;

      let amountText;
      if (
        baseAmount != null &&
        typeof scale === 'number' &&
        Number.isFinite(scale) &&
        typeof formatScaledAmount === 'function'
      ) {
        const scaledAmount = baseAmount * scale;
        amountText = formatScaledAmount(scaledAmount);
      } else if (baseAmount != null) {
        amountText = String(baseAmount);
      } else {
        amountText = '';
      }

      const unit = ingredient.unitLong || ingredient.unit || '';

      amountEl.textContent =
        amountText && unit
          ? `Amount: ${amountText} ${unit}`.trim()
          : amountText
            ? `Amount: ${amountText}`
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
      const metaInfo = Array.isArray(ingredient.metaInformation)
        ? ingredient.metaInformation.join(', ')
        : '';
      metaInfoEl.textContent = metaInfo ? `Details: ${metaInfo}` : '';
    }

    // State: Swap from recipe section to ingredient detail section.
    recipeSection.setAttribute('hidden', 'true');
    ingredientSection.removeAttribute('hidden');

    if (
      typeof applyAttrs === 'function' &&
      elementAttrs &&
      closeButton &&
      elementAttrs.ingredientDetailClose
    ) {
      // State: Apply configured attributes to ingredient close button.
      applyAttrs(closeButton, elementAttrs.ingredientDetailClose);
    }

    if (closeButton) {
      closeButton.addEventListener('click', () => {
        pageInstance.log(
          method,
          'lifecycle',
          `${logPrefix}.showIngredientDetail: Close clicked, returning to recipe detail`,
          {
            recipeId: recipe?.id,
            ingredientId: ingredient?.id,
          },
        );
        // State: Restore recipe section and hide ingredient detail section.
        ingredientSection.setAttribute('hidden', 'true');
        recipeSection.removeAttribute('hidden');
      });
    }
  }

  // showNutritionDetail: Shared implementation for recipe nutrition overlays.
  static showNutritionDetail(config, options = {}) {
    const { overlay, recipe, pageInstance, logPrefix = 'page' } = options;
    const method = 'showNutritionDetail';

    if (!pageInstance || typeof pageInstance.log !== 'function') {
      return;
    }

    pageInstance.log(
      method,
      'lifecycle',
      `${logPrefix}.showNutritionDetail: Starting`,
      { id: recipe?.id, title: recipe?.title },
    );

    if (!overlay) {
      pageInstance.log(
        method,
        'info',
        `${logPrefix}.showNutritionDetail: No overlay provided`,
      );
      return;
    }

    const recipeSection = overlay.querySelector(
      `.${config.classes.recipeDetail}`,
    );
    const nutritionSection = overlay.querySelector(
      `.${config.classes.nutritionDetail}`,
    );

    if (!nutritionSection || !recipeSection) {
      pageInstance.log(
        method,
        'info',
        `${logPrefix}.showNutritionDetail: Required sections not found`,
      );
      return;
    }

    const titleEl = nutritionSection.querySelector(
      `.${config.classes.nutritionDetailTitle}`,
    );
    const metaEl = nutritionSection.querySelector(
      `.${config.classes.nutritionDetailMeta}`,
    );
    const listEl = nutritionSection.querySelector(
      `.${config.classes.nutritionDetailList}`,
    );
    const closeButton = nutritionSection.querySelector(
      `.${config.classes.nutritionDetailClose}`,
    );

    if (titleEl) {
      // Home/Recipes use a static "Nutrition" title; MealPlan uses recipe title.
      const titleText =
        logPrefix === 'MealPlanPage'
          ? recipe?.title || 'Nutrition'
          : 'Nutrition';
      titleEl.textContent = titleText;
    }

    if (metaEl) {
      const servings =
        typeof recipe?.servings === 'number' ? recipe.servings : 'N/A';
      metaEl.textContent = recipe?.title
        ? `For ${servings} serving(s) of ${recipe.title}`
        : `For ${servings} serving(s)`;
    }

    if (listEl) {
      // State: Reset nutrition list before populating with nutrient items.
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

    // State: Swap from recipe section to nutrition detail section.
    recipeSection.setAttribute('hidden', 'true');
    nutritionSection.removeAttribute('hidden');

    if (closeButton) {
      closeButton.addEventListener('click', () => {
        pageInstance.log(
          method,
          'lifecycle',
          `${logPrefix}.showNutritionDetail: Close clicked, returning to recipe detail`,
          { id: recipe?.id },
        );
        // State: Restore recipe section and hide nutrition detail section.
        nutritionSection.setAttribute('hidden', 'true');
        recipeSection.removeAttribute('hidden');
      });
    }
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'Main');

Logger.instrumentClass(Main, 'Main');

export { Main };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
