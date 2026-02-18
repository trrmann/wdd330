import { bootLogger } from '../models/bootLogger.js';

import { Logger } from '../models/logger.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(import.meta.url, 'Defines Menu shell component');

// Menu Module
// Purpose: Renders the navigation menu and raises navigation events used by Site.
// Usage: const menu = new Menu(config, { logger, onNavigate });
class Menu {
  // constructor: Creates the Menu and starts initialization.
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

  // init: Builds the menu DOM and wires navigation click handlers.
  init() {
    if (this.initialized) {
      // State: Reuse existing menu element when already initialized.
      return this.log('init', 'passthroughMethodComplete', this.element, {
        toLogValue: (el) =>
          el ? { tag: el.tagName, class: el.className } : null,
      });
    }

    this.log('init', 'methodStart', 'Menu.init: Starting');
    this.log('init', 'objectInitStart', 'Menu.init: Starting');

    const template = document.getElementById(this.config.ids.templates.menu);
    if (!template) {
      return this.log('init', 'passthroughMethodComplete', undefined, {
        canLogReturnValue: false,
        toLogValue: undefined,
        message: 'Menu.init: Early return - no menu template found',
      });
    }

    const menuElem = template.content.firstElementChild.cloneNode(true);
    // State: Configure menu root element classes and id.
    if (this.config.classes.menu) {
      menuElem.className = this.config.classes.menu;
    }
    if (this.config.ids.menu) {
      menuElem.id = this.config.ids.menu;
    }

    // State: Ensure UL container exists and apply menu list class.
    let menuList = menuElem.querySelector('ul');
    if (!menuList) {
      menuList = document.createElement('ul');
      menuElem.appendChild(menuList);
    }
    if (this.config.classes.menuList) {
      menuList.classList.add(this.config.classes.menuList);
    }

    const menuItemTemplateId =
      this.config.ids && this.config.ids.templates
        ? this.config.ids.templates.menuItem
        : null;
    const menuItemTemplate = menuItemTemplateId
      ? document.getElementById(menuItemTemplateId)
      : null;

    const itemsConfig = Array.isArray(this.config.menuItems)
      ? this.config.menuItems
      : [];

    // State: Populate menu items list from configuration.
    itemsConfig.forEach((itemConfig) => {
      const { id, label } = itemConfig || {};
      if (!id || !label) return;
      let li;
      let link;

      if (menuItemTemplate && menuItemTemplate.content) {
        const fragment = menuItemTemplate.content.cloneNode(true);
        li = fragment.querySelector('li') || fragment.firstElementChild;
        link = li ? li.querySelector('a') : null;
      } else {
        li = document.createElement('li');
        link = document.createElement('a');
        li.appendChild(link);
      }

      if (li && this.config.classes.menuItem) {
        li.classList.add(this.config.classes.menuItem);
      }
      if (link && this.config.classes.menuItemLink) {
        link.classList.add(this.config.classes.menuItemLink);
      }
      if (link) {
        link.href = `#${id}`;
        link.textContent = label;
      }

      if (li) {
        menuList.appendChild(li);
      }
    });

    const menuItems = menuElem.querySelectorAll(
      `.${this.config.classes.menuItemLink}`,
    );
    // State: Wire click handlers that raise navigation events.
    menuItems.forEach((item) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        const rawPageName = event.target.hash.substring(1);
        const pageName = rawPageName === 'tools' ? 'more' : rawPageName;
        this.log('init', 'info', 'Menu.init: Navigation click', {
          rawPageName,
          pageName,
        });
        if (this.onNavigate) {
          this.onNavigate(pageName);
        }
      });
    });

    // State: Capture the menu root element on the instance.
    this.element = menuElem;
    // State: Mark Menu as fully initialized.
    this.initialized = true;
    this.log('init', 'objectInitComplete', 'Menu.init: Completed');
    this.log('init', 'info', 'Menu.init: Menu initialized');
    return this.log('init', 'passthroughMethodComplete', this.element, {
      toLogValue: (el) =>
        el ? { tag: el.tagName, class: el.className } : null,
    });
  }

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

  // log: Delegates logging to the shared Logger using Menu conventions.
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
}

bootLogger.moduleClassLoaded(import.meta.url, 'Menu');

Logger.instrumentClass(Menu, 'Menu');

export { Menu };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
