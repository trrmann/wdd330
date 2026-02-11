// API Access Module
// Purpose: Manages all communication with external APIs, including constructing requests, handling responses, and error management for recipe and nutrition data, ensuring reliable and secure data flow.

import { bootLogger } from './bootLogger.js';

bootLogger.moduleLoadStarted(import.meta.url);

bootLogger.moduleInfo(
  import.meta.url,
  'Defines API access module (requests, responses, errors)',
);

bootLogger.moduleLoadCompleted(import.meta.url);
