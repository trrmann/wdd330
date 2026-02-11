import { bootLogger } from './bootLogger.js';

import {
  HomePage,
  MealPlanPage,
  MorePage,
  RecipesPage,
  ShoppingPage,
} from './responsiveLayout.js';

import { Logger } from './logger.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(
  import.meta.url,
  'Defines Site shell (Header/Menu/Main/Footer) and page routing',
);
class Header {
  static get descriptors() {
    Logger.staticClassMethodLog(
      'methodStart',
      'Header',
      'descriptors',
      'Header.descriptors: Starting',
    );
    return Logger.staticClassMethodPassthrough(
      'passthroughMethodComplete',
      'Header',
      'descriptors',
      {
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
        menuElement: {
          value: null,
          writable: true,
          enumerable: false,
          configurable: false,
        },
        hamburgerBtn: {
          value: null,
          writable: true,
          enumerable: false,
          configurable: false,
        },
        hamburgerIcon: {
          value: null,
          writable: true,
          enumerable: false,
          configurable: false,
        },
        menuList: {
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

  constructor(config, menuElement, logger) {
    Object.defineProperties(this, Header.descriptors);
    this.logger = logger || null;
    this.log(
      'constructor',
      'objectCreateStart',
      'Header.constructor: Starting',
    );
    this.config = config;
    this.menuElement = menuElement || null;
    this.log(
      'constructor',
      'objectCreateComplete',
      'Header.constructor: Completed',
    );
    this.log('constructor', 'info', 'Header.constructor: Header created');
    // Immediately initialize after construction
    this.init();
  }

  log(methodName, level, ...args) {
    if (!this.logger) return;

    if (this.logger.isSignatureLevel(level)) {
      if (typeof methodName === 'string') {
        if (level.startsWith('passthrough')) {
          return this.logger.passthroughMethod('Header', methodName, ...args);
        }
        this.logger.classMethodLog(level, 'Header', methodName, ...args);
      } else if (typeof methodName === 'object' && methodName !== null) {
        if (level.startsWith('function')) {
          this.logger.functionLog(level, ...args);
        } else {
          this.logger.classLog(level, ...args);
        }
      }
    } else {
      this.logger.classMethodLog(level, 'Header', methodName, ...args);
    }
  }

  init() {
    if (this.initialized) {
      return this.log('init', 'passthroughMethodComplete', this.element, {
        toLogValue: (el) =>
          el ? { tag: el.tagName, class: el.className } : null,
      });
    }

    this.log('init', 'objectInitStart', 'Header.init: Starting');

    const template = document.getElementById(this.config.headerTemplateId);
    if (!template) {
      return this.log('init', 'passthroughMethodComplete', undefined, {
        canLogReturnValue: false,
        toLogValue: undefined,
        message: 'Header.init: Early return - no header template found',
      });
    }

    const headerElem = template.content.firstElementChild.cloneNode(true);
    if (this.config.headerClassName) {
      headerElem.className = this.config.headerClassName;
    }
    if (this.config.headerId) {
      headerElem.id = this.config.headerId;
    }

    if (this.menuElement) {
      headerElem.appendChild(this.menuElement);
    }

    this.element = headerElem;
    this.cacheInteractiveElements();
    this.initializeHamburgerBehavior();

    this.initialized = true;
    this.log('init', 'objectInitComplete', 'Header.init: Completed');
    this.log('init', 'info', 'Header.init: Header initialized');
    return this.log('init', 'passthroughMethodComplete', this.element, {
      toLogValue: (el) =>
        el ? { tag: el.tagName, class: el.className } : null,
    });
  }

  cacheInteractiveElements() {
    if (!this.element) return;

    this.hamburgerBtn = this.element.querySelector(
      this.config.hamburgerSelector,
    );
    this.hamburgerIcon = this.hamburgerBtn
      ? this.hamburgerBtn.querySelector(this.config.hamburgerIconSelector)
      : null;
    this.menuList = this.menuElement
      ? this.menuElement.querySelector(this.config.menuListSelector)
      : null;
  }

  setHamburgerIcon(isActive) {
    if (!this.hamburgerIcon) return;

    this.hamburgerIcon.innerHTML = isActive
      ? `
            <rect x="0" y="8" width="28" height="4" rx="2" fill="currentColor" transform="rotate(45 14 10)" />
            <rect x="0" y="8" width="28" height="4" rx="2" fill="currentColor" transform="rotate(-45 14 10)" />
          `
      : `
            <rect y="2" width="28" height="4" rx="2" fill="currentColor" />
            <rect y="8" width="28" height="4" rx="2" fill="currentColor" />
            <rect y="14" width="28" height="4" rx="2" fill="currentColor" />
          `;
  }

  initializeHamburgerBehavior() {
    if (!this.hamburgerBtn || !this.menuList || !this.hamburgerIcon) return;

    this.setHamburgerIcon(false);

    this.menuList.classList.remove('active');
    this.menuList.setAttribute('aria-hidden', 'true');
    this.hamburgerBtn.setAttribute('aria-expanded', 'false');

    this.hamburgerBtn.addEventListener('click', () => {
      const isActive = this.menuList.classList.toggle('active');
      this.menuList.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      this.hamburgerBtn.setAttribute(
        'aria-expanded',
        isActive ? 'true' : 'false',
      );
      this.setHamburgerIcon(isActive);
    });
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'Header');

class Menu {
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
      onNavigate: {
        value: null,
        writable: true,
        enumerable: false,
        configurable: false,
      },
    };
  }

  constructor(config, options = {}) {
    Object.defineProperties(this, Menu.descriptors);
    this.logger = options.logger || null;
    this.log('constructor', 'objectCreateStart', 'Menu.constructor: Starting');
    this.config = config;
    this.onNavigate =
      typeof options.onNavigate === 'function' ? options.onNavigate : null;
    this.log(
      'constructor',
      'objectCreateComplete',
      'Menu.constructor: Completed',
    );
    this.log('constructor', 'info', 'Menu.constructor: Menu created');
    // Immediately initialize after construction
    this.init();
  }

  log(methodName, level, ...args) {
    if (!this.logger) return;

    if (this.logger.isSignatureLevel(level)) {
      if (typeof methodName === 'string') {
        if (level.startsWith('passthrough')) {
          return this.logger.passthroughMethod('Menu', methodName, ...args);
        }
        this.logger.classMethodLog(level, 'Menu', methodName, ...args);
      } else if (typeof methodName === 'object' && methodName !== null) {
        if (level.startsWith('function')) {
          this.logger.functionLog(level, ...args);
        } else {
          this.logger.classLog(level, ...args);
        }
      }
    } else {
      this.logger.classMethodLog(level, 'Menu', methodName, ...args);
    }
  }

  init() {
    if (this.initialized) {
      return this.log('init', 'passthroughMethodComplete', this.element, {
        toLogValue: (el) =>
          el ? { tag: el.tagName, class: el.className } : null,
      });
    }

    this.log('init', 'objectInitStart', 'Menu.init: Starting');

    const template = document.getElementById(this.config.menuTemplateId);
    if (!template) {
      return this.log('init', 'passthroughMethodComplete', undefined, {
        canLogReturnValue: false,
        toLogValue: undefined,
        message: 'Menu.init: Early return - no menu template found',
      });
    }

    const menuElem = template.content.firstElementChild.cloneNode(true);
    if (this.config.menuClassName) {
      menuElem.className = this.config.menuClassName;
    }
    if (this.config.menuId) {
      menuElem.id = this.config.menuId;
    }

    const menuItems = menuElem.querySelectorAll(this.config.menuItemSelector);
    menuItems.forEach((item) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        const pageName = event.target.hash.substring(1);
        if (this.onNavigate) {
          this.onNavigate(pageName);
        }
      });
    });

    this.element = menuElem;
    this.initialized = true;
    this.log('init', 'objectInitComplete', 'Menu.init: Completed');
    this.log('init', 'info', 'Menu.init: Menu initialized');
    return this.log('init', 'passthroughMethodComplete', this.element, {
      toLogValue: (el) =>
        el ? { tag: el.tagName, class: el.className } : null,
    });
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'Menu');

class Main {
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

