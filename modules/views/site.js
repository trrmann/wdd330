// Purpose: Defines the Site shell responsible for loading siteConfig.json,
// assembling the Header/Menu/Main/Footer views, wiring the shared Logger,
// and routing between page controllers (home, recipes, meal plan, shopping, tools).
//
// Usage:
//   import { Site } from './modules/views/site.js';
//   document.addEventListener('DOMContentLoaded', () => {
//     new Site();
//   });

import { bootLogger } from '../models/bootLogger.js';

import { HomePage } from './homePage.js';
import { RecipesPage } from './recipesPage.js';
import { MealPlanPage } from './mealPlanPage.js';
import { ShoppingPage } from './shoppingPage.js';
import { ToolsPage } from './toolsPage.js';
import { Header } from './header.js';
import { Menu } from './menu.js';
import { Main } from './main.js';
import { Footer } from './footer.js';
import { Logger } from '../models/logger.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(
  import.meta.url,
  'Defines Site shell (assembly) and page routing',
);

class Site {
  // constructor: Starts async bootstrapping of the Site shell.
  constructor() {
    Object.defineProperties(this, Site.descriptors);

    (async () => {
      try {
        const config = await Site.loadSiteConfig();

        this.logger = new Logger(config);

        this.log(
          'constructor',
          'objectCreateStart',
          'Site.constructor: Starting',
        );
        this.log('constructor', 'info', `config ${JSON.stringify(config)}`);

        this.init(config);

        this.log(
          'constructor',
          'objectCreateComplete',
          'Site.constructor: Completed',
        );

        if (typeof window !== 'undefined') {
          window.site = this;
        }
      } catch (error) {
        bootLogger.moduleInfo(
          import.meta.url,
          `ERROR: Failed to initialize Site from siteConfig.json (${error?.message || error})`,
          error,
        );
      }
    })();
  }

  // init: Initializes the Site shell, builds layout, and loads the initial page.
  init(config) {
    Site.applyBrowserTitleFromConfig(config);
    Site.applyFaviconFromConfig(config);

    // State: capture loaded configuration for this instance.
    this.config = config;
    if (!this.logger) {
      this.logger = new Logger(config);
    } else {
      this.logger.setConfig(config);
    }

    // State: lazily construct page controllers once per Site instance.
    if (!this.pages) {
      this.pages = this.createPages(config);
    }

    if (this.initialized) {
      return this.log('init', 'passthroughMethodComplete', undefined, {
        canLogReturnValue: false,
        toLogValue: undefined,
        message: 'Site.init: Early return - already initialized',
      });
    }

    this.log(
      'init',
      'objectInitStart',
      'site.init: Initializing site with config:',
      this.config,
    );

    // State: build shell components based on templates and config.
    this.headerElement = this.createHeader();
    this.mainElement = this.createMain();
    this.footerElement = this.createFooter();

    if (!this.bodyElement) {
      return this.log('init', 'passthroughMethodComplete', undefined, {
        canLogReturnValue: false,
        toLogValue: undefined,
        message: 'Site.init: Early return - no body element',
      });
    }

    if (
      this.config &&
      this.config.classes &&
      this.config.classes.visuallyHidden
    ) {
      // State: apply visually hidden labels for section anchors.
      const sectionTitles =
        this.config && this.config.titles
          ? {
              home: this.config.titles.homeSection,
              recipes: this.config.titles.recipesSection,
              mealplan: this.config.titles.mealPlanSection,
              shopping: this.config.titles.shoppingSection,
              tools: this.config.titles.toolsSection,
            }
          : {};

      ['home', 'recipes', 'mealplan', 'shopping', 'tools'].forEach((id) => {
        const span = document.getElementById(id);
        if (span) {
          span.classList.add(this.config.classes.visuallyHidden);
          if (sectionTitles[id]) {
            span.textContent = sectionTitles[id];
          }
        }
      });
    }

    // State: attach shell components to the configured body element.
    this.log('init', 'lifecycle', 'site.init: Appending header to body');
    if (this.headerElement) this.bodyElement.appendChild(this.headerElement);

    this.log('init', 'lifecycle', 'site.init: Appending main to body');
    if (this.mainElement) this.bodyElement.appendChild(this.mainElement);

    this.log('init', 'lifecycle', 'site.init: Appending footer to body');
    if (this.footerElement) this.bodyElement.appendChild(this.footerElement);

    // State: mark Site as fully initialized.
    this.initialized = true;

    this.log(
      'init',
      'domReady',
      'site.init: DOM is ready, loading initial page.',
    );
    // State: load the initial home page into the main region.
    this.loadPage('home');
    this.log('init', 'info', 'site.init: Site ready.');

    this.log('init', 'objectInitComplete', 'site.init: Site initialized.');
  }

