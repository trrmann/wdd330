import { bootLogConfig } from './bootLogConfig.js';

class BootLogger {
  static get descriptors() {
    return {
      config: {
        value: null,
        writable: true,
        enumerable: false,
        configurable: false,
      },
    };
  }

  constructor(config = null) {
    Object.defineProperties(this, BootLogger.descriptors);
    this.config = config;
  }

  setConfig(config) {
    this.config = config;
  }

  getEffectiveConfig(moduleUrl = null) {
    const baseConfig = this.config || {};
    const baseModules = baseConfig.modules || {};

    let moduleOverride = null;
    if (moduleUrl) {
      const moduleKeys = this.getModuleKeys(moduleUrl);
      for (const moduleKey of moduleKeys) {
        if (baseModules && baseModules[moduleKey]) {
          moduleOverride = baseModules[moduleKey];
          break;
        }
      }
      if (!moduleOverride && baseModules['*']) {
        moduleOverride = baseModules['*'];
      }
    }

    const baseNoModules = { ...baseConfig };
    delete baseNoModules.modules;

    const overrideNoModules = moduleOverride ? { ...moduleOverride } : {};
    delete overrideNoModules.modules;

    const mergedLevels = {
      ...(baseNoModules.levels || {}),
      ...(overrideNoModules.levels || {}),
    };

    return {
      ...baseNoModules,
      ...overrideNoModules,
      levels: mergedLevels,
    };
  }

  isEnabled(level, moduleUrl = null) {
    const effectiveConfig = this.getEffectiveConfig(moduleUrl);
    return !!(
      effectiveConfig &&
      effectiveConfig.enabled &&
      effectiveConfig.levels &&
      effectiveConfig.levels[level]
    );
  }

  log(level, ...args) {
    if (!this.isEnabled(level)) return;
    const effectiveConfig = this.getEffectiveConfig(null);
    const prefix =
      effectiveConfig && effectiveConfig.prefix ? effectiveConfig.prefix : '';
    if (prefix) {
      console.log(prefix, ...args);
      return;
    }
    console.log(...args);
  }

  logModule(level, moduleUrl, ...args) {
    if (!this.isEnabled(level, moduleUrl)) return;
    const effectiveConfig = this.getEffectiveConfig(moduleUrl);
    const prefix =
      effectiveConfig && effectiveConfig.prefix ? effectiveConfig.prefix : '';
    if (prefix) {
      console.log(prefix, ...args);
      return;
    }
    console.log(...args);
  }

  moduleLoadStarted(moduleUrl) {
    const moduleName = this.formatModuleName(moduleUrl);
    this.logModule(
      'moduleLoadStarted',
      moduleUrl,
      `moduleLoadStarted: ${moduleName}`,
    );
  }

  moduleLoadCompleted(moduleUrl) {
    const moduleName = this.formatModuleName(moduleUrl);
    this.logModule(
      'moduleLoadCompleted',
      moduleUrl,
      `moduleLoadCompleted: ${moduleName}`,
    );
  }

  moduleClassLoaded(moduleUrl, classMessage = '') {
    const moduleName = this.formatModuleName(moduleUrl);
    const message = classMessage ? ` ${classMessage}` : '';
    this.logModule(
      'moduleClassLoaded',
      moduleUrl,
      `moduleClassLoaded: ${moduleName}${message}`,
    );
  }

  moduleInfo(moduleUrl, infoMessage = '') {
    const moduleName = this.formatModuleName(moduleUrl);
    const message = infoMessage ? ` ${infoMessage}` : '';
    this.logModule(
      'moduleInfo',
      moduleUrl,
      `moduleInfo: ${moduleName}${message}`,
    );
  }

  getModuleKeys(moduleUrl) {
    if (!moduleUrl) return ['(unknown module)'];
    try {
      const url = new URL(moduleUrl);
      const parts = url.pathname.split('/').filter(Boolean);
      const last2 = parts.slice(-2).join('/');
      const last3 = parts.slice(-3).join('/');
      const keys = [last2, last3].filter(Boolean);
      return Array.from(new Set(keys));
    } catch {
      const raw = String(moduleUrl);
      return [raw];
    }
  }

  formatModuleName(moduleUrl) {
    if (!moduleUrl) return '(unknown module)';
    try {
      const url = new URL(moduleUrl);
      const parts = url.pathname.split('/').filter(Boolean);
      return parts.slice(-2).join('/');
    } catch {
      return String(moduleUrl);
    }
  }
}

const bootLogger = new BootLogger(bootLogConfig);

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(
  import.meta.url,
  'Defines BootLogger and bootLogger instance',
);

bootLogger.moduleClassLoaded(import.meta.url, 'BootLogger');

export { BootLogger, bootLogger };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
