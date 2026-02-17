# Chow Planner Refactor Standards and Plan

This document defines the standards and plan to bring the project into spec for logging, documentation, and method order in classes **without changing any runtime behavior yet**. It is the checklist and reference used when we later refactor code.

---

## 1. Logging Spec (Task 2)

**Goals**

- Use a consistent logging model for:
  - Object creation (`objectCreateStart`, `objectCreateComplete`).
  - Initialization (`objectInitStart`, `objectInitComplete`).
  - Lifecycle milestones (`lifecycle`, `domReady`, `pageLoadStart`, `pageLoadComplete`).
  - Method and function calls (`methodStart`, `methodComplete`, `functionStart`, `functionComplete`).
  - Return values / passthrough (`passthroughMethodComplete`, `passthroughFunctionComplete`).
  - State changes and high-level info (`info`).
- Control logging via configuration only (no hard-coded `console.log` in app code).

**Standard Levels**

- **Creation**
  - `objectCreateStart` – at the start of a constructor that does non-trivial work.
  - `objectCreateComplete` – at the end of the constructor.
- **Initialization**
  - `objectInitStart` – at the start of an `init`-style method that prepares DOM or state.
  - `objectInitComplete` – at the end of that method, after success.
- **Lifecycle / DOM**
  - `lifecycle` – major lifecycle milestones (e.g., page afterRender, event binding, route changes).
  - `domReady` – when DOM is assembled and ready for user interaction.
  - `pageLoadStart` / `pageLoadComplete` – around page loading if/when routing is centralized.
- **Methods / Functions**
  - `methodStart`, `methodComplete` – used by `Logger.instrumentClass` or manual logging for key methods.
  - `functionStart`, `functionComplete` – same idea for non-method functions.
- **Passthrough / Returns**
  - `passthroughMethodComplete`, `passthroughFunctionComplete` – delegated through `Logger.passthrough*` to log return summaries, never mutate values.
- **Info / State Changes**
  - `info` – compact, high-level state changes (e.g., button toggles, favorites added/removed, plan updated, cache used/expired).

**Usage Rules**

- All logging should flow through `Logger` (or `bootLogger` during boot) and be governed by `siteConfig.debug` and `bootLogConfig`.
- No direct `console.log` in app classes, except for:
  - Very low-level, temporary debug that will be removed.
  - Boot logging via `bootLogger` according to `bootLogConfig`.
- Prefer **signature-style logs** (`methodStart`, `methodComplete`, passthrough levels) for methods that are instrumented by `Logger.instrumentClass`.
- For page and shell classes (`Site`, `Header`, `Menu`, `Main`, `Footer`, page classes):
  - Constructors: log `objectCreateStart`, `objectCreateComplete`, and a short `info` line.
  - `init`-like methods: log `objectInitStart`, `objectInitComplete`, and a short `info` line.
  - Major lifecycle hooks: log with `lifecycle` and/or `domReady` as appropriate.
  - Complex methods that return important values should use `passthroughMethodComplete` with a `toLogValue` summarizer.

**Configuration Rules**

- `bootLogConfig` remains the sole authority for boot-time logging; it lists all modules that may log during boot, with `enabled` and per-level flags.
- `siteConfig.debug` remains the sole authority for app logging:
  - `debug.active` controls whether logging is globally active.
  - `debug.levels` lists all supported levels (as above). New levels must be added there first.
  - `debug.targets.classes` controls which classes are enabled, and optional per-method overrides.
- The logging standard is considered **met** when:
  - All non-temporary logs use supported levels.
  - All core classes follow the constructor/init/lifecycle pattern for logging.
  - No stray `console.log` remain in production code.

---

## 2. Documentation Standards (Task 3)

**Goals**

- Ensure every major module, class, and key method has a concise description of scope and purpose.
- Provide at least one "how to use" example per major module to help future changes.

**Module-Level Documentation**

- At the top of each module file:
  - One short line: `// <Module> Module` or `// <Concept> Module`.
  - One line of purpose: `// Purpose: <what this module is responsible for>.`

**Class-Level Documentation**

- Immediately above each class declaration:
  - A single-line summary of the class responsibility (e.g., `// Manages the header DOM and hamburger menu behavior.`).
- For cross-cutting or shared singletons/collections (e.g., shared `recipes`, `meals`, `profile`, etc.):
  - A short comment near the export explaining that it is shared state and what it represents.

