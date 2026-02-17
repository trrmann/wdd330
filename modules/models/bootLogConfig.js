// Boot (pre-Site) logging config.
// Independent of siteConfig and the app Logger.
export const bootLogConfig = {
  enabled: false,
  prefix: '[boot]',
  levels: {
    moduleLoadStarted: false,
    moduleLoadCompleted: false,
    moduleClassLoaded: false,
    moduleInfo: false,
  },
  // Optional per-module overrides.
  // Keys are matched against the module name derived from import.meta.url.
  // Common keys will look like: 'modules/site.js' or 'scripts/index.js'.
  //
  // Example:
  // modules: {
  //   'modules/site.js': { enabled: true, prefix: '[boot:site]' },
  //   'modules/logger.js': { levels: { moduleLoadStarted: false } },
  // },
  modules: {
    // modules/
    'modules/apiAccess.js': {},
    'modules/site.js': {},
    'modules/logger.js': {},
    'modules/mealPlan.js': {},
    'modules/recipeSearch.js': {},
    'modules/homePage.js': {},
    'modules/recipesPage.js': {},
    'modules/mealPlanPage.js': {},
    'modules/shoppingPage.js': {},
    'modules/toolsPage.js': {},
    'modules/shoppingList.js': {},

    // scripts/
    'scripts/index.js': {},
  },
};
