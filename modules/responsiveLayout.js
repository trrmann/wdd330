// Responsive Layout Module
// Purpose: To manage the layout and content of different pages.

export const homePage = {
  init(config) {
    const template = document.getElementById(config.homePageTemplateId);
    if (!template) return { title: 'Error', content: '' };
    const content = template.innerHTML;
    // The loadRecipeCards function will be called after this content is injected
    // which will populate the .recipe-cards div.
    loadRecipeCards(config);
    this.addEventListeners(config);
    return {
      title: 'Welcome to Chow Planner',
      content: content,
    };
  },
  addEventListeners(config) {
    const mainElement = document.querySelector(`.${config.mainClassName}`);
    if (!mainElement) return;

    const searchInput = mainElement.querySelector(config.searchBarSelector);
    const searchButton = mainElement.querySelector(config.searchButtonSelector);

    const triggerSearch = () => {
      const searchTerm = searchInput.value.toLowerCase();
      loadRecipeCards(config, searchTerm);
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
        // This is a bit of a hack, we should probably have a better way to do this
        // but for now it works.
        document.querySelector(`${config.menuItemSelector}[href="#mealplan"]`).click();
      });
    }

    const shoppingListButton = mainElement.querySelector(
      config.shoppingListButtonSelector,
    );
    if (shoppingListButton) {
      shoppingListButton.addEventListener('click', () => {
        // This is a bit of a hack, we should probably have a better way to do this
        // but for now it works.
        document.querySelector(`${config.menuItemSelector}[href="#shopping"]`).click();
      });
    }
  },
};

export const recipesPage = {
  init(config) {
    const template = document.getElementById(config.recipesPageTemplateId);
    if (!template) return { title: 'Error', content: '' };
    return {
      title: 'Recipes',
      content: template.innerHTML,
    };
  },
};

export const mealPlanPage = {
  init(config) {
    const template = document.getElementById(config.mealPlanPageTemplateId);
    if (!template) return { title: 'Error', content: '' };
    return {
      title: 'Meal Plan',
      content: template.innerHTML,
    };
  },
};

export const shoppingPage = {
  init(config) {
    const template = document.getElementById(config.shoppingPageTemplateId);
    if (!template) return { title: 'Error', content: '' };
    return {
      title: 'Shopping List',
      content: template.innerHTML,
    };
  },
};

export const morePage = {
  init(config) {
    const template = document.getElementById(config.morePageTemplateId);
    if (!template) return { title: 'Error', content: '' };
    return {
      title: 'More',
      content: template.innerHTML,
    };
  },
};

export async function loadRecipeCards(config, searchTerm = '') {
  const recipeCardContainer = document.querySelector(config.recipeCardsSelector);
  const template = document.getElementById(config.recipeCardTemplateId);

  if (!recipeCardContainer || !template) return;

  recipeCardContainer.innerHTML = ''; // Clear existing cards

  try {
    const response = await fetch('./data/mock-recipes.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let recipes = await response.json();

    // Filter recipes if a search term is provided
    if (searchTerm) {
      recipes = recipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchTerm) ||
          recipe.description.toLowerCase().includes(searchTerm),
      );
    }

    if (recipes.length === 0) {
      recipeCardContainer.innerHTML = '<p>No recipes found.</p>';
      return;
    }

    recipes.forEach((recipe) => {
      const cardClone = template.content.cloneNode(true);
      const img = cardClone.querySelector('img');
      const title = cardClone.querySelector('h4');
      const description = cardClone.querySelector('p');

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
      recipeCardContainer.appendChild(cardClone);
    });
  } catch (error) {
    console.error('Error loading recipe cards:', error);
    recipeCardContainer.innerHTML =
      '<p>Could not load recipes. Please try again later.</p>';
  }
}

