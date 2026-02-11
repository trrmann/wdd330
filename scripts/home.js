import { bootLogger } from '../modules/bootLogger.js';

import { Site } from '../modules/home.js';
import { Logger } from '../modules/logger.js';
import './getDates.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(
  import.meta.url,
  'Loads siteConfig JSON and bootstraps Site',
);

async function loadSiteConfig() {
  const logger = new Logger(null);
  logger.deferFunctionLog(
    'functionStart',
    'HomeScript',
    'loadSiteConfig',
    'HomeScript.loadSiteConfig: Starting',
  );

  const configUrl = new URL('../data/siteConfig.json', import.meta.url);
  bootLogger.moduleInfo(
    import.meta.url,
    `Loading siteConfig from ${configUrl.href}`,
  );

  const response = await fetch(configUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to load siteConfig.json (${response.status} ${response.statusText})`,
    );
  }

  const siteConfig = await response.json();

  logger.setConfig(siteConfig);

  const keyCount =
    siteConfig && typeof siteConfig === 'object'
      ? Object.keys(siteConfig).length
      : 0;
  bootLogger.moduleInfo(
    import.meta.url,
    `Loaded siteConfig.json (${keyCount} keys)`,
  );

  return logger.passthroughFunction(
    'HomeScript',
    'loadSiteConfig',
    siteConfig,
    {
      canLogValue: true,
      message: 'HomeScript.loadSiteConfig return',
      completeMessage: 'HomeScript.loadSiteConfig: Completed',
    },
  );
}

document.addEventListener('DOMContentLoaded', () => {
  (async () => {
    try {
      const siteConfig = await loadSiteConfig();
      bootLogger.moduleInfo(
        import.meta.url,
        `siteConfig (full): ${JSON.stringify(siteConfig, null, 2)}`,
      );
      bootLogger.moduleInfo(import.meta.url, `Site initializing.`);
      new Site(siteConfig);
      bootLogger.moduleInfo(import.meta.url, `Site initialized.`);
    } catch (error) {
      bootLogger.moduleInfo(
        import.meta.url,
        `ERROR: Failed to bootstrap Site from siteConfig.json (${error?.message || error})`,
      );
      console.error('Error bootstrapping site from JSON config:', error);
    }
  })();
});

bootLogger.moduleLoadCompleted(import.meta.url);
