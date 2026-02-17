import { bootLogger } from '../modules/models/bootLogger.js';

import { Site } from '../modules/views/site.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(
  import.meta.url,
  'Loads siteConfig JSON and bootstraps Site (index entrypoint)',
);

document.addEventListener('DOMContentLoaded', () => {
  try {
    bootLogger.moduleInfo(import.meta.url, `Site initializing.`);
    new Site();
    bootLogger.moduleInfo(import.meta.url, `Site initialized.`);
  } catch (error) {
    bootLogger.moduleInfo(
      import.meta.url,
      `ERROR: Failed to construct Site (${error?.message || error})`,
      error,
    );
  }
});

bootLogger.moduleLoadCompleted(import.meta.url);
