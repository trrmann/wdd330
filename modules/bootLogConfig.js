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
  // Common keys will look like: 'modules/home.js' or 'scripts/home.js'.
  //
  // Example:
  // modules: {
  //   'modules/home.js': { enabled: true, prefix: '[boot:home]' },
  //   'modules/logger.js': { levels: { moduleLoadStarted: false } },
  // },
  modules: {
    // modules/
    'modules/apiAccess.js': {},
    'modules/home.js': {},
    'modules/localStorage.js': {},
    'modules/logger.js': {},
    'modules/mealPlan.js': {},
    'modules/recipeSearch.js': {},
    'modules/responsiveLayout.js': {},
    'modules/shoppingList.js': {},

    // scripts/
    'scripts/boot.js': {},
    'scripts/getDates.js': {},
    'scripts/home.js': {},
  },
};
