// home.js script
// Purpose: Entry point for site layout and navigation logic.

import { site } from '../modules/home.js';
import './getDates.js';

// Pass body class and header id to site.init()
const bodyClass = document.body.className;
const headerId = 'mainHeader';
const headerTemplateId = 'headerTemplate';
const headerClassName = 'header';
const menuId = 'mainMenu';
const menuTemplateId = 'menuTemplate';
const menuClassName = 'menu';
const mainId = 'mainContent';
const mainTemplateId = 'mainTemplate';
const mainClassName = 'main';
const footerId = 'mainFooter';
const footerTemplateId = 'footerTemplate';
const footerClassName = 'footer';

site.init(
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
);