**Method/Function-Level Documentation**

- Only **non-trivial** methods and functions require comments; simple getters/setters or tiny helpers may omit them if names are clear.
- For methods with complexity (branching, side effects, or async behavior), add **one line** above:
  - "What" and optional "when": e.g., `// Loads recipe cards into the home page based on an optional search term.`
  - Avoid restating the method name.

**How-To-Use Examples**

- For each major module (e.g., `Logger`, `Site`, `HomePage` & other pages, `RecipeApi`, `LocalStorage`, `MealPlan`, `ShoppingList`):
  - Provide a short usage snippet or 2–4 bullet points in documentation (not necessarily in code) that explain typical use.
- These examples will live in this document or nearby design docs, not necessarily as code comments.

**Documentation Standard is Met When**

- All modules have the top-of-file purpose comment.
- All major classes have a one-line class summary.
- All complex methods have a single-line purpose comment.
- Each major module has at least one usage example here or in another dedicated doc.

---

## 3. Method Order Standard (Task 4)

**Goals**

- Make classes easy to scan by enforcing a predictable method order.
- Avoid changing behavior while reordering.

**Type Groups (Order Within a Class)**

Within each class, group members in this order:

1. **Static descriptors and constants**
   - `static get descriptors()` and similar metadata statics.
2. **Constructor**
   - `constructor(...) { ... }`.
3. **Initialization methods**
   - Methods named `init`, `afterRender`, `setup`, or equivalent that perform primary initialization.
4. **Accessors**
   - `get` / `set` accessors and simple computed properties.
5. **Public API / lifecycle methods**
   - Main public methods intended to be called from outside the class.
6. **Internal helpers / private-like methods**
   - Helper methods used internally for implementation details.

**Alphabetical Order Within Each Group**

- Within each group, order methods alphabetically by name.
- For `get`/`set` pairs, group them together with `get` first.

**Special Cases**

- Pure-static utility classes (e.g., `Recipes`) that only contain static methods can be treated as one group; static methods should still be alphabetized.
- Classes heavily instrumented by `Logger.instrumentClass` must keep their signatures intact (name, parameters) while we reorder.

**Method Order Standard is Met When**

- Each class file has its methods grouped by the above type groups.
- Within each group, names are alphabetical.
- No method body logic has changed during reordering.

---

## 4. Safe Refactor Workflow (Task 5)

**Goals**

- Apply logging, documentation, and method-order updates with minimal risk.
- Always have a straightforward path to recover from mistakes.

**Workflow Steps**

1. **Create a working branch**
   - `git checkout -b refactor-logging-docs-method-order`
2. **Work one module at a time**
   - Pick a single file (e.g., `modules/site.js`).
   - Apply documentation and method-order changes.
   - Ensure no behavior/logic is altered.
3. **Run the dev workflow after each file or small batch**
   - `./RunDevWorkflow.ps1`
   - Only proceed when it succeeds.
4. **Review diffs**
   - `git diff modules/site.js`
   - Confirm only reordering and comments/log lines, no new logic.
5. **Commit in small units**
   - `git add modules/site.js`
   - `git commit -m "Refactor site logging/docs/method order"`
6. **Repeat for the next file**
   - Use the per-file plans below to track progress.
7. **Merge back via pull request**
   - Push the branch and open a PR for review.

This process is explicitly designed to keep changes small and reversible.

---

## 5. Per-File Logging Update Plan (Task 6)

This section lists per-module logging changes **to be made later**. No code has been altered yet.

- `modules/logger.js`
  - Confirm all levels used across the app are defined in one place and documented.
  - Ensure no stray `console.log` calls beyond the log sink itself.
- `modules/bootLogger.js`, `modules/bootLogConfig.js`
  - Confirm boot levels align with the logging spec.
  - Optionally add short comments where configuration keys are non-obvious.
- `modules/site.js` and shell components (`header.js`, `menu.js`, `main.js`, `footer.js`)
  - Verify constructors and `init`/lifecycle methods use the standard create/init/lifecycle levels.
  - Ensure passthrough logging (where present) summarizes values clearly.
