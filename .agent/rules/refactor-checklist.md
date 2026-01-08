---
trigger: manual
---

Here is the updated refactoring checklist for **TypeScript, React, and Tailwind CSS 4**, now including a specific section for comment refactoring.

### Refactoring Checklist

#### 1. Preparation

* [ ] **Isolate State:** Ensure the file is not currently being modified by others.
* [ ] **Verify Current Behavior:** Run the app and visually confirm the component's functionality.
* [ ] **Snapshot Test:** Run or create a snapshot test to catch UI regressions.

#### 2. General Cleanup (Dead Code & Logic)

* [ ] **Unused Imports:** Remove unused `import` statements (Mac VS Code: `Shift + Option + O`).
* [ ] **Dead Variables:** Delete variables, functions, or commented-out code blocks.
* [ ] **Console Logs:** Remove `console.log` or `debugger` statements.
* [ ] **Magic Values:** Extract hardcoded strings or numbers into named constants.

#### 3. Comments & Documentation

* [ ] **Remove Redundant Comments:** Delete comments that just repeat what the code says (e.g., remove `// Increment count` above `setCount(c => c + 1)`).
* [ ] **"Why" vs. "What":** Ensure remaining comments explain *why* something is done (business logic, workarounds), not *what* the syntax is doing.
* [ ] **Update Outdated Comments:** Verify that all comments actually match the current code logic. Delete or update them if they are wrong.
* [ ] **Use TSDoc:** Convert standard comments (`//`) to TSDoc (`/** ... */`) for Interface and Prop definitions. This allows the description to appear in VS Code hover tooltips.
* [ ] **Standardize TODOs:** Search for `TODO` or `FIXME`. Resolve them if quick, or ensure they have a ticket number attached for later tracking.

#### 4. TypeScript Specifics

* [ ] **No Explicit `any`:** Replace `any` with specific interfaces or types.
* [ ] **Prop Interfaces:** Ensure all components have explicitly defined Prop interfaces.
* [ ] **Optional Chaining:** Use `?.` for nested properties (e.g., `user?.profile?.name`).
* [ ] **Nullish Coalescing:** Use `??` for default values instead of `||`.

#### 5. React Best Practices

* [ ] **Component Size:** If the component is over 150-200 lines, extract logical parts into sub-components.
* [ ] **Destructuring:** Destructure props in the function signature (`{ name }: Props`) rather than using `props.name`.
* [ ] **Hook Dependencies:** Verify `useEffect` dependency arrays are exhaustive.
* [ ] **Render Logic:** Extract complex ternaries in JSX into helper variables (e.g., `const shouldShowAlert = isError && !isLoading;`).

#### 6. Tailwind CSS 4 & Styling

* [ ] **Class Ordering:** Order utility classes consistently (Layout → Box Model → Visuals).
* [ ] **Remove Arbitrary Values:** Replace `w-[350px]` with theme values like `w-96` where possible.
* [ ] **Simplify Conditionals:** Avoid complex template literals for classes; use standard strings or a utility like `clsx` only if necessary.