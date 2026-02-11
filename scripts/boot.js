// This file is intentionally unused.
// The app entrypoint is scripts/home.js (see index.html).

import { bootLogger } from '../modules/bootLogger.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(
  import.meta.url,
  'Intentionally unused (entrypoint is scripts/home.js)',
);

bootLogger.moduleLoadCompleted(import.meta.url);