  init() {
    if (this.initialized) {
      return this.log('init', 'passthroughMethodComplete', this.element, {
        toLogValue: (el) =>
          el ? { tag: el.tagName, class: el.className } : null,
      });
    }

    this.log('init', 'objectInitStart', 'Main.init: Starting');

    const template = document.getElementById(this.config.mainTemplateId);
    if (!template) {
      return this.log('init', 'passthroughMethodComplete', undefined, {
        canLogReturnValue: false,
        toLogValue: undefined,
        message: 'Main.init: Early return - no main template found',
      });
    }

    const mainElem = template.content.firstElementChild.cloneNode(true);
    if (this.config.mainClassName) {
      mainElem.className = this.config.mainClassName;
    }
    if (this.config.mainId) {
      mainElem.id = this.config.mainId;
    }

    this.element = mainElem;
    this.initialized = true;
    this.log('init', 'objectInitComplete', 'Main.init: Completed');
    this.log('init', 'info', 'Main.init: Main initialized');
    return this.log('init', 'passthroughMethodComplete', this.element, {
      toLogValue: (el) =>
        el ? { tag: el.tagName, class: el.className } : null,
    });
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'Main');

class Footer {
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

  constructor(config, options = {}) {
    Object.defineProperties(this, Footer.descriptors);
    this.logger = options.logger || null;
    this.log(
      'constructor',
      'objectCreateStart',
      'Footer.constructor: Starting',
    );
    this.config = config;
    this.log(
      'constructor',
      'objectCreateComplete',
      'Footer.constructor: Completed',
    );
    this.log('constructor', 'info', 'Footer.constructor: Footer created');
    // Immediately initialize after construction
    this.init();
  }

