# AJ Slides — Design System

## Product context

AJ Slides is an internal financial-operations tool that turns contract and customer data into an executive HTML presentation. The primary user is an analyst or consultant who needs to work quickly, avoid data-entry mistakes, understand the financial impact while typing, and export a polished client-facing presentation.

The product currently has one route: `/`. Its workflow is:

1. Choose the operating company.
2. Choose the contract type: vehicle, property, or loan.
3. Enter customer and contract identification.
4. Enter financed asset and installment values.
5. Add one or more improper fees.
6. Enter refund and follow-up status data.
7. Review calculated outcomes and export the presentation.

## Jobs to be done

- Complete a dense financial form without losing orientation.
- Distinguish required information from optional enrichment.
- See calculated savings and reimbursement values immediately.
- Add, edit, and remove improper-fee rows safely.
- Confirm company and contract context at a glance.
- Download the final HTML presentation with confidence.

## Visual direction

Create a premium dark financial workspace, not a marketing landing page. Keep the current AJ Slides identity recognizable while making it calmer, more structured, and more trustworthy.

- Overall mood: precise, premium, focused, professional.
- Use subtle glass-like layering only for hierarchy; do not reduce input readability.
- Use restrained radial glows and a very subtle grid/dot texture in the page background.
- Avoid decorative gradients on text, neon cyberpunk effects, oversized landing-page typography, and gratuitous animation.
- Keep all application content in Portuguese.

## Color tokens

- Page background: `#090A0F`
- Elevated shell: `#10121A`
- Primary surface: `#151824`
- Secondary surface / inputs: `#0D0F16`
- Hover surface: `#1B1F2D`
- Primary border: `rgba(255,255,255,0.10)`
- Strong border: `rgba(255,255,255,0.18)`
- Primary text: `#F4F5F8`
- Secondary text: `#A2A6B3`
- Muted text: `#6F7482`
- AJ Slides primary: `#8B5CF6`
- AJ Slides primary hover: `#7C3AED`
- Positive / confirmed: `#22C55E`
- Warning: `#F59E0B`
- Destructive / critical total: `#FB4D78`
- Focus ring: `rgba(139,92,246,0.28)`

Company identity accents are contextual, not global theme replacements:

- Ativa Soluções: violet `#8B5CF6`
- Alpha Equilíbrio: blue `#3B82F6`
- Atitude Soluções: slate `#64748B`

## Typography

- Body and controls: `Inter`, 400–700.
- Headings and product wordmark: `Montserrat`, 700–900.
- Never introduce serif, decorative, or monospaced display fonts.
- Page title: 28–32px, tight line-height.
- Section title: 16–18px.
- Body/control text: 14–16px.
- Labels and metadata: 12–13px, semibold; uppercase only for short eyebrow labels.
- Financial totals: 24–34px with tabular numbers.

## Layout

### Desktop

- Max content width: 1520px.
- Persistent top bar, 72px high.
- Main workspace: 12-column grid.
- Form workflow: 8 columns.
- Review/export rail: 4 columns, sticky below the top bar.
- Main page padding: 28–40px depending on viewport.
- Use a visible progress/section navigator so the long workflow is scannable.

### Tablet

- Main workspace stacks with review card below the active form section.
- Company and contract selectors remain multi-column where space allows.

### Mobile

- Single column, 16px page padding.
- Header compacts while retaining product identity.
- All two-column form grids collapse to one column.
- Repeating fee fields stack vertically.
- Export action becomes a full-width sticky footer action only when it does not obscure form content.

## Surfaces and spacing

- Base spacing unit: 4px.
- Common gaps: 8, 12, 16, 20, 24, 32px.
- Main card padding: 24–28px desktop, 18–20px mobile.
- Main card radius: 20px.
- Inputs and buttons: 12px radius.
- Selector cards: 14–16px radius.
- Use thin borders and restrained shadows rather than heavy black drop shadows.
- Primary card shadow: `0 18px 60px rgba(0,0,0,0.30)`.
- Glass overlays, if used: `rgba(255,255,255,0.035)` with `backdrop-filter: blur(16px)` and an opaque fallback.

## Components

### Header

- Left: Activity icon and AJ SLIDES wordmark.
- Right: compact descriptor or status, never a marketing navigation bar.
- Use the real text identity; no invented logo, initials badge, or emoji logo.

### Company selector

- Three equal choice cards with name, short identifier, and clear selected indicator.
- Selected state uses the company accent on border, icon, and subtle surface tint.
- Unselected states remain neutral and readable.

### Contract-type selector

- Three icon-led choice cards: Veículo, Imóvel, Empréstimo.
- Use Lucide-style line icons, never emoji.
- Selection is expressed with border, background tint, and a check marker; do not rely on color alone.

### Workflow sections

- Group related fields into numbered cards: Cliente e contrato; Bem e valores; Cobranças indevidas; Estorno e acompanhamento.
- Each card has a concise title, one-line helper text, and optional completion indicator.
- Optional fields are labeled consistently instead of relying only on placeholder text.

### Inputs

- Minimum 44px height.
- Visible label above every control.
- Placeholder contrast must remain secondary but readable.
- Focus state: violet border plus 3px translucent ring.
- Currency fields should visually prefix `R$` where practical.
- Errors reserve layout space and use concise Portuguese guidance.

### Fee rows

- Present each fee as a contained row/card with name, value, description, and destructive remove action.
- On small screens, stack fields and keep remove action in the row header.
- “Adicionar nova tarifa” is a dashed secondary action.

### Summary rail

- Start with contract context chips: selected company and type.
- Use a strong “Impacto estimado” block for the most important outcomes.
- Group supporting calculations below with aligned labels and tabular values.
- Highlight total reimbursement with pink/red only; keep reductions and savings violet/green.
- Place the primary export action at the bottom with a short readiness message.

### Buttons

- Primary: violet fill, white text, 48–52px height.
- Secondary: neutral translucent surface and strong border.
- Tertiary: text/icon action with visible hover state.
- Destructive: pink/red icon and tint; never use the primary violet style.

## Motion

- Use `cubic-bezier(0.4, 0, 0.2, 1)`.
- Control hover/focus transitions: 160–200ms.
- Card entrance/section changes: maximum 240ms.
- Respect `prefers-reduced-motion`.
- No floating decorations, infinite motion, parallax, or distracting pulses.

## Accessibility and behavior

- Meet WCAG AA contrast for all text and controls.
- Provide visible keyboard focus for every interactive element.
- Use semantic buttons for selectors and actions.
- Use `aria-pressed` for mutually exclusive selector cards.
- Do not communicate selection, validation, or totals through color alone.
- Maintain the existing calculation and HTML-download behavior exactly.
- Maintain support for all three companies and all three contract types.

## Redesign priorities

1. Improve orientation within the long form.
2. Make company and contract selection unmistakable.
3. Reduce visual density through grouped cards and helper copy.
4. Elevate the summary from a list into a decision-ready financial snapshot.
5. Add robust responsive behavior missing from the current stylesheet.
6. Remove inline styling and use reusable component/state classes during implementation.
