# Theme

## Part 1 — Compact token summary

### Current palette

- `--bg-dark`: `#0a0b10` — page and input background
- `--bg-card`: `#161824` — header, form panel, summary panel
- `--accent-main`: `#7c3aed` — primary purple
- `--accent-main-hover`: `#6d28d9`
- `--accent-red`: `#ff3366` — destructive and total-refund emphasis
- `--accent-red-hover`: `#e11d48`
- `--text-light`: `#f0f0f5`
- `--text-dim`: `#8a8d9e`
- `--border-color`: `rgba(255, 255, 255, 0.1)`
- Company accents are currently inline in `src/App.tsx`: Ativa `#7c3aed`, Alpha `#2563eb`, Atitude `#4b5563`.

### Typography

- Body/UI: Inter, weights 300–800
- Headings: Montserrat, weights 700 and 900
- Typical UI sizes: 14px labels, 15px body/inputs, 18px actions/totals, 20px section titles, 24px brand

### Spacing and layout

- Page padding: 40px desktop
- Main column gap: 40px
- Form grid gap: 20px
- Card padding: 32px
- Input padding: 12px 16px
- Radius: 8px controls, 12px summary/actions, 16px main surfaces
- Shadow: form surface `0 10px 30px rgba(0,0,0,0.5)`
- Content max width: 1600px
- Breakpoints: none currently defined

## Part 2 — Raw source dumps

### `src/index.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Montserrat:wght@700;900&display=swap');

:root {
  --bg-dark: #0a0b10;
  --bg-card: #161824;
  --accent-main: #7c3aed;
  --accent-main-hover: #6d28d9;
  --accent-red: #ff3366;
  --accent-red-hover: #e11d48;
  --text-light: #f0f0f5;
  --text-dim: #8a8d9e;
  --border-color: rgba(255, 255, 255, 0.1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-dark);
  color: var(--text-light);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Montserrat', sans-serif;
}

button {
  cursor: pointer;
  font-family: inherit;
}

input, select, textarea {
  font-family: inherit;
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--bg-dark); }
::-webkit-scrollbar-thumb { background: var(--bg-card); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-dim); }
```

### `src/App.css`

```css
.app-container { display: flex; flex-direction: column; min-height: 100vh; }
.header { background: var(--bg-card); padding: 20px 40px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; }
.header-title { display: flex; align-items: center; gap: 12px; color: var(--text-light); font-size: 24px; }
.header-title span { color: var(--accent-main); }
.main-content { display: flex; flex: 1; padding: 40px; gap: 40px; max-width: 1600px; margin: 0 auto; width: 100%; }
.form-section { flex: 2; background: var(--bg-card); border-radius: 16px; padding: 32px; border: 1px solid var(--border-color); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.preview-section { flex: 1; background: var(--bg-card); border-radius: 16px; padding: 32px; border: 1px solid var(--border-color); display: flex; flex-direction: column; position: sticky; top: 40px; height: fit-content; }
.section-title { font-size: 20px; margin-bottom: 24px; color: var(--accent-main); display: flex; align-items: center; gap: 8px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group.full-width { grid-column: 1 / -1; }
label { font-size: 14px; color: var(--text-dim); font-weight: 500; }
input, select { background: var(--bg-dark); border: 1px solid var(--border-color); color: var(--text-light); padding: 12px 16px; border-radius: 8px; font-size: 15px; transition: all 0.2s; }
input:focus, select:focus { outline: none; border-color: var(--accent-main); box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2); }
.fee-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 16px; }
.fee-item { display: flex; gap: 12px; align-items: center; background: var(--bg-dark); padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); }
.fee-item input { flex: 1; border: none; background: rgba(255,255,255,0.05); }
.btn-icon { background: transparent; border: none; color: var(--accent-red); padding: 8px; border-radius: 8px; transition: background 0.2s; display: flex; align-items: center; justify-content: center; }
.btn-icon:hover { background: rgba(255, 51, 102, 0.1); }
.btn-add { display: flex; align-items: center; gap: 8px; background: transparent; border: 1px dashed var(--accent-main); color: var(--accent-main); padding: 12px; width: 100%; border-radius: 8px; justify-content: center; font-weight: 600; transition: all 0.2s; margin-bottom: 32px; }
.btn-add:hover { background: rgba(124, 58, 237, 0.1); }
.btn-primary { display: flex; align-items: center; justify-content: center; gap: 12px; background: var(--accent-main); color: white; border: none; padding: 16px; border-radius: 12px; font-size: 18px; font-weight: 700; width: 100%; transition: background 0.2s; margin-top: auto; }
.btn-primary:hover { background: var(--accent-main-hover); }
.summary-card { background: var(--bg-dark); border: 1px solid var(--border-color); padding: 20px; border-radius: 12px; margin-bottom: 24px; }
.summary-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 15px; }
.summary-row.total { border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 12px; font-weight: 700; font-size: 18px; color: var(--accent-main); margin-bottom: 0; }
.total-red { color: var(--accent-red) !important; }
```
