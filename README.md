# Stargaze

A tiny space-themed memory match game. Flip pairs, match all eight constellations, beat your best time.

Built with Next.js 15 + Tailwind. Single page. Zero external dependencies beyond the framework. Deployable to Vercel in one push.

## Run locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy

Push to GitHub, then either:
- Import the repo at https://vercel.com/new, or
- Run `vercel` from the project root (requires Vercel CLI).

## Stack

- Next.js 15 App Router (React 19)
- Tailwind CSS 3.4
- TypeScript 5
- No database, no external services. Records live in `localStorage`.

## Notes

This repo is also used as the smoke-test target for installing `@dotworld/shadow-canary-*`. It deliberately has no `middleware.ts`, no `app/admin/**`, and no `app/api/**` so the canary templates drop in without collisions.

## License

MIT
