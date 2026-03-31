# eagle-size-simulator — Copilot Instructions

## Project Overview

An interactive web simulator that models what happens when you scale an eagle to different sizes. Uses real physics (square-cube law, aerodynamic scaling, wing loading) to calculate structural viability, flight capability, failure modes, and fun facts as the user adjusts the eagle's size multiplier.

## Tech Stack

- **Frontend**: React 19 / Vite 7 / TypeScript 5.9
- **Backend**: N/A (static frontend only)
- **Data**: None (all calculations are client-side)
- **Styling**: Vanilla CSS
- **Testing**: Vitest with React Testing Library and jsdom
- **Deployment**: Static site at eagle.sandford.systems via nginx
- **CI/CD**: GitHub Actions on self-hosted runner

## Quick Commands

```bash
# Install dependencies
npm ci

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint
npm run lint

# Type check (part of build)
tsc -b

# Preview production build
npm run preview
```

## Project Structure

```
eagle-size-simulator/
├── src/
│   ├── components/         # React UI components
│   │   ├── Controls.tsx    # Size multiplier controls
│   │   ├── EagleCanvas.tsx # Canvas-based eagle visualization
│   │   ├── FailureReport.tsx   # Failure mode display
│   │   ├── FlightEnvelope.tsx  # Flight capability envelope
│   │   ├── FunFactsPanel.tsx   # Scaled fun facts
│   │   ├── StressChart.tsx     # Stress visualization chart
│   │   └── ViabilityGauge.tsx  # Overall viability gauge
│   ├── sim/                # Physics simulation engine
│   │   ├── engine.ts       # Core simulation calculations
│   │   ├── engine.test.ts  # Simulation engine tests
│   │   ├── failureModes.ts # Failure mode definitions
│   │   ├── simDefaults.ts  # Default simulation parameters
│   │   ├── types.ts        # TypeScript type definitions
│   │   └── index.ts        # Public API barrel export
│   ├── App.tsx             # Root application component
│   ├── App.css             # Application styles
│   ├── main.tsx            # Application entry point
│   ├── index.css           # Global styles
│   └── vite-env.d.ts       # Vite type declarations
├── public/                 # Static assets
├── .github/
│   ├── workflows/          # CI/CD pipelines
│   ├── copilot-instructions.md  # This file
│   ├── agents/             # Agent definitions
│   ├── prompts/            # Prompt templates
│   ├── skills/             # Agent skills
│   └── ISSUE_TEMPLATE/     # Issue templates
├── package.json
├── vite.config.ts
├── tsconfig.json
└── eslint.config.js
```

## Coding Conventions

### General
- Use TypeScript strict mode — no `any` types
- Prefer named exports over default exports
- Keep functions under 50 lines — extract helpers if longer
- Error messages must be user-friendly, not stack traces

### Naming
- Components: PascalCase (`ViabilityGauge.tsx`)
- Simulation modules: camelCase (`engine.ts`, `failureModes.ts`)
- Test files: `*.test.ts` co-located with source
- CSS classes: kebab-case

### File Organization
- One component per file
- Co-locate tests with source: `engine.ts` + `engine.test.ts`
- Simulation logic lives in `src/sim/` — keep it pure (no React imports)
- UI components live in `src/components/`

### Git
- Conventional commits: `feat|fix|docs|chore|refactor|test|ci: description`
- Branch naming: `type/issue-number-short-description` (e.g., `feat/42-dark-mode`)
- Always squash merge to `main`

## Architecture Decisions

- **Vite over CRA**: Faster HMR, smaller bundles, native ESM support
- **Simulation engine separated from UI**: `src/sim/` contains pure TypeScript functions with no React dependencies, making it independently testable
- **No state management library**: App state is simple enough for React's built-in useState/useReducer
- **Canvas for eagle visualization**: EagleCanvas component uses HTML Canvas API for rendering the eagle, enabling smooth scaling and animation
- **Flight envelope modeling**: In addition to square-cube law structural physics, includes aerodynamic calculations (wing loading, lift-to-weight ratio) specific to avian scaling

## Deployment

- **URL**: https://eagle.sandford.systems
- **Build output**: `dist/`
- **Nginx config**: /etc/nginx/sites-enabled/animal-sims
- **Cloudflare Tunnel**: Configured in ~/.cloudflared/config.yml

### Deployment Checklist
1. All tests pass: `npm test`
2. Build succeeds: `npm run build`
3. Reload nginx: `sudo nginx -t && sudo systemctl reload nginx`
4. Health check: `curl -s https://eagle.sandford.systems`

## Testing Strategy

- **Unit tests**: Vitest — `npm test`
- **Component tests**: React Testing Library — test user interactions, not implementation
- **Test location**: Co-located `*.test.ts` files in `src/sim/`
- **Coverage target**: 80% for simulation engine, growing for components

### What to Test
- All simulation engine functions (scaling calculations, failure modes, viability)
- Aerodynamic calculations (wing loading, flight envelope boundaries)
- Component rendering and user interactions
- Edge cases: zero size, extreme multipliers, boundary values

### What NOT to Test
- CSS/styling details
- Canvas rendering pixel output
- Third-party library internals
- Implementation details that may change — test behavior, not code

## Common Pitfalls

- **SI units internally**: The physics engine uses SI units (meters, kilograms, pascals) internally but displays human-friendly units — always convert at the display layer
- **Pure simulation functions**: Never import React or DOM APIs in `src/sim/` — it must stay pure for testability
- **Scaling factors compound**: When adding new physics calculations, remember that area scales with r² and volume with r³ — don't accidentally use linear scaling
- **Canvas context**: EagleCanvas requires careful cleanup of canvas context — always handle component unmount properly
- **Don't add heavy dependencies**: This is a lightweight static site — check bundle size impact before adding packages

## Related Repos

- **ant-size-simulator**: Sister project — ant scaling physics
- **elephant-size-simulator**: Sister project — elephant scaling physics
- **spider-size-simulator**: Sister project — spider scaling physics with D3.js
- **idealase.github.io**: Meta-repo with agentic SDLC docs and shared templates

## Agent-Specific Instructions

### Scope Control
- Stay within the files listed in the issue. Do not refactor unrelated code.
- If you discover a bug outside your scope, note it in the PR but don't fix it.
- Maximum diff size: 200 lines for size/S, 500 lines for size/M

### PR Format
- Title: conventional commit format (`feat: add dark mode toggle`)
- Body: reference the issue (`Closes #42`)
- Include a "Changes" section listing what was modified and why
- Include a "Testing" section showing test commands run and results

### What NOT to Do
- Do not modify CI/CD workflows unless the issue specifically asks for it
- Do not update dependencies unless the issue specifically asks for it
- Do not add new dev dependencies without explicit instruction
- Do not modify nginx configs, systemd units, or deployment scripts
- Do not read or modify `.env` files, credentials, or secrets
