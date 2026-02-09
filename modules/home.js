

import {
  homePage,
  recipesPage,
  mealPlanPage,
  shoppingPage,
  morePage,
} from './responsiveLayout.js';

// Header object
const header = {
  element: null,
  init(config) {
    // Use header template from DOM
    const template = document.getElementById(config.headerTemplateId);
    if (!template) return;
    let headerElem = template.content.firstElementChild.cloneNode(true);
    // Set header class name if provided
    if (config.headerClassName) headerElem.className = config.headerClassName;
    // Set header id if provided
    if (config.headerId) headerElem.id = config.headerId;
    // Initialize and append menu
    menu.init(config);
    if (menu.element) headerElem.appendChild(menu.element);

    // Hamburger menu toggle logic
    const hamburgerBtn = headerElem.querySelector(config.hamburgerSelector);
    const hamburgerIcon = hamburgerBtn
      ? hamburgerBtn.querySelector(config.hamburgerIconSelector)
      : null;
    const menuList = menu.element
      ? menu.element.querySelector(config.menuListSelector)
      : null;
    if (hamburgerBtn && menuList && hamburgerIcon) {
      // Restore original hamburger icon markup
      hamburgerIcon.innerHTML = `
        <rect y="2" width="28" height="4" rx="2" fill="currentColor" />
        <rect y="8" width="28" height="4" rx="2" fill="currentColor" />
        <rect y="14" width="28" height="4" rx="2" fill="currentColor" />
      `;
      // Hide menu-list by default for tablet/mobile
      // Hide menu-list by default
      menuList.classList.remove('active');
      menuList.setAttribute('aria-hidden', 'true');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      hamburgerBtn.addEventListener('click', () => {
        const isActive = menuList.classList.toggle('active');
        menuList.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        hamburgerBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');

        // Switch hamburger icon
        if (isActive) {
          // Change to X icon using two rotated rectangles
          hamburgerIcon.innerHTML = `
            <rect x="0" y="8" width="28" height="4" rx="2" fill="currentColor" transform="rotate(45 14 10)" />
            <rect x="0" y="8" width="28" height="4" rx="2" fill="currentColor" transform="rotate(-45 14 10)" />
          `;
        } else {
          // Change to hamburger icon (3 lines)
          hamburgerIcon.innerHTML = `
            <rect y="2" width="28" height="4" rx="2" fill="currentColor" />
            <rect y="8" width="28" height="4" rx="2" fill="currentColor" />
            <rect y="14" width="28" height="4" rx="2" fill="currentColor" />
          `;
        }
      });
    }
    this.element = headerElem;
  },
};

// Menu object
const menu = {
  element: null,
  init(config) {
    const template = document.getElementById(config.menuTemplateId);
    if (!template) return;
    let menuElem = template.content.firstElementChild.cloneNode(true);
    if (config.menuClassName) menuElem.className = config.menuClassName;
    if (config.menuId) menuElem.id = config.menuId;

    const menuItems = menuElem.querySelectorAll(config.menuItemSelector);
    menuItems.forEach((item) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        const pageName = event.target.hash.substring(1);
        main.loadPage(pageName, config);
      });
    });

    this.element = menuElem;
  },
};

// Main object
const main = {
  element: null,
  init(config) {
    const template = document.getElementById(config.mainTemplateId);
    if (!template) return;
    let mainElem = template.content.firstElementChild.cloneNode(true);
    if (config.mainClassName) mainElem.className = config.mainClassName;
    if (config.mainId) mainElem.id = config.mainId;

    const page = homePage.init(config);
    if (page) {
      const titleElement = mainElem.querySelector(config.mainTitleSelector);
      if (titleElement) {
        titleElement.textContent = page.title;
      }
      const contentElement = mainElem.querySelector(
        config.mainContentWrapperSelector,
      );
      if (contentElement) {
        contentElement.innerHTML = page.content;
      }
    }

    this.element = mainElem;
  },
  loadPage(pageName, config) {
    let page;
    switch (pageName) {
      case 'home':
        page = homePage.init(config);
        break;
      case 'recipes':
        page = recipesPage.init(config);
        break;
      case 'mealplan':
        page = mealPlanPage.init(config);
        break;
      case 'shopping':
        page = shoppingPage.init(config);
        break;
      case 'more':
        page = morePage.init(config);
        break;
      default:
        page = homePage.init(config);
    }

    const mainElement = document.querySelector(`.${config.mainClassName}`);
    const titleElement = mainElement.querySelector(config.mainTitleSelector);
    const contentElement = mainElement.querySelector(
      config.mainContentWrapperSelector,
    );

    if (titleElement) {
      titleElement.textContent = page.title;
    }
    if (contentElement) {
      contentElement.innerHTML = page.content;
    }
  },
};

// Footer object
const footer = {
  element: null,
  init(config) {
    const template = document.getElementById(config.footerTemplateId);
    if (!template) return;
    let footerElem = template.content.firstElementChild.cloneNode(true);
    if (config.footerClassName) footerElem.className = config.footerClassName;
    if (config.footerId) footerElem.id = config.footerId;
    this.element = footerElem;
  },
};

// Site-wide layout and navigation object
export const site = {
  header,
  main,
  footer,
  initialized: false,
  init(config) {
    if (!this.initialized) {
      this.header.init(config);
      this.main.init(config);
      this.footer.init(config);
      // Append elements to body with specified class
      const body = document.querySelector(`body.${config.bodyClass}`);
      if (body) {
        if (this.header.element) body.appendChild(this.header.element);
        if (this.main.element) {
          body.appendChild(this.main.element);
        }
        if (this.footer.element) body.appendChild(this.footer.element);
      }
      this.initialized = true;
    }
  },
};

