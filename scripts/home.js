import { site } from '../modules/home.js';
import './getDates.js';

const siteConfig = {
  // Body
  bodyClass: 'body',

  // Header
  headerId: 'header',
  headerTemplateId: 'headerTemplate',
  headerClassName: 'header',
  hamburgerSelector: '.header-hamburger',
  hamburgerIconSelector: '.hamburger-icon',

  // Menu
  menuId: 'menu',
  menuTemplateId: 'menuTemplate',
  menuClassName: 'menu',
  menuListSelector: '.menu-list',
  menuItemSelector: '.menu-item a',

  // Main
  mainId: 'main',
  mainClassName: 'main',
  mainTemplateId: 'mainTemplate',
  mainContentWrapperSelector: '.content-wrapper',
  mainTitleSelector: 'h2',

  // Page Templates
  homePageTemplateId: 'homePageTemplate',
  recipesPageTemplateId: 'recipesPageTemplate',
  mealPlanPageTemplateId: 'mealPlanPageTemplate',
  shoppingPageTemplateId: 'shoppingPageTemplate',
  morePageTemplateId: 'morePageTemplate',

  // Home Page
  searchBarSelector: '.search-bar input',
  searchButtonSelector: '.search-bar button',
  mealPlanButtonSelector: '.meal-plan-summary',
  shoppingListButtonSelector: '.shopping-list-btn',
  recipeCardsSelector: '.recipe-cards',
  recipeCardTemplateId: 'recipeCardTemplate',

  // Footer
  footerId: 'footer',
  footerTemplateId: 'footerTemplate',
  footerClassName: 'footer',
};

site.init(siteConfig);