  log(methodName, level, ...args) {
    if (!this.logger) return;

    if (this.logger.isSignatureLevel(level)) {
      if (typeof methodName === 'string') {
        if (level.startsWith('passthrough')) {
          return this.logger.passthroughMethod('Footer', methodName, ...args);
        }
        this.logger.classMethodLog(level, 'Footer', methodName, ...args);
      } else if (typeof methodName === 'object' && methodName !== null) {
        if (level.startsWith('function')) {
          this.logger.functionLog(level, ...args);
        } else {
          this.logger.classLog(level, ...args);
        }
      }
    } else {
      this.logger.classMethodLog(level, 'Footer', methodName, ...args);
    }
  }

  init() {
    if (this.initialized) {
      return this.log('init', 'passthroughMethodComplete', this.element, {
        toLogValue: (el) =>
          el ? { tag: el.tagName, class: el.className } : null,
      });
    }

    this.log('init', 'objectInitStart', 'Footer.init: Starting');

    const template = document.getElementById(this.config.footerTemplateId);
    if (!template) {
      return this.log('init', 'passthroughMethodComplete', undefined, {
        canLogReturnValue: false,
        toLogValue: undefined,
        message: 'Footer.init: Early return - no footer template found',
      });
    }

    const footerElem = template.content.firstElementChild.cloneNode(true);
    if (this.config.footerClassName) {
      footerElem.className = this.config.footerClassName;
    }
    if (this.config.footerId) {
      footerElem.id = this.config.footerId;
    }

    this.element = footerElem;
    this.initialized = true;
    this.log('init', 'objectInitComplete', 'Footer.init: Completed');
    this.log('init', 'info', 'Footer.init: Footer initialized');
    return this.log('init', 'passthroughMethodComplete', this.element, {
      toLogValue: (el) =>
        el ? { tag: el.tagName, class: el.className } : null,
    });
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'Footer');

class Site {
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

  constructor(config = null) {
    Object.defineProperties(this, Site.descriptors);

    if (config) {
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
    }
  }

  createPages(config) {
    this.log('createPages', 'methodStart', 'Site.createPages: Starting');
    const pageOptions = { logger: this.logger };
    const value = {
      home: new HomePage(config, pageOptions),
      recipes: new RecipesPage(config, pageOptions),
      mealplan: new MealPlanPage(config, pageOptions),
      shopping: new ShoppingPage(config, pageOptions),
      more: new MorePage(config, pageOptions),
    };
    return this.log('createPages', 'passthroughMethodComplete', value, {
      toLogValue: (obj) => ({ keys: Object.keys(obj) }),
    });
  }

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

