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

import { Header } from './header.js';
import { Main } from './main.js';
import { Footer } from './footer.js';
import { Logger } from '../models/logger.js';
import { Profile } from '../models/profile.js';

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

        // Shared model instances owned by the Site shell and
        // injected into page controllers instead of using singletons.
        // Each receives the shared logger so Logger.instrumentClass
        // instrumentation on models can emit logs.
        this.profile = new Profile(undefined, {
          logger: this.logger,
        });
        this.storage = this.profile.storage;
        this.shoppingList = this.profile.shoppingList;
        this.inventory =
          (this.profile && this.profile.inventory) ||
          (this.shoppingList && this.shoppingList.inventory) ||
          null;
        this.recipeApi = this.profile.recipeApi;

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
      },
      {
        toLogValue: (desc) => ({ keys: Object.keys(desc) }),
      },
    );
  }

  // applyAttributes: Applies or removes attributes on a single element.
  applyAttributes(element, attrs) {
    if (!element || !attrs) {
      this.log(
        'applyAttributes',
        'info',
        'Site.applyAttributes: Skipped - missing element or attrs',
      );
      return;
    }

    this.log(
      'applyAttributes',
      'methodStart',
      'Site.applyAttributes: Starting',
      {
        attrCount: Object.keys(attrs || {}).length,
      },
    );
    Object.entries(attrs).forEach(([name, value]) => {
      if (value === false || value == null) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, String(value));
      }
    });

    return this.log('applyAttributes', 'passthroughMethodComplete', undefined, {
      canLogReturnValue: false,
      message: 'Site.applyAttributes: Completed',
    });
  }

  // applyConfiguredAttributesInRoot: Applies config-driven attributes within a DOM root.
  applyConfiguredAttributesInRoot(root, config = this.config) {
    if (!root || !config) {
      this.log(
        'applyConfiguredAttributesInRoot',
        'info',
        'Site.applyConfiguredAttributesInRoot: Skipped - missing root or config',
      );
      return;
    }

    this.log(
      'applyConfiguredAttributesInRoot',
      'methodStart',
      'Site.applyConfiguredAttributesInRoot: Starting',
      {
        hasElementAttributes: !!(
          config &&
          (config.elementAttributes || config.elementAttributeGroups)
        ),
      },
    );

    const elementAttrs = Site.buildElementAttributes(config);
    if (Object.keys(elementAttrs).length === 0) {
      return this.log(
        'applyConfiguredAttributesInRoot',
        'passthroughMethodComplete',
        undefined,
        {
          canLogReturnValue: false,
          message:
            'Site.applyConfiguredAttributesInRoot: Completed - no element attributes to apply',
        },
      );
    }

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

    return this.log(
      'applyConfiguredAttributesInRoot',
      'passthroughMethodComplete',
      undefined,
      {
        canLogReturnValue: false,
        message: 'Site.applyConfiguredAttributesInRoot: Completed',
      },
    );
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

  // createHeader: Creates the Header and wires navigation callbacks.
  createHeader() {
    this.log('createHeader', 'methodStart', 'Site.createHeader: Starting');
    this.header = new Header(this.config, {
      logger: this.logger,
      onNavigate: (pageName) => this.loadPage(pageName),
    });
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
      storage: this.storage,
      profile: this.profile,
      shoppingList: this.shoppingList,
      inventory: this.inventory,
      recipeApi: this.recipeApi,
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

  // loadPage: Delegates loading of a named page to Main.
  loadPage(pageName, container) {
    this.log('loadPage', 'methodStart', 'Site.loadPage: Delegating to Main', {
      pageName,
    });

    if (this.main && typeof this.main.loadPage === 'function') {
      this.main.loadPage(pageName, container || this.mainElement);
    } else {
      this.log(
        'loadPage',
        'info',
        'Site.loadPage: Main is not ready to load page',
      );
    }

    return this.log('loadPage', 'passthroughMethodComplete', undefined, {
      canLogReturnValue: false,
      toLogValue: undefined,
    });
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
    Logger.staticClassMethodLog(
      'methodStart',
      'Site',
      'applyBrowserTitleFromConfig',
      'Site.applyBrowserTitleFromConfig: Starting',
      {
        hasConfig: !!config,
        hasBrowserTitle: !!(
          config &&
          config.titles &&
          config.titles.browserTitle
        ),
      },
    );

    if (!config || !config.titles || !config.titles.browserTitle) {
      return Logger.staticClassMethodPassthrough(
        'passthroughMethodComplete',
        'Site',
        'applyBrowserTitleFromConfig',
        undefined,
        {
          canLogReturnValue: false,
          message:
            'Site.applyBrowserTitleFromConfig: Skipped - no browserTitle in config',
        },
      );
    }

    document.title = config.titles.browserTitle;

    return Logger.staticClassMethodPassthrough(
      'passthroughMethodComplete',
      'Site',
      'applyBrowserTitleFromConfig',
      undefined,
      {
        canLogReturnValue: false,
        message: 'Site.applyBrowserTitleFromConfig: Completed',
      },
    );
  }

  // applyFaviconFromConfig: Updates the favicon link based on config logo.
  static applyFaviconFromConfig(config) {
    Logger.staticClassMethodLog(
      'methodStart',
      'Site',
      'applyFaviconFromConfig',
      'Site.applyFaviconFromConfig: Starting',
      {
        hasConfig: !!config,
        hasLogo: !!(config && config.images && config.images.logo),
      },
    );

    if (!config || !config.images || !config.images.logo) {
      return Logger.staticClassMethodPassthrough(
        'passthroughMethodComplete',
        'Site',
        'applyFaviconFromConfig',
        undefined,
        {
          canLogReturnValue: false,
          message:
            'Site.applyFaviconFromConfig: Skipped - no logo image configured',
        },
      );
    }

    const logoHref = config.images.logo;
    const link = document.querySelector('link[rel="icon"]');
    if (link && logoHref) {
      link.href = logoHref;
    }

    return Logger.staticClassMethodPassthrough(
      'passthroughMethodComplete',
      'Site',
      'applyFaviconFromConfig',
      undefined,
      {
        canLogReturnValue: false,
        message: 'Site.applyFaviconFromConfig: Completed',
      },
    );
  }

  // buildElementAttributes: Builds per-key attribute maps from config groups.
  static buildElementAttributes(config) {
    Logger.staticClassMethodLog(
      'methodStart',
      'Site',
      'buildElementAttributes',
      'Site.buildElementAttributes: Starting',
      {
        hasConfig: !!config,
      },
    );

    if (!config) {
      return Logger.staticClassMethodPassthrough(
        'passthroughMethodComplete',
        'Site',
        'buildElementAttributes',
        {},
        {
          toLogValue: (attrs) => ({ keys: Object.keys(attrs) }),
          message:
            'Site.buildElementAttributes: Completed - no config provided',
        },
      );
    }

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

    return Logger.staticClassMethodPassthrough(
      'passthroughMethodComplete',
      'Site',
      'buildElementAttributes',
      elementAttrs,
      {
        toLogValue: (attrs) => ({ keys: Object.keys(attrs) }),
        message: 'Site.buildElementAttributes: Completed',
      },
    );
  }

  // loadSiteConfig: Fetches and returns the siteConfig.json object.
  static async loadSiteConfig() {
    Logger.staticClassMethodLog(
      'functionStart',
      'Site',
      'loadSiteConfig',
      'Site.loadSiteConfig: Starting',
    );
    let configUrl = './data/siteConfig.json';
    if (typeof window !== 'undefined' && window.location) {
      try {
        const basePath = window.location.pathname.replace(/[^/]*$/, '/');
        const baseUrl = `${window.location.origin}${basePath}`;
        configUrl = new URL('data/siteConfig.json', baseUrl).toString();
      } catch {
        // Fallback to relative path when URL construction fails.
        configUrl = './data/siteConfig.json';
      }
    }

    const response = await fetch(configUrl, {
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
    return Logger.staticClassMethodPassthrough(
      'passthroughFunctionComplete',
      'Site',
      'loadSiteConfig',
      config || {},
      {
        toLogValue: (configForLog) => ({
          hasDebug: !!(configForLog && configForLog.debug),
          hasClasses: !!(configForLog && configForLog.classes),
        }),
        message: 'Site.loadSiteConfig: Completed',
      },
    );
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'Site');

Logger.instrumentClass(Site, 'Site');

export { Site };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
