# PULSE — Fitness Tracker

**Track. Measure. Evolve.**

A portfolio-grade React fitness tracking web app built with Vite, showcasing advanced React patterns, custom hooks, data visualizations, and a polished dark-themed UI.

---

## Architecture

### Tech Stack
- **React 18** with automatic JSX transform
- **Vite 5** for build tooling
- **React Router v6** — client-side SPA routing
- **Recharts** — responsive charts (LineChart, AreaChart, BarChart)
- **Lucide React** — icon system (zero emojis throughout)
- **localStorage** — all data persistence (no backend)

### Project Structure

```
src/
  components/
    layout/     Sidebar, TopBar, BottomNav
    ui/         KpiCard, GaugeBar, MetricBadge, Toast, Modal, Spinner
    charts/     TrendLine, BodyFatArea, MuscleBar
  pages/        Dashboard, LogEntry, BMICalc, Progress, Settings
  hooks/        useLocalStorage, useBodyMetrics, useBMI, useBodyFat, useCountUp
  utils/        calculations.js (all formulas isolated)
  context/      AppContext (global state provider)
```

### Data Flow
1. `AppContext` wraps the entire app, providing profile, unit preferences, and body metrics.
2. `useBodyMetrics` exposes CRUD operations (`addEntry`, `deleteEntry`, etc.) backed by `useLocalStorage`.
3. Each page reads from context via `useApp()` and dispatches mutations as needed.
4. No backend — all data persists in the browser's localStorage under keys `pulse_entries`, `pulse_profile`, and `pulse_unit`.

---

## Formula Sources

### BMI
**Formula:** `weight(kg) / height(m)²`

### Navy Method Body Fat %
**Source:** Hodgdon & Beckett (1984), U.S. Navy

**Male:**
```
BF% = 495 / (1.0324 - 0.19077 × log₁₀(waist − neck) + 0.15456 × log₁₀(height)) − 450
```

**Female:**
```
BF% = 495 / (1.29579 - 0.35004 × log₁₀(waist + hip − neck) + 0.22100 × log₁₀(height)) − 450
```

All measurements in centimeters. Minimum result is clamped to 3%, maximum to 70%.

### Muscle Mass Estimate
```
LBM = weight × (1 − BF%/100)
Muscle ≈ LBM × 0.45
```
Based on the approximation that ~45% of lean body mass is skeletal muscle.

### Ideal Weight Formulas

| Formula | Male | Female |
|---------|------|--------|
| **Devine** (1974) | 50 + 2.3 × (in − 60) | 45.5 + 2.3 × (in − 60) |
| **Robinson** (1983) | 52 + 1.9 × (in − 60) | 49 + 1.7 × (in − 60) |
| **Miller** (1985) | 56.2 + 1.41 × (in − 60) | 53.1 + 1.36 × (in − 60) |

Where `in` = height in inches.

---

## Custom Hooks API

### `useLocalStorage(key, initialValue)`
Generic localStorage-backed state hook.
```js
const [value, setValue] = useLocalStorage('key', default)
```

### `useBodyMetrics()`
CRUD interface for log entries. Returns:
- `entries` — array sorted by date desc
- `addEntry(entry)` — adds with auto-ID and timestamp
- `deleteEntry(id)` — removes by ID
- `updateEntry(id, updates)` — partial update
- `getLatest()` — most recent entry
- `getEntriesByDateRange(start, end)` — filtered range

### `useBMI(weightKg, heightCm)`
Returns `{ bmi: number | null, category: { label, color } | null }`.

### `useBodyFat(measurements, sex)`
Computes Navy BF% from `{ waist, neck, hip, height }`. Returns percentage or `null`.

### `useCountUp(target, duration = 800, enabled = true)`
Animated counter. Returns a float that animates from 0 to `target` over `duration` ms using cubic ease-out.

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#0D0D0F`, `#141416` |
| Cards | `#1A1A1E` |
| Accent | `#E8302A` |
| White | `#F0F0F0` |
| Display Font | Barlow Condensed |
| Body Font | DM Sans |

Responsive breakpoints at 1024px, 768px, and 480px. Sidebar collapses to a bottom navigation bar on mobile.

---

## Getting Started

```bash
cd pulse
npm install
npm run dev     # → http://localhost:3000
npm run build   # → dist/
```

---

## License

MIT
