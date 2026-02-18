// Boot (pre-Site) logging config.
// Independent of siteConfig and the app Logger.
export const bootLogConfig = {
  enabled: true,
  prefix: '[boot]',
  levels: {
    moduleLoadStarted: true,
    moduleLoadCompleted: true,
    moduleClassLoaded: true,
    moduleInfo: true,
  },
  // Optional per-module overrides.
  // Keys are matched against the module name derived from import.meta.url.
  // For this project that usually looks like
  //   'modules/models/storage.js' or 'modules/views/site.js' or 'scripts/index.js'.
  //
  // Example:
  // modules: {
  //   'modules/views/site.js': { enabled: true, prefix: '[boot:site]' },
  //   'modules/models/logger.js': { levels: { moduleLoadStarted: false } },
  // },
  modules: {
    // models
    'modules/models/apiAccess.js': {},
    'modules/models/logger.js': {},
    'modules/models/mealPlan.js': {},
    'modules/models/shoppingList.js': {},
    'modules/models/storage.js': {},

    // views
    'modules/views/site.js': {},
    'modules/views/homePage.js': {},
    'modules/views/recipesPage.js': {},
    'modules/views/mealPlanPage.js': {},
    'modules/views/shoppingPage.js': {},
    'modules/views/toolsPage.js': {},

    // scripts
    'scripts/index.js': {},
  },
};
