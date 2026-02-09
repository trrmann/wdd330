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
