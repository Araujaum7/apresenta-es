# Shared UI Components

The current application does not have a shared component directory or reusable UI primitives. All visible controls, cards, selectors, the header, and the summary panel are implemented inline in `src/App.tsx`.

## Component-library status

- UI library: none
- Icon library: `lucide-react`
- Styling: global vanilla CSS in `src/index.css` and `src/App.css`
- Recommended extraction candidates are listed in `extractable-components.md`, but none currently exists as a standalone source component.
