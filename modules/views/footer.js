import { bootLogger } from '../models/bootLogger.js';

import { Logger } from '../models/logger.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(import.meta.url, 'Defines Footer shell component');

// Footer Module
// Purpose: Renders footer content and applies configured labels and styling.
// Usage: const footer = new Footer(config, { logger });
class Footer {
  // constructor: Creates the Footer and starts initialization.
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

  // init: Builds footer DOM and applies labels, year, and classes.
  init() {
    if (this.initialized) {
      // State: Reuse existing footer element when already initialized.
      return this.log('init', 'passthroughMethodComplete', this.element, {
        toLogValue: (el) =>
          el ? { tag: el.tagName, class: el.className } : null,
      });
    }

    this.log('init', 'methodStart', 'Footer.init: Starting');
    this.log('init', 'objectInitStart', 'Footer.init: Starting');

    const template = document.getElementById(this.config.ids.templates.footer);
    if (!template) {
      return this.log('init', 'passthroughMethodComplete', undefined, {
        canLogReturnValue: false,
        toLogValue: undefined,
        message: 'Footer.init: Early return - no footer template found',
      });
    }

    const footerElem = template.content.firstElementChild.cloneNode(true);
    // State: Configure footer root element classes and id.
    if (this.config.classes.footer) {
      footerElem.className = this.config.classes.footer;
    }
    if (this.config.ids.footer) {
      footerElem.id = this.config.ids.footer;
    }

    const footerContent =
      this.config.ids && this.config.ids.footerContent
        ? footerElem.querySelector(
            `#${CSS.escape(this.config.ids.footerContent)}`,
          )
        : null;
    if (footerContent) {
      // State: Apply footer content styling classes.
      if (this.config.classes && this.config.classes.footerContent) {
        footerContent.classList.add(this.config.classes.footerContent);
      }
      if (this.config.classes && this.config.classes.copyright) {
        footerContent.classList.add(this.config.classes.copyright);
      }
    }

    const courseSpan =
      this.config.ids && this.config.ids.footerCourse
        ? footerElem.querySelector(
            `#${CSS.escape(this.config.ids.footerCourse)}`,
          )
        : null;
    if (courseSpan) {
      // State: Apply course label styling and text.
      if (this.config.classes && this.config.classes.footerCourse) {
        courseSpan.classList.add(this.config.classes.footerCourse);
      }
      if (this.config.footer && this.config.footer.courseLabel) {
        courseSpan.textContent = this.config.footer.courseLabel;
      }
    }

    const yearSpan =
      this.config.ids && this.config.ids.footerYear
        ? footerElem.querySelector(`#${CSS.escape(this.config.ids.footerYear)}`)
        : null;
    if (yearSpan) {
      // State: Apply year styling class and set current year text.
      if (this.config.classes && this.config.classes.footerYear) {
        yearSpan.classList.add(this.config.classes.footerYear);
      }
      const currentYear = new Date().getFullYear();
      yearSpan.textContent = String(currentYear);
    }

    const authorSpan =
      this.config.ids && this.config.ids.footerAuthor
        ? footerElem.querySelector(
            `#${CSS.escape(this.config.ids.footerAuthor)}`,
          )
        : null;
    if (authorSpan) {
      // State: Apply author styling class and configured author text.
      if (this.config.classes && this.config.classes.footerAuthor) {
        authorSpan.classList.add(this.config.classes.footerAuthor);
      }
      if (this.config.footer && this.config.footer.authorName) {
        authorSpan.textContent = this.config.footer.authorName;
      }
    }

    // State: Capture the footer root element on the instance.
    this.element = footerElem;
    // State: Mark Footer as fully initialized.
    this.initialized = true;
    this.log('init', 'objectInitComplete', 'Footer.init: Completed');
    this.log('init', 'info', 'Footer.init: Footer initialized');
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
    };
  }

  // log: Delegates logging to the shared Logger using Footer conventions.
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
}

bootLogger.moduleClassLoaded(import.meta.url, 'Footer');

Logger.instrumentClass(Footer, 'Footer');

export { Footer };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