  get bodyElement() {
    this.log('bodyElement', 'methodStart', 'Site.bodyElement: Starting');
    return this.log(
      'bodyElement',
      'passthroughMethodComplete',
      this.config
        ? document.querySelector(`body.${this.config.bodyClass}`)
        : null,
      {
        toLogValue: (el) =>
          el ? { tag: el.tagName, class: el.className } : null,
      },
    );
  }

  log(methodName, level, ...args) {
    if (!this.logger) return;

    // If the level is a signature-level (method/function/passthrough), use the correct logger API
    if (this.logger.isSignatureLevel(level)) {
      // If methodName is a string, treat as method; else, fallback to function/class
      if (typeof methodName === 'string') {
        // For passthrough, allow passing a return value and options
        if (level.startsWith('passthrough')) {
          // args: [returnValue, options?]
          return this.logger.passthroughMethod('Site', methodName, ...args);
        } else {
          this.logger.classMethodLog(level, 'Site', methodName, ...args);
        }
      } else if (typeof methodName === 'object' && methodName !== null) {
        // If methodName is an object, treat as context for functionLog/classLog
        if (level.startsWith('function')) {
          this.logger.functionLog(level, ...args);
        } else {
          this.logger.classLog(level, ...args);
        }
      }
    } else {
      // Non-signature levels: treat as classMethodLog
      this.logger.classMethodLog(level, 'Site', methodName, ...args);
    }
  }

  init(config) {
    this.config = config;
    if (!this.logger) {
      this.logger = new Logger(config);
    } else {
      this.logger.setConfig(config);
    }

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

    this.log('init', 'lifecycle', 'site.init: Appending header to body');
    if (this.headerElement) this.bodyElement.appendChild(this.headerElement);

    this.log('init', 'lifecycle', 'site.init: Appending main to body');
    if (this.mainElement) this.bodyElement.appendChild(this.mainElement);

    this.log('init', 'lifecycle', 'site.init: Appending footer to body');
    if (this.footerElement) this.bodyElement.appendChild(this.footerElement);

    this.initialized = true;

    this.log(
      'init',
      'domReady',
      'site.init: DOM is ready, loading initial page.',
    );
    this.loadPage('home');
    this.log('init', 'info', 'site.init: Site ready.');

    this.log('init', 'objectInitComplete', 'site.init: Site initialized.');
  }

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

    // Reset classes on main container
    mainContainer.className = this.config.mainClassName;
    this.log('loadPage', 'info', 'State change: mainContainer className reset');

    let page;
    switch (pageName) {
      case 'home':
        page = this.pages.home.init(this.config);
        mainContainer.classList.add('home');
        this.log(
          'loadPage',
          'info',
          `State change: Initialized 'home' page and added 'home' class to mainContainer`,
        );
        break;
      case 'recipes':
        page = this.pages.recipes.init(this.config);
        mainContainer.classList.add('recipes');
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
      this.config.mainTitleSelector,
    );
    const contentWrapper = mainContainer.querySelector(
      this.config.mainContentWrapperSelector,
    );

    if (titleElement) {
      titleElement.textContent = page.title;
      this.log(
        'loadPage',
        'info',
        'State change: Updated titleElement textContent',
      );
    }

    if (contentWrapper) {
      contentWrapper.innerHTML = page.content;
      this.log(
        'loadPage',
        'info',
        'State change: Updated contentWrapper innerHTML',
      );
      if (
        pageName === 'home' &&
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
        typeof this.pages.recipes.afterRender === 'function'
      ) {
        this.pages.recipes.afterRender(this.config);
        this.log(
          'loadPage',
          'info',
          "State change: Ran recipes page's afterRender hook",
        );
      }
    }

    this.log(
      'loadPage',
      'pageLoadComplete',
      `loadPageComplete: Loaded page: ${pageName}`,
    );
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'Site');

Logger.instrumentClass(Header, 'Header');
Logger.instrumentClass(Menu, 'Menu');
Logger.instrumentClass(Main, 'Main');
Logger.instrumentClass(Footer, 'Footer');
Logger.instrumentClass(Site, 'Site');

export { Footer, Header, Main, Menu, Site };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
