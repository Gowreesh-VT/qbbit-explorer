# QBBit Explorer

Interactive BB84 quantum key distribution simulator with 3D photon visualization, analytics, and theory walkthroughs.

## What This Project Includes

- 3D BB84 simulation flow (Alice -> Bob, optional Eve interception)
- Real-time photon and basis behavior visualization
- Key generation metrics and error-rate analytics
- Step-by-step learning mode for protocol understanding
- Theory page explaining BB84 concepts and protocol steps

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS + shadcn/ui (Radix UI)
- React Router (`HashRouter`)
- React Three Fiber / Drei / Three.js for 3D rendering

## Project Routes

- `/#/` -> Home page
- `/#/theory` -> BB84 theory and protocol explanation
- `/#/simulation` -> Interactive simulator

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+ (or compatible package manager)

## Local Setup

```bash
git clone https://github.com/Gowreesh-VT/qbbit-explorer.git
cd qbbit-explorer
npm install
```

## Run and Build

### Development server

```bash
npm run dev
```

By default, Vite is configured to run on:

- `http://localhost:8080`

### Production build

```bash
npm run build
```

### Preview production build locally

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Available npm Scripts

- `npm run dev` - start Vite development server
- `npm run build` - build production bundle into `dist/`
- `npm run build:dev` - build using development mode
- `npm run preview` - preview `dist/` locally
- `npm run lint` - run ESLint
- `npm run predeploy` - build before deployment
- `npm run deploy` - deploy `dist/` to GitHub Pages via `gh-pages`

## Deployment Notes

This repository includes two deployment-oriented configurations:

- GitHub Pages deployment script via `gh-pages` (`npm run deploy`)
- Firebase Hosting config in `firebase.json` (serves from `dist/` with SPA rewrite)

If deploying to Firebase, build first and deploy with Firebase CLI (for example: `firebase deploy`).

## Key Source Structure

```text
src/
	App.tsx                   # Router and app-level providers
	contexts/SimulationContext.tsx
	hooks/useBB84Simulation.ts
	pages/
		Home.tsx
		Theory.tsx
		Simulation.tsx
	components/simulation/    # 3D scene + analytics + step mode UI
```

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run `npm run lint` and `npm run build`.
5. Open a pull request.

## License

No license file is currently present in this repository.


