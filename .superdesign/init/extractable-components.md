# Extractable Components

The current codebase contains no standalone shared layout or basic UI component files. The following patterns could be extracted during implementation, but they are currently embedded in `src/App.tsx` and therefore are not suitable for Superdesign component extraction from an existing component source.

## Future layout candidates

### AppHeader
- Source: `src/App.tsx`
- Category: layout
- Description: AJ SLIDES brand bar and product descriptor.
- Extractable props: none required.
- Hardcoded: Activity icon, AJ SLIDES wordmark, product descriptor.

### SummaryPanel
- Source: `src/App.tsx`
- Category: layout
- Description: Sticky calculated totals and export action.
- Extractable props: totalFees, paidDifferenceRefund, installmentReduction, contractReduction, totalRefund.
- Hardcoded: labels, Download icon, helper copy.

## Future basic candidates

### SectionCard
- Source: `src/App.tsx`
- Category: basic
- Description: Visually grouped form section with icon, title, and content.
- Extractable props: title, description, completionState.
- Hardcoded: spacing, border, surface styling.

### ChoiceCard
- Source: `src/App.tsx`
- Category: basic
- Description: Selectable company or contract-type option.
- Extractable props: selected, label, icon, accent.
- Hardcoded: interaction and selected-state treatment.

### FeeRow
- Source: `src/App.tsx`
- Category: basic
- Description: Repeating fee name, amount, description, and removal action.
- Extractable props: fee, onChange, onRemove.
- Hardcoded: Trash2 icon and field layout.
