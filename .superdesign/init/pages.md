# Page Dependency Trees

## `/` — Financial Presentation Generator

Entry: `src/main.tsx`

Dependencies:

- `src/main.tsx`
  - `src/index.css`
  - `src/App.tsx`
    - `src/App.css`
    - `src/template.ts`
    - `lucide-react` (external; Activity, FileText, Plus, Trash2, Download)

Actual desktop render branch: `src/App.tsx` renders a full-height shell with a top header and a two-column main workspace. The left column contains one long form; the right column is a sticky summary/export card. There are no responsive render branches in React and no media queries in the current CSS.

Design-context notes:

- `src/App.tsx`, `src/App.css`, and `src/index.css` contain the complete visible UI.
- `src/template.ts` contains the downloaded presentation generator and types. It affects behavior and generated output but is not needed to reproduce the frontend layout.
