// Purpose: Manages the header DOM, logo, and hamburger/menu behavior
// for the Chow Time site shell, including constructing and owning
// the navigation Menu.
//
// Usage:
//   import { Header } from './modules/views/header.js';
//   const header = new Header(config, { logger, onNavigate });

import { bootLogger } from '../models/bootLogger.js';

import { Logger } from '../models/logger.js';
import { Site } from './site.js';
import { Menu } from './menu.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(import.meta.url, 'Defines Header shell component');

class Header {
  // constructor: Creates the Header and starts initialization.
  constructor(config, options = {}) {
    Object.defineProperties(this, Header.descriptors);
    this.logger = options.logger || null;
    this.log(
      'constructor',
      'objectCreateStart',
      'Header.constructor: Starting',
    );
    this.config = config;
    this.onNavigate =
      typeof options.onNavigate === 'function' ? options.onNavigate : null;
    this.menuElement = null;
    this.log(
      'constructor',
      'objectCreateComplete',
      'Header.constructor: Completed',
    );
    this.log('constructor', 'info', 'Header.constructor: Header created');
    // Immediately initialize after construction
    this.init();
  }

  // init: Builds the header DOM and wires logo/menu/hamburger.
  init() {
    if (this.initialized) {
      // State: Reuse existing header element when already initialized.
      return this.log('init', 'passthroughMethodComplete', this.element, {
        toLogValue: (el) =>
          el ? { tag: el.tagName, class: el.className } : null,
      });
    }

    this.log('init', 'objectInitStart', 'Header.init: Starting');

    const template = document.getElementById(this.config.ids.templates.header);
    if (!template) {
      return this.log('init', 'passthroughMethodComplete', undefined, {
        canLogReturnValue: false,
        toLogValue: undefined,
        message: 'Header.init: Early return - no header template found',
      });
    }

    const headerElem = template.content.firstElementChild.cloneNode(true);
    // State: Configure header root element classes and id.
    if (this.config.classes.header) {
      headerElem.className = this.config.classes.header;
    }
    if (this.config.ids.header) {
      headerElem.id = this.config.ids.header;
    }
    const idClassPairs = [
      ['headerRow', 'headerRow'],
      ['headerLogo', 'headerLogo'],
      ['headerTitle', 'headerTitle'],
      ['hamburger', 'hamburger'],
      ['hamburgerIcon', 'hamburgerIcon'],
    ];

    idClassPairs.forEach(([idKey, classKey]) => {
      if (
        this.config.ids &&
        this.config.ids[idKey] &&
        this.config.classes &&
        this.config.classes[classKey]
      ) {
        const child = headerElem.querySelector(
          `#${CSS.escape(this.config.ids[idKey])}`,
        );
        if (child) {
          child.classList.add(this.config.classes[classKey]);
        }
      }
    });

    const logoContainer = headerElem.querySelector(
      `#${CSS.escape(this.config.ids.headerLogo)}`,
    );
    const logoImg = logoContainer ? logoContainer.querySelector('img') : null;

    const hamburgerBtnElement = headerElem.querySelector(
      `#${CSS.escape(this.config.ids.hamburger)}`,
    );
    const hamburgerIconElement = headerElem.querySelector(
      `#${CSS.escape(this.config.ids.hamburgerIcon)}`,
    );

    const elementAttrs = Site.buildElementAttributes(this.config);
    const site = window.site instanceof Site ? window.site : null;
    const applyAttrs =
      site && typeof site.applyAttributes === 'function'
        ? site.applyAttributes.bind(site)
        : (el, attrs) => {
            if (!this.logger) return;
            this.logger.classMethodLog(
              'info',
              'Header',
              'init',
              'Header.init: Site.applyAttributes not available; skipping attribute application',
              {
                hasElement: !!el,
                hasAttrs: !!attrs,
              },
            );
          };

    // State: Apply config-driven attributes to logo and hamburger elements.
    applyAttrs(logoImg, elementAttrs.headerLogo);
    applyAttrs(hamburgerBtnElement, elementAttrs.hamburger);
    applyAttrs(hamburgerIconElement, elementAttrs.hamburgerIcon);

    // State: Set logo image source when provided in config.
    if (this.config.images && this.config.images.logo && logoImg) {
      logoImg.src = this.config.images.logo;
    }

    // State: Set header title text from configuration.
    if (this.config.titles && this.config.titles.headerTitle) {
      const titleEl = headerElem.querySelector(
        `#${CSS.escape(this.config.ids.headerTitle)}`,
      );
      if (titleEl) {
        titleEl.textContent = this.config.titles.headerTitle;
      }
    }

    // State: Construct and attach the navigation Menu into the header.
    const menu = new Menu(this.config, {
      logger: this.logger,
      onNavigate: this.onNavigate,
    });
    this.menuElement = menu.element;
    if (this.menuElement) {
      headerElem.appendChild(this.menuElement);
    }

    // State: Capture the header root element on the instance.
    this.element = headerElem;
    // State: Cache references to interactive header elements.
    this.cacheInteractiveElements();
    // State: Wire hamburger/menu toggle behavior and ARIA state.
    this.initializeHamburgerBehavior();

    // State: Mark Header as fully initialized.
    this.initialized = true;
    this.log('init', 'objectInitComplete', 'Header.init: Completed');
    this.log('init', 'info', 'Header.init: Header initialized');
    return this.log('init', 'passthroughMethodComplete', this.element, {
      toLogValue: (el) =>
        el ? { tag: el.tagName, class: el.className } : null,
    });
  }

