

import {
  homePage,
  recipesPage,
  mealPlanPage,
  shoppingPage,
  morePage,
  loadRecipeCards,
} from './responsiveLayout.js';

// Header object
const header = {
  element: null,
  init(
    headerId,
    headerTemplateId,
    headerClassName,
    menuId,
    menuTemplateId,
    menuClassName,
  ) {
    // Use header template from DOM
    const templateId = headerTemplateId || 'headerTemplate';
    const template = document.getElementById(templateId);
    if (!template) return;
    let headerElem = template.content.firstElementChild.cloneNode(true);
    // Set header class name if provided
    if (headerClassName) headerElem.className = headerClassName;
    // Set header id if provided
    if (headerId) headerElem.id = headerId;
    // Initialize and append menu
    menu.init(menuId, menuTemplateId, menuClassName);
    if (menu.element) headerElem.appendChild(menu.element);

    // Hamburger menu toggle logic
    const hamburgerBtn = headerElem.querySelector('.header-hamburger');
    const hamburgerIcon = hamburgerBtn
      ? hamburgerBtn.querySelector('.hamburger-icon')
      : null;
    const menuList = menu.element
      ? menu.element.querySelector('.menu-list')
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
  init(menuId, menuTemplateId, menuClassName) {
    const templateId = menuTemplateId || 'menuTemplate';
    const template = document.getElementById(templateId);
    if (!template) return;
    let menuElem = template.content.firstElementChild.cloneNode(true);
    if (menuClassName) menuElem.className = menuClassName;
    if (menuId) menuElem.id = menuId;
    this.element = menuElem;
  },
};

// Main object
const main = {
  element: null,
  init(mainId, mainTemplateId, mainClassName, page) {
    const templateId = mainTemplateId || 'mainTemplate';
    const template = document.getElementById(templateId);
    if (!template) return;
    let mainElem = template.content.firstElementChild.cloneNode(true);
    if (mainClassName) mainElem.className = mainClassName;
    if (mainId) mainElem.id = mainId;

    if (page) {
      const titleElement = mainElem.querySelector('h2');
      if (titleElement) {
        titleElement.textContent = page.title;
      }
      const contentElement = mainElem.querySelector('.content-wrapper');
      if (contentElement) {
        contentElement.innerHTML = page.content;
      }
    }

    this.element = mainElem;
  },
  loadPage(pageName) {
    let page;
    switch (pageName) {
      case 'home':
        page = homePage;
        break;
      case 'recipes':
        page = recipesPage;
        break;
      case 'mealplan':
        page = mealPlanPage;
        break;
      case 'shopping':
        page = shoppingPage;
        break;
      case 'more':
        page = morePage;
        break;
      default:
        page = homePage;
    }

    const mainElement = document.querySelector('.main');
    const titleElement = mainElement.querySelector('h2');
    const contentElement = mainElement.querySelector('.content-wrapper');

    if (titleElement) {
      titleElement.textContent = page.title;
    }
    if (contentElement) {
      contentElement.innerHTML = page.content;
      if (pageName === 'home') {
        loadRecipeCards();
      }
    }
  },
};

// Footer object
const footer = {
  element: null,
  init(footerId, footerTemplateId, footerClassName) {
    const templateId = footerTemplateId || 'footerTemplate';
    const template = document.getElementById(templateId);
    if (!template) return;
    let footerElem = template.content.firstElementChild.cloneNode(true);
    if (footerClassName) footerElem.className = footerClassName;
    if (footerId) footerElem.id = footerId;
    this.element = footerElem;
  },
};

// Site-wide layout and navigation object
export const site = {
  header,
  main,
  footer,
  initialized: false,
  init(
    bodyClass,
    headerId,
    headerTemplateId,
    headerClassName,
    menuId,
    menuTemplateId,
    menuClassName,
    mainId,
    mainTemplateId,
    mainClassName,
    footerId,
    footerTemplateId,
    footerClassName,
  ) {
    if (!this.initialized) {
      this.header.init(
        headerId,
        headerTemplateId,
        headerClassName,
        menuId,
        menuTemplateId,
        menuClassName,
      );
      this.main.init(mainId, mainTemplateId, mainClassName, homePage);
      this.footer.init(footerId, footerTemplateId, footerClassName);
      // Append elements to body with specified class
      const body = document.querySelector(`body.${bodyClass}`);
      if (body) {
        if (this.header.element) body.appendChild(this.header.element);
        if (this.main.element) {
          body.appendChild(this.main.element);
          // If the initial page is home, load the recipe cards
          if (this.main.element.querySelector('.recipe-cards')) {
            loadRecipeCards();
          }
        }
        if (this.footer.element) body.appendChild(this.footer.element);
      }
      this.initialized = true;
      this.addMenuEventListeners();
      this.addHomePageEventListeners();
    }
  },
  addHomePageEventListeners() {
    const mainElement = this.main.element;
    if (!mainElement) return;

    const searchInput = mainElement.querySelector('.search-bar input');
    const searchButton = mainElement.querySelector('.search-bar button');

    const triggerSearch = () => {
      const searchTerm = searchInput.value.toLowerCase();
      loadRecipeCards(searchTerm);
    };

    if (searchButton) {
      searchButton.addEventListener('click', triggerSearch);
    }

    if (searchInput) {
      searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          triggerSearch();
        }
      });
    }

    const mealPlanButton = mainElement.querySelector('.meal-plan-summary');
    if (mealPlanButton) {
      mealPlanButton.addEventListener('click', () => {
        this.main.loadPage('mealplan');
      });
    }

    const shoppingListButton = mainElement.querySelector('.shopping-list-btn');
    if (shoppingListButton) {
      shoppingListButton.addEventListener('click', () => {
        this.main.loadPage('shopping');
      });
    }
  },
  addMenuEventListeners() {
    const menuItems = document.querySelectorAll('.menu-item a');
    menuItems.forEach((item) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        const pageName = event.target.hash.substring(1);
        this.main.loadPage(pageName);
      });
    });
  },
};

