// Local Storage Module
// Purpose: Handles saving, retrieving, and managing meal plans, recipes, and shopping lists in the browser's localStorage, supporting persistent user data and offline access.

import { bootLogger } from './bootLogger.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(
  import.meta.url,
  'Defines localStorage module (meal plans, recipes, shopping lists)',
);

bootLogger.moduleLoadCompleted(import.meta.url);