  // descriptors: Defines non-enumerable instance properties for Header.
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

  // cacheInteractiveElements: Caches key interactive header elements.
  cacheInteractiveElements() {
    this.log(
      'cacheInteractiveElements',
      'methodStart',
      'Header.cacheInteractiveElements: Starting',
    );

    if (!this.element) {
      return this.log(
        'cacheInteractiveElements',
        'passthroughMethodComplete',
        undefined,
        {
          canLogReturnValue: false,
          message:
            'Header.cacheInteractiveElements: Skipped - no header element',
        },
      );
    }

    this.hamburgerBtn = this.element.querySelector(
      `.${this.config.classes.hamburger}`,
    );
    this.hamburgerIcon = this.hamburgerBtn
      ? this.hamburgerBtn.querySelector(`.${this.config.classes.hamburgerIcon}`)
      : null;
    this.menuList = this.menuElement
      ? this.menuElement.querySelector(`.${this.config.classes.menuList}`)
      : null;

    return this.log(
      'cacheInteractiveElements',
      'passthroughMethodComplete',
      undefined,
      {
        canLogReturnValue: false,
        message: 'Header.cacheInteractiveElements: Completed',
      },
    );
  }

  // initializeHamburgerBehavior: Wires the hamburger toggle and ARIA state.
  initializeHamburgerBehavior() {
    this.log(
      'initializeHamburgerBehavior',
      'methodStart',
      'Header.initializeHamburgerBehavior: Starting',
    );

    if (!this.hamburgerBtn || !this.menuList || !this.hamburgerIcon) {
      return this.log(
        'initializeHamburgerBehavior',
        'passthroughMethodComplete',
        undefined,
        {
          canLogReturnValue: false,
          message:
            'Header.initializeHamburgerBehavior: Skipped - missing hamburger or menu elements',
        },
      );
    }

    this.setHamburgerIcon(false);

    this.menuList.classList.remove(this.config.classes.menuActive);
    this.menuList.setAttribute('aria-hidden', 'true');
    this.hamburgerBtn.setAttribute('aria-expanded', 'false');
    this.hamburgerBtn.addEventListener('click', () => {
      const isActive = this.menuList.classList.toggle(
        this.config.classes.menuActive,
      );
      this.menuList.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      this.hamburgerBtn.setAttribute(
        'aria-expanded',
        isActive ? 'true' : 'false',
      );
      this.setHamburgerIcon(isActive);
    });

    return this.log(
      'initializeHamburgerBehavior',
      'passthroughMethodComplete',
      undefined,
      {
        canLogReturnValue: false,
        message: 'Header.initializeHamburgerBehavior: Completed',
      },
    );
  }

  // log: Delegates logging to the shared Logger using Header conventions.
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

  // setHamburgerIcon: Updates hamburger icon source based on open state.
  setHamburgerIcon(isActive) {
    this.log(
      'setHamburgerIcon',
      'methodStart',
      'Header.setHamburgerIcon: Starting',
      {
        isActive: !!isActive,
      },
    );

    if (!this.hamburgerIcon) {
      return this.log(
        'setHamburgerIcon',
        'passthroughMethodComplete',
        undefined,
        {
          canLogReturnValue: false,
          message: 'Header.setHamburgerIcon: Skipped - no hamburger icon',
        },
      );
    }
    const images = this.config && this.config.images ? this.config.images : {};
    const closedSrc = images.hamburgerClosed;
    const openSrc = images.hamburgerOpen;

    if (!closedSrc || !openSrc) {
      return this.log(
        'setHamburgerIcon',
        'passthroughMethodComplete',
        undefined,
        {
          canLogReturnValue: false,
          message:
            'Header.setHamburgerIcon: Skipped - hamburger images not configured',
        },
      );
    }

    this.hamburgerIcon.src = isActive ? openSrc : closedSrc;

    return this.log(
      'setHamburgerIcon',
      'passthroughMethodComplete',
      undefined,
      {
        canLogReturnValue: false,
        message: 'Header.setHamburgerIcon: Completed',
      },
    );
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'Header');

Logger.instrumentClass(Header, 'Header');

export { Header };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