- Page modules (`homePage.js`, `recipesPage.js`, `mealPlanPage.js`, `shoppingPage.js`, `toolsPage.js`)
  - Check that page initialization, afterRender hooks, and key lifecycle methods log appropriately.
  - Add missing `lifecycle` and `info` logs for major user actions if useful.
- Domain & storage modules (`mealPlan.js`, `meal.js`, `profile.js`, `shoppingList.js`, `inventory.js`, `ingredient.js`, `nutrition.js`, `recipe.js`, `recipes.js`, `localStorage.js`, `sessionStorage.js`, `storage.js`, `apiAccess.js`)
  - Use `info` to log important state changes (e.g., current meal plan updates, inventory loads/saves, cache hits/misses).
  - Ensure any `Logger.instrumentClass` usage has consistent method-level logging.

These are future changes; this plan is a checklist for when we start refactoring.

---

## 6. Per-File Documentation Update Plan (Task 7)

- `modules/site.js`
  - Add a concise class summary comment for `Site` and any inner helper classes (if present).
  - Add one-line purpose comments for `init`, `loadPage`, and any other key public methods.
- Shell components (`header.js`, `menu.js`, `main.js`, `footer.js`)
  - Ensure each class has a one-line summary.
  - Comment complex event-binding methods.
- Page modules (`homePage.js`, `recipesPage.js`, `mealPlanPage.js`, `shoppingPage.js`, `toolsPage.js`)
  - Add one-line class summaries for each page class.
  - Comment complex logic (e.g., filtering recipes, building overlays, constructing meal plans, managing shopping lists).
  - Document at least one typical usage pattern in this document (e.g., how a page is constructed and invoked by `Site`).
- Logging & boot modules (`logger.js`, `bootLogger.js`, `bootLogConfig.js`)
  - Add explicit explanations of configuration fields and how they interact with `siteConfig.debug`.
  - Include a short “how to enable logging for a specific class” example.
- Storage & domain modules (`localStorage.js`, `sessionStorage.js`, `storage.js`, `shoppingList.js`, `inventory.js`, `ingredient.js`, `mealPlan.js`, `profile.js`, `nutrition.js`, `recipe.js`, `recipes.js`, `apiAccess.js`)
  - Ensure each module has a clear top-of-file purpose.
  - Add comments near shared singletons/collections to clarify their scope.

Again, these are documented **targets**; code will be updated later according to this list.

---

## 7. Per-File Method Reordering Plan (Task 8)

- `modules/logger.js`
  - Group instance methods together (construction/config/deferred/logging core), then static helpers, then instrumentation utilities; alphabetize within each group without altering behavior.
- `modules/bootLogger.js`
  - Ensure helper methods (e.g., `getModuleKeys`, `formatModuleName`) are grouped logically below public logging methods, following the type groups.
- `modules/site.js`
  - Order: static descriptors → constructor → getters (`bodyElement`, `elements`) → lifecycle (`init`, `loadPage`, etc.) → helpers (DOM creation, attribute application).
- Shell components and page classes
  - Order: `static descriptors` → constructor → `log` wrapper → `init`/`afterRender` → public methods → internal helpers, alphabetized per group.
- Domain & storage classes
  - Apply the same grouping and alphabetization, ensuring no behavior changes.

This plan will be used as a reference when actually reordering methods in each class.

---

## 8. Recovery and Rollback Steps (Task 9)

**Goals**

- Always have a simple, reliable way to undo changes to any file.

**Standard Recovery Methods**

1. **Restore a single file to the last committed state**
   - Example: restore `modules/site.js`:
     - `git restore modules/site.js`
2. **Restore a file from a specific commit**
   - Find the commit SHA (via `git log`), then:
   - `git checkout <commit-sha> -- modules/site.js`
3. **Undo uncommitted changes across the repo**
   - `git restore .`
4. **Verify correctness after recovery**
   - Always run: `./RunDevWorkflow.ps1`
   - Confirm there are no errors and the app still behaves correctly.
5. **Avoid rebuilding from scratch**
   - When a file is "destroyed" or badly edited, prefer `git restore` or `git checkout <commit> -- <file>` instead of manually retyping.

**When Working on a Branch**

- If a branch gets into a bad state, you can:
  - Reset to main: `git reset --hard origin/main`
  - Or delete and recreate the branch if no important commits are on it.

With this recovery strategy and the workflow above, we can safely apply logging, documentation, and method order changes later while always having a clear path back.
