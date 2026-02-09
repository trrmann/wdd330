// Site-wide layout and navigation object
// Home Module
// Purpose: Introduction and navigation to main features.
// ...existing code...
// ...existing code...

// ...existing code...

// ...existing code...

// ...existing code...

// ...existing code...

// ...existing code...

// Site-wide layout and navigation object will be moved to the end of the file.

// Header object
// Home Module
// Purpose: Introduction and navigation to main features.

// Header object
export const header = {
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
    this.element = headerElem;
  },
};

// Menu object
export const menu = {
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
export const main = {
  element: null,
  init(mainId, mainTemplateId, mainClassName) {
    const templateId = mainTemplateId || 'mainTemplate';
    const template = document.getElementById(templateId);
    if (!template) return;
    let mainElem = template.content.firstElementChild.cloneNode(true);
    if (mainClassName) mainElem.className = mainClassName;
    if (mainId) mainElem.id = mainId;
    this.element = mainElem;
  },
};

// Footer object
export const footer = {
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
      this.main.init(mainId, mainTemplateId, mainClassName);
      this.footer.init(footerId, footerTemplateId, footerClassName);
      // Append elements to body with specified class
      const body = document.querySelector(`body.${bodyClass}`);
      if (body) {
        if (this.header.element) body.appendChild(this.header.element);
        if (this.main.element) body.appendChild(this.main.element);
        if (this.footer.element) body.appendChild(this.footer.element);
      }
      this.initialized = true;
    }
  },
};
