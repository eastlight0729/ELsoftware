---
trigger: manual
---

### Phase 1: Preparation & Analysis

Before touching the code, define the boundaries of the feature.

* **Identify Entry Points:** Locate where the feature is imported and used in the main application (e.g., routes, navigation).
* **Audit Dependencies:** List all external libraries, contexts, and shared components the feature relies on.
* **Isolate Domain Logic:** Determine which functions are specific to this feature versus generic utilities.

---

### Phase 2: Folder Structure (Colocation)

Move all related files into a single directory. This makes deleting or updating the feature easier in the future.

* **Create Feature Directory:** Create a folder at `src/features/feature-name`.
* **Move Components:** Move the main page and sub-components into this folder.
* **Create Public API:** Add an `index.ts` (barrel file) in the feature root. Export *only* the components needed by the rest of the app. Keep internal sub-components private.
* **Group by Type:** Inside the feature folder, organize files:
* `components/`
* `hooks/`
* `types/`
* `api/`



---

### Phase 3: Logic Extraction (Custom Hooks)

Remove complex logic from your TSX/JSX files. The component should only describe *how* things look, not *how* they work.

* **Extract `useEffect` & `useState`:** Move side effects and local state into a custom hook named `useFeatureName` or specific hooks like `useFeatureForm`.
* **Isolate API Calls:** Move `fetch`, Axios, or React Query logic into a dedicated hook (e.g., `useFetchFeatureData`).
* **Return Only What is Needed:** Ensure the hook returns strictly the data and handlers the UI requires.
* **Remove Inline Functions:** Define handlers inside the hook, not inline in the render method, to prevent unnecessary re-renders.

---

### Phase 4: Component Decomposition

Break down large components (monoliths) into smaller, single-responsibility units.

* **Separate Container vs. Presentational:**
* **Container:** Holds the logic (hooks) and passes data down.
* **Presentational:** Receives data via props and renders UI. Has no dependency on the store or API.


* **Extract Shared UI:** If a button or input is generic, move it to `src/components/ui` (shared folder), not the feature folder.
* **Fix Prop Drilling:** If you pass props down more than 3 levels, use Component Composition (passing children) or a localized React Context.

---

### Phase 5: Types & Utilities

Clean up the codebase by centralizing type definitions and helper functions.

* **Centralize Types:** Move interfaces and types to `types.ts` within the feature folder.
* **Strict Imports:** Ensure the feature does not import "sibling" features directly. If Feature A needs Feature B, they should communicate via a shared parent or global state.
* **Hardcoded Values:** Move magic numbers, strings, or configuration objects to a `constants.ts` file.

---

### Phase 6: Final Review

* **Check Circular Dependencies:** Ensure files do not reference each other in a loop.
* **Verify Bundle Size:** Check if the feature imports heavy libraries that are not lazy-loaded.
* **Run Linter/Prettier:** Ensure code style is consistent.

**Tip for Mac Users:** Use `Cmd + .` in VS Code to access the "Quick Fix" menu for fast extraction of components or moving code to new files.

Would you like a code example showing the "Before" vs. "After" of a component split?