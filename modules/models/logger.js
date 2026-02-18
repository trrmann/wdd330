import { bootLogger } from './bootLogger.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(import.meta.url, 'Defines app Logger (siteConfig.debug)');

// Logger Module
// Purpose: Central application logger which honors siteConfig.debug levels and
// targets, including deferred logging before configuration is applied.
// Usage: import { Logger } from './logger.js';
//        const logger = new Logger(config); logger.classMethodLog('info', 'MyClass', 'myMethod', 'message');
class Logger {
  constructor(config = null) {
    this.init(config);
  }

  init(config = null) {
    Object.defineProperties(this, Logger.descriptors);
    this.config = config;

    this.classMethodLog(
      'objectCreateStart',
      'Logger',
      'constructor',
      'Logger.constructor: Starting',
    );
    this.classMethodLog(
      'info',
      'Logger',
      'constructor',
      'Logger.constructor: Logger configured',
    );
    this.classMethodLog(
      'objectCreateComplete',
      'Logger',
      'constructor',
      'Logger.constructor: Completed',
    );

    if (config) {
      Logger.flushStatic(this);
    }
  }

  static get descriptors() {
    return {
      config: {
        value: null,
        writable: true,
        enumerable: false,
        configurable: false,
      },
      deferredEntries: {
        value: [],
        writable: true,
        enumerable: false,
        configurable: false,
      },
    };
  }

  isSignatureLevel(level) {
    if (typeof level !== 'string') return false;

    return (
      level.startsWith('method') ||
      level.startsWith('function') ||
      level.startsWith('passthroughMethod') ||
      level.startsWith('passthroughFunction')
    );
  }

  classLog(level, className, ...args) {
    if (!className) return;
    if (this.isSignatureLevel(level)) {
      // Signature levels require a method/function name.
      return;
    }
    this.log(level, { className }, ...args);
  }

  classMethodLog(level, className, methodName, ...args) {
    if (!className || !methodName) return;
    if (this.isSignatureLevel(level)) {
      this.log(level, className, methodName, ...args);
      return;
    }
    this.log(level, { className, methodName }, ...args);
  }

  functionLog(level, ownerName, functionName, ...args) {
    if (!ownerName || !functionName) return;
    // Functions use the same target model as class methods (ownerName acts like className).
    this.classMethodLog(level, ownerName, functionName, ...args);
  }

  deferClassLog(level, className, ...args) {
    this.defer(level, { className }, ...args);
  }

  deferClassMethodLog(level, className, methodName, ...args) {
    if (this.isSignatureLevel(level)) {
      this.defer(level, className, methodName, ...args);
      return;
    }
    this.defer(level, { className, methodName }, ...args);
  }

  deferFunctionLog(level, ownerName, functionName, ...args) {
    this.deferClassMethodLog(level, ownerName, functionName, ...args);
  }
  setConfig(config, options = {}) {
    const { flushDeferred = true } = options;
    this.config = config;
    if (flushDeferred) {
      this.flushDeferred();
    }

    Logger.flushStatic(this);
  }

  defer(level, ...args) {
    this.deferredEntries.push({ level, args });
  }

  flushDeferred() {
    if (!this.deferredEntries || this.deferredEntries.length === 0) return;
    const entries = this.deferredEntries.slice();
    this.deferredEntries.length = 0;
    entries.forEach((entry) => {
      this.log(entry.level, ...entry.args);
    });
  }

  isEnabled(level) {
    const debugConfig = this.config && this.config.debug;
    if (!debugConfig || !debugConfig.active) return false;

    const levels = debugConfig.levels || {};
    return !!levels[level];
  }

