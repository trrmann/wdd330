// Responsive Layout Module
// Purpose: To manage the layout and content of different pages.

export const homePage = {
  init(templateId = 'homePageTemplate') {
    const template = document.getElementById(templateId);
    if (!template) return { title: 'Error', content: '' };
    return {
      title: 'Welcome to Chow Planner',
      content: template.innerHTML,
    };
  },
};

export const recipesPage = {
  init(templateId = 'recipesPageTemplate') {
    const template = document.getElementById(templateId);
    if (!template) return { title: 'Error', content: '' };
    return {
      title: 'Recipes',
      content: template.innerHTML,
    };
  },
};

export const mealPlanPage = {
  init(templateId = 'mealPlanPageTemplate') {
    const template = document.getElementById(templateId);
    if (!template) return { title: 'Error', content: '' };
    return {
      title: 'Meal Plan',
      content: template.innerHTML,
    };
  },
};

export const shoppingPage = {
  init(templateId = 'shoppingPageTemplate') {
    const template = document.getElementById(templateId);
    if (!template) return { title: 'Error', content: '' };
    return {
      title: 'Shopping List',
      content: template.innerHTML,
    };
  },
};

export const morePage = {
  init(templateId = 'morePageTemplate') {
    const template = document.getElementById(templateId);
    if (!template) return { title: 'Error', content: '' };
    return {
      title: 'More',
      content: template.innerHTML,
    };
  },
};



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

