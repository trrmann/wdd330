## Logging configuration

This project has two layers of logging that are both disabled by default and can be enabled only through configuration files:

- **Application logger (Logger)**
  - File: data/siteConfig.json
  - Section: debug
  - To enable logging globally, set `"active": true` under `debug`.
  - To control which message types are emitted, toggle individual flags under `debug.levels` (for example, set `"methodStart": true` and/or `"passthroughMethodComplete": true`).
  - To turn logging on for specific classes, set `"enabled": true` for those class names under `debug.targets.classes`.

- **Boot logger (BootLogger)**
  - File: modules/models/bootLogConfig.js
  - To enable boot-time module logging, set `enabled: true` at the root of `bootLogConfig`.
  - To control which boot events are logged, toggle flags under `levels` (for example, `moduleLoadStarted`, `moduleClassLoaded`, `moduleInfo`).
  - To target specific modules, add or update entries under `modules` using keys like `"modules/views/site.js"` or `"modules/models/logger.js"` and, optionally, per-module `enabled`, `prefix`, or `levels` overrides.

No code changes are required to adjust logging; all behavior is driven by these configuration files.