  isTargetEnabled(context) {
    const debugConfig = this.config && this.config.debug;
    const targets = debugConfig && debugConfig.targets;
    if (!targets) return true;

    const defaultEnabled = targets.defaultEnabled !== false;
    const classes = targets.classes || {};

    const className = context && context.className ? context.className : null;
    const methodName =
      context && context.methodName ? context.methodName : null;

    const classConfig =
      (className && classes[className]) || classes['*'] || null;

    let classEnabled = defaultEnabled;
    if (classConfig && typeof classConfig.enabled === 'boolean') {
      classEnabled = classConfig.enabled;
    }

    if (!methodName) return classEnabled;

    const methods = (classConfig && classConfig.methods) || {};
    if (Object.prototype.hasOwnProperty.call(methods, methodName)) {
      return !!methods[methodName];
    }
    if (Object.prototype.hasOwnProperty.call(methods, '*')) {
      return !!methods['*'];
    }
    return classEnabled;
  }

  extractContext(args) {
    if (!args || args.length === 0) return { context: null, rest: [] };
    const first = args[0];
    const isObject =
      first && typeof first === 'object' && !Array.isArray(first);
    const looksLikeContext =
      isObject && ('className' in first || 'methodName' in first);
    if (!looksLikeContext) return { context: null, rest: args };
    return { context: first, rest: args.slice(1) };
  }

  log(level, ...args) {
    if (!this.isEnabled(level)) return;

    // Method/function levels REQUIRE (className, methodName, ...rest)
    if (this.isSignatureLevel(level)) {
      const className = args[0];
      const methodName = args[1];
      const rest = args.slice(2);

      if (typeof className !== 'string' || typeof methodName !== 'string') {
        return;
      }

      const context = { className, methodName };
      if (!this.isTargetEnabled(context)) return;
      console.log(...rest);
      return;
    }

    const { context, rest } = this.extractContext(args);
    if (context && !this.isTargetEnabled(context)) return;

    console.log(...rest);
  }

  passthrough(level, className, methodName, returnValue, options = {}) {
    const { canLogValue = true, toLogValue, message = null } = options;
    const logMessage =
      typeof message === 'string' && message.length > 0
        ? message
        : `${className}.${methodName} return`;

    const logReturn = (resolvedValue) => {
      if (!canLogValue) {
        this.log(level, className, methodName, `${logMessage}:`, '| completed');
        return resolvedValue;
      }
      let valueForLog = resolvedValue;
      let hasValue = valueForLog !== undefined;
      if (typeof toLogValue === 'function') {
        try {
          valueForLog = toLogValue(resolvedValue);
          hasValue = valueForLog !== undefined;
        } catch {
          valueForLog = resolvedValue;
          hasValue = valueForLog !== undefined;
        }
      }
      if (hasValue) {
        this.log(
          level,
          className,
          methodName,
          `${logMessage}:`,
          valueForLog,
          '| completed',
        );
      } else {
        this.log(level, className, methodName, `${logMessage}:`, '| completed');
      }
      // Always return the original value, never the summary
      return resolvedValue;
    };

    if (returnValue && typeof returnValue.then === 'function') {
      return returnValue.then(logReturn);
    }

    return logReturn(returnValue);
  }

  passthroughMethod(className, methodName, returnValue, options = {}) {
    return this.passthrough(
      'passthroughMethodComplete',
      className,
      methodName,
      returnValue,
      options,
    );
  }

  passthroughFunction(className, functionName, returnValue, options = {}) {
    return this.passthrough(
      'passthroughFunctionComplete',
      className,
      functionName,
      returnValue,
      options,
    );
  }

  static get staticDeferredEntries() {
    if (!this._staticDeferredEntries) {
      this._staticDeferredEntries = [];
    }
    return this._staticDeferredEntries;
  }

