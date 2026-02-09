// Responsive Layout Module
// Purpose: To manage the layout and content of different pages.

export const homePage = {
  title: 'Welcome to Chow Planner',
  content: `
    <div class="search-bar">
      <input type="search" placeholder="SEARCH BAR">
      <button>Search</button>
    </div>
    <div class="home-actions">
      <div class="meal-plan-summary">
        MEAL PLAN SUMMARY
      </div>
      <button class="shopping-list-btn">SHOPPING LIST</button>
    </div>
    <div class="recipe-cards">
      <!-- Recipe cards will be dynamically inserted here -->
    </div>
  `,
};

export const recipesPage = {
  title: 'Recipes',
  content: '<p>Here you can find and manage your recipes.</p>',
};

export const mealPlanPage = {
  title: 'Meal Plan',
  content: '<p>Plan your meals for the week here.</p>',
};

export const shoppingPage = {
  title: 'Shopping List',
  content: '<p>Manage your shopping list here.</p>',
};

export const morePage = {
  title: 'More',
  content: '<p>More options and settings.</p>',
};

export function loadPage(pageName) {
  let page;
  switch (pageName) {
    case 'home':
      page = homePage;
      break;
    case 'recipes':
      page = recipesPage;
      break;
    case 'mealplan':
      page = mealPlanPage;
      break;
    case 'shopping':
      page = shoppingPage;
      break;
    case 'more':
      page = morePage;
      break;
    default:
      page = homePage;
  }

  const mainElement = document.querySelector('.main');
  const titleElement = mainElement.querySelector('h2');
  const contentElement = mainElement.querySelector('.content-wrapper');

  if (titleElement) {
    titleElement.textContent = page.title;
  }
  if (contentElement) {
    contentElement.innerHTML = page.content;
    if (pageName === 'home') {
      loadRecipeCards();
    }
  }
}

export async function loadRecipeCards(searchTerm = '') {
  const recipeCardContainer = document.querySelector('.recipe-cards');
  const template = document.getElementById('recipeCardTemplate');

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

