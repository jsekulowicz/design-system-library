# Project Context

Project: Design System Library
Tech Stack: Web Components, Lit, Storybook, TypeScript, Playwright, axe-core. Package manager: pnpm.

# Code style guide:

1. Avoid exceeding 150 lines of code in one file, not at all cost, but make effort to avoid it.
2. Avoid unnecessary comments - function and variable names should precisely explain what the code is doing.
3. Use function keyword for function definitions.
4. Prefer braces and new line syntax for if statements, e.g.:

```
if (condition) {
  // then
}
```

5. Try to keep functions below 20 lines of code. It is not a strict requirement, as sometimes functions contain structure definitions that take space, but in general, keep functions short and understandable. If some operation requires more than 20 lines of code, prefer breaking it down into a few functions.
6. Ensure that there are no typescript or lint errors before committing the change. If there are, fix them and check again.

# Git flow

As you add incremental changes, stash the changes and commit them with a gitflow style commit descriptive, but not too long message, e.g. 'feat: add a multi-step form organism'.