  static flushStatic(logger) {
    if (!logger) return;
    const entries = Logger.staticDeferredEntries;
    if (!entries || entries.length === 0) return;

    const toFlush = entries.slice();
    entries.length = 0;
    toFlush.forEach((entry) => {
      switch (entry.kind) {
        case 'staticClassLog':
          logger.classLog(entry.level, entry.className, ...(entry.args || []));
          break;
        case 'staticClassMethodLog':
          logger.classMethodLog(
            entry.level,
            entry.className,
            entry.methodName,
            ...(entry.args || []),
          );
          break;
        case 'staticFunctionLog':
          logger.functionLog(
            entry.level,
            entry.ownerName,
            entry.functionName,
            ...(entry.args || []),
          );
          break;
        case 'staticClassMethodPassthrough':
          logger.passthrough(
            entry.level,
            entry.className,
            entry.methodName,
            entry.returnValue,
            entry.options,
          );
          break;
        case 'staticFunctionPassthrough':
          logger.passthrough(
            entry.level,
            entry.ownerName,
            entry.functionName,
            entry.returnValue,
            entry.options,
          );
          break;
        default:
          break;
      }
    });
  }

  static staticClassLog(level, className, ...args) {
    Logger.staticDeferredEntries.push({
      kind: 'staticClassLog',
      level,
      className,
      args,
    });
  }

  static staticClassMethodLog(level, className, methodName, ...args) {
    Logger.staticDeferredEntries.push({
      kind: 'staticClassMethodLog',
      level,
      className,
      methodName,
      args,
    });
  }

  static staticClassMethodPassthrough(
    level,
    className,
    methodName,
    returnValue,
    options = {},
  ) {
    Logger.staticDeferredEntries.push({
      kind: 'staticClassMethodPassthrough',
      level,
      className,
      methodName,
      returnValue,
      options,
    });

    return returnValue;
  }

  static staticFunctionLog(level, ownerName, functionName, ...args) {
    Logger.staticDeferredEntries.push({
      kind: 'staticFunctionLog',
      level,
      ownerName,
      functionName,
      args,
    });
  }

  static staticFunctionPassthrough(
    level,
    ownerName,
    functionName,
    returnValue,
    options = {},
  ) {
    Logger.staticDeferredEntries.push({
      kind: 'staticFunctionPassthrough',
      level,
      ownerName,
      functionName,
      returnValue,
      options,
    });

    return returnValue;
  }

  static instrumentClass(ClassCtor, className, toLogValueMap = {}) {
    if (!ClassCtor || !ClassCtor.prototype) return;

    const methodNames = Object.getOwnPropertyNames(ClassCtor.prototype);
    methodNames.forEach((methodName) => {
      if (methodName === 'constructor') return;

      const descriptor = Object.getOwnPropertyDescriptor(
        ClassCtor.prototype,
        methodName,
      );
      if (!descriptor || typeof descriptor.value !== 'function') return;
      const original = descriptor.value;

      if (original.__isInstrumentedForAppLogging) return;

      // Allow per-method toLogValue mapping for summary logging
      const toLogValue =
        toLogValueMap && typeof toLogValueMap[methodName] === 'function'
          ? toLogValueMap[methodName]
          : null;

      const wrapped = function (...args) {
        const logger = this && this.logger ? this.logger : null;

        logger?.classMethodLog(
          'methodStart',
          className,
          methodName,
          `${className}.${methodName}: Starting`,
        );

        let result;
        try {
          result = original.apply(this, args);
        } catch (error) {
          logger?.classMethodLog(
            'methodComplete',
            className,
            methodName,
            `${className}.${methodName}: Completed (threw)`,
            error,
          );
          throw error;
        }

        const finalize = (returnValue) => {
          if (!logger) return returnValue;
          return logger.passthroughMethod(className, methodName, returnValue, {
            canLogValue: true,
            message: `${className}.${methodName} return`,
            completeMessage: `${className}.${methodName}: Completed`,
            toLogValue,
          });
        };

        if (result && typeof result.then === 'function') {
          return result.then(finalize);
        }

        return finalize(result);
      };

      wrapped.__isInstrumentedForAppLogging = true;
      wrapped.__original = original;

      Object.defineProperty(ClassCtor.prototype, methodName, {
        ...descriptor,
        value: wrapped,
      });
    });
  }
}

bootLogger.moduleClassLoaded(import.meta.url, 'Logger');

export { Logger };

bootLogger.moduleInfo(import.meta.url, 'Exports defined.');

bootLogger.moduleLoadCompleted(import.meta.url);
