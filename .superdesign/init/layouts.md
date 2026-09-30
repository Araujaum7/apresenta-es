# Shared Layouts

The app has a single route and no standalone shared layout component. The application shell is embedded directly in `src/App.tsx`:

- `.app-container`: full-height root wrapper
- `.header`: brand bar with AJ SLIDES identity and product descriptor
- `.main-content`: two-column workspace
- `.form-section`: primary data-entry surface
- `.preview-section`: sticky financial summary and export action

Because these are part of the page component rather than a reusable layout file, their full implementation is captured through `src/App.tsx` in the page dependency tree and supplied directly as design context.