  // bodyElement: Returns the configured body element and applies body class.
  get bodyElement() {
    this.log('bodyElement', 'methodStart', 'Site.bodyElement: Starting');
    const element =
      this.config && this.config.ids && this.config.ids.body
        ? document.querySelector(`#${CSS.escape(this.config.ids.body)}`)
        : null;

    if (
      element &&
      this.config &&
      this.config.classes &&
      this.config.classes.body
    ) {
      element.classList.add(this.config.classes.body);
    }

    return this.log('bodyElement', 'passthroughMethodComplete', element, {
      toLogValue: (el) =>
        el ? { tag: el.tagName, class: el.className } : null,
    });
  }

  // elements: Returns the top-level header, main, and footer elements.
  get elements() {
    this.log('elements', 'methodStart', 'Site.elements: Starting');
    return this.log(
      'elements',
      'passthroughMethodComplete',
      {
        header: this.headerElement,
        main: this.mainElement,
        footer: this.footerElement,
      },
      {
        toLogValue: (obj) => ({ keys: Object.keys(obj) }),
      },
    );
  }

  // descriptors: Defines non-enumerable instance properties for Site.
  static get descriptors() {
    Logger.staticClassMethodLog(
      'methodStart',
      'Site',
      'descriptors',
      'Site.descriptors: Starting',
    );
    return Logger.staticClassMethodPassthrough(
      'passthroughMethodComplete',
      'Site',
      'descriptors',
      {
        config: {
          value: null,
          writable: true,
          enumerable: false,
          configurable: false,
        },
        headerElement: {
          value: null,
          writable: true,
          enumerable: false,
          configurable: false,
        },
        header: {
          value: null,
          writable: true,
          enumerable: false,
          configurable: false,
        },
        menu: {
          value: null,
          writable: true,
          enumerable: false,
          configurable: false,
        },
        mainElement: {
          value: null,
          writable: true,
          enumerable: false,
          configurable: false,
        },
        main: {
          value: null,
          writable: true,
          enumerable: false,
          configurable: false,
        },
        footerElement: {
          value: null,
          writable: true,
          enumerable: false,
          configurable: false,
        },
        footer: {
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
        pages: {
          value: null,
          writable: true,
          enumerable: false,
          configurable: false,
        },
      },
      {
        toLogValue: (desc) => ({ keys: Object.keys(desc) }),
      },
    );
  }

  // applyAttributes: Applies or removes attributes on a single element.
  applyAttributes(element, attrs) {
    if (!element || !attrs) return;
    Object.entries(attrs).forEach(([name, value]) => {
      if (value === false || value == null) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, String(value));
      }
    });
  }

  // applyConfiguredAttributesInRoot: Applies config-driven attributes within a DOM root.
  applyConfiguredAttributesInRoot(root, config = this.config) {
    if (!root || !config) return;

    const elementAttrs = Site.buildElementAttributes(config);
    if (Object.keys(elementAttrs).length === 0) return;

    Object.entries(elementAttrs).forEach(([key, attrs]) => {
      if (!attrs) return;
      const className = config.classes && config.classes[key];
      const idName = config.ids && config.ids[key];
      if (!className && !idName) return;

      const selector = className
        ? `.${className}`
        : `#${CSS.escape(String(idName))}`;

      const elements = root.querySelectorAll(selector);
      elements.forEach((el) => this.applyAttributes(el, attrs));
    });

    const placeholderMessages =
      config.messages && config.messages.placeholder
        ? config.messages.placeholder
        : null;
    if (placeholderMessages) {
      Object.entries(placeholderMessages).forEach(([id, text]) => {
        const el = root.querySelector(`#${CSS.escape(id)}`);
        if (el && text != null) {
          el.setAttribute('placeholder', String(text));
        }
      });
    }
  }

  // createFooter: Creates and returns the configured Footer element.
  createFooter() {
    this.log('createFooter', 'methodStart', 'Site.createFooter: Starting');
    this.footer = new Footer(this.config, {
      logger: this.logger,
    });
    return this.log(
      'createFooter',
      'passthroughMethodComplete',
      this.footer.element,
      {
        toLogValue: (el) =>
          el ? { tag: el.tagName, class: el.className } : null,
      },
    );
  }

  // createHeader: Creates the Header and wires it to the Menu.
  createHeader() {
    this.log('createHeader', 'methodStart', 'Site.createHeader: Starting');
    this.log(
      'createHeader',
      'info',
      'Site.createHeader: Creating menu element',
    );
    const menuElement = this.createMenu();
    this.log('createHeader', 'info', 'Site.createHeader: Created menu element');
    this.header = new Header(this.config, menuElement, this.logger);
    return this.log(
      'createHeader',
      'passthroughMethodComplete',
      this.header.element,
      {
        toLogValue: (el) =>
          el ? { tag: el.tagName, class: el.className } : null,
      },
    );
  }

  // createMain: Creates the Main content container element.
  createMain() {
    this.log('createMain', 'methodStart', 'Site.createMain: Starting');
    this.main = new Main(this.config, {
      logger: this.logger,
    });
    return this.log(
      'createMain',
      'passthroughMethodComplete',
      this.main.element,
      {
        toLogValue: (el) =>
          el ? { tag: el.tagName, class: el.className } : null,
      },
    );
  }

  // createMenu: Creates the navigation Menu and its click handler.
  createMenu() {
    this.log('createMenu', 'methodStart', 'Site.createMenu: Starting');
    this.menu = new Menu(this.config, {
      logger: this.logger,
      onNavigate: (pageName) => this.loadPage(pageName),
    });
    return this.log(
      'createMenu',
      'passthroughMethodComplete',
      this.menu.element,
      {
        toLogValue: (el) =>
          el ? { tag: el.tagName, class: el.className } : null,
      },
    );
  }

  // createPages: Constructs all page controllers used for routing.
  createPages(config) {
    this.log('createPages', 'methodStart', 'Site.createPages: Starting');
    const pageOptions = { logger: this.logger };
    const value = {
      home: new HomePage(config, pageOptions),
      recipes: new RecipesPage(config, pageOptions),
      mealplan: new MealPlanPage(config, pageOptions),
      shopping: new ShoppingPage(config, pageOptions),
      more: new ToolsPage(config, pageOptions),
    };
    return this.log('createPages', 'passthroughMethodComplete', value, {
      toLogValue: (obj) => ({ keys: Object.keys(obj) }),
    });
  }

  // loadPage: Loads a named page into main and runs its afterRender hook.
  loadPage(pageName, container) {
    this.log(
      'loadPage',
      'pageLoadStart',
      `loadPageStart: Loading page: ${pageName}`,
    );

    const mainContainer = container || this.mainElement;
    if (!mainContainer) {
      return this.log('loadPage', 'passthroughMethodComplete', undefined, {
        canLogReturnValue: false,
        toLogValue: undefined,
        message: 'Site.loadPage: No main container found',
      });
    }

    mainContainer.className = this.config.classes.main;
    this.log('loadPage', 'info', 'State change: mainContainer className reset');

    let page;
    switch (pageName) {
      case 'home':
        page = this.pages.home.init(this.config);
        if (this.config.classes.mainHome) {
          mainContainer.classList.add(this.config.classes.mainHome);
        }
        this.log(
          'loadPage',
          'info',
          `State change: Initialized 'home' page and added 'home' class to mainContainer`,
        );
        break;
      case 'recipes':
        page = this.pages.recipes.init(this.config);
        if (this.config.classes.mainRecipes) {
          mainContainer.classList.add(this.config.classes.mainRecipes);
        }
        this.log(
          'loadPage',
          'info',
          `State change: Initialized 'recipes' page`,
        );
        break;
      case 'mealplan':
        page = this.pages.mealplan.init(this.config);
        this.log(
          'loadPage',
          'info',
          `State change: Initialized 'mealplan' page`,
        );
        break;
      case 'shopping':
        page = this.pages.shopping.init(this.config);
        this.log(
          'loadPage',
          'info',
          `State change: Initialized 'shopping' page`,
        );
        break;
      case 'more':
        page = this.pages.more.init(this.config);
        this.log('loadPage', 'info', `State change: Initialized 'more' page`);
        break;
      default:
        page = this.pages.home.init(this.config);
        this.log(
          'loadPage',
          'info',
          `State change: Initialized default 'home' page`,
        );
    }

    const titleElement = mainContainer.querySelector(
      `.${this.config.classes.mainTitle}`,
    );
    const contentWrapper = mainContainer.querySelector(
      `.${this.config.classes.mainContentWrapper}`,
    );

    if (titleElement && page && typeof page.title === 'string') {
      titleElement.textContent = page.title;
      this.log(
        'loadPage',
        'info',
        'State change: Updated titleElement textContent',
      );
    }

    if (contentWrapper && page && typeof page.content === 'string') {
      contentWrapper.innerHTML = page.content;
      this.log(
        'loadPage',
        'info',
        'State change: Updated contentWrapper innerHTML',
      );

      if (
        pageName === 'home' &&
        this.pages.home &&
        typeof this.pages.home.afterRender === 'function'
      ) {
        this.pages.home.afterRender(this.config);
        this.log(
          'loadPage',
          'info',
          "State change: Ran home page's afterRender hook",
        );
      } else if (
        pageName === 'recipes' &&
        this.pages.recipes &&
        typeof this.pages.recipes.afterRender === 'function'
      ) {
        this.pages.recipes.afterRender(this.config);
        this.log(
          'loadPage',
          'info',
          "State change: Ran recipes page's afterRender hook",
        );
      } else if (
        pageName === 'mealplan' &&
        this.pages.mealplan &&
        typeof this.pages.mealplan.afterRender === 'function'
      ) {
        this.pages.mealplan.afterRender(this.config);
        this.log(
          'loadPage',
          'info',
          "State change: Ran mealplan page's afterRender hook",
        );
      } else if (
        pageName === 'shopping' &&
        this.pages.shopping &&
        typeof this.pages.shopping.afterRender === 'function'
      ) {
        this.pages.shopping.afterRender(this.config);
        this.log(
          'loadPage',
          'info',
          "State change: Ran shopping page's afterRender hook",
        );
      } else if (
        pageName === 'more' &&
        this.pages.more &&
        typeof this.pages.more.afterRender === 'function'
      ) {
        this.pages.more.afterRender(this.config);
        this.log(
          'loadPage',
          'info',
          "State change: Ran tools page's afterRender hook",
        );
      }
    }

    this.log(
      'loadPage',
      'pageLoadComplete',
      `loadPageComplete: Loaded page: ${pageName}`,
    );
  }

  // log: Delegates logging to the shared Logger using Site conventions.
  log(methodName, level, ...args) {
    if (!this.logger) return;

    if (this.logger.isSignatureLevel(level)) {
      if (typeof methodName === 'string') {
        if (level.startsWith('passthrough')) {
          return this.logger.passthroughMethod('Site', methodName, ...args);
        }
        this.logger.classMethodLog(level, 'Site', methodName, ...args);
      } else if (typeof methodName === 'object' && methodName !== null) {
        if (level.startsWith('function')) {
          this.logger.functionLog(level, ...args);
        } else {
          this.logger.classLog(level, ...args);
        }
      }
    } else {
      this.logger.classMethodLog(level, 'Site', methodName, ...args);
    }
  }

  // applyBrowserTitleFromConfig: Sets document.title from config, if present.
  static applyBrowserTitleFromConfig(config) {
    if (!config || !config.titles || !config.titles.browserTitle) {
      return;
    }

    document.title = config.titles.browserTitle;
  }

  // applyFaviconFromConfig: Updates the favicon link based on config logo.
  static applyFaviconFromConfig(config) {
    if (!config || !config.images || !config.images.logo) {
      return;
    }

    const logoHref = config.images.logo;
    const link = document.querySelector('link[rel="icon"]');
    if (link && logoHref) {
      link.href = logoHref;
    }
  }

  // buildElementAttributes: Builds per-key attribute maps from config groups.
  static buildElementAttributes(config) {
    if (!config) return {};

    const baseElementAttrs = config.elementAttributes || {};
    const elementAttrs = { ...baseElementAttrs };

    const groups = config.elementAttributeGroups;
    if (groups && typeof groups === 'object') {
      Object.entries(groups).forEach(([groupName, keys]) => {
        if (!Array.isArray(keys) || keys.length === 0) return;

        let groupAttrs = null;
        if (
          groupName === 'button' ||
          groupName === 'text' ||
          groupName === 'search' ||
          groupName === 'number'
        ) {
          groupAttrs = { type: groupName };
        }

        if (!groupAttrs) return;

        keys.forEach((key) => {
          if (!key || typeof key !== 'string') return;
          const existing = elementAttrs[key] || {};
          elementAttrs[key] = { ...groupAttrs, ...existing };
        });
      });
    }

    return elementAttrs;
  }

  // loadSiteConfig: Fetches and returns the siteConfig.json object.
  static async loadSiteConfig() {
    const response = await fetch('./data/siteConfig.json', {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to load siteConfig.json (status ${response.status})`,
      );
    }

    const config = await response.json();
    return config || {};
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'Site');

Logger.instrumentClass(Site, 'Site');

export { Site };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
