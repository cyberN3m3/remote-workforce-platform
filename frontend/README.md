# Frontend: remote workforce dashboard

The React + TypeScript dashboard for the [Zero-Trust Remote Workforce Platform](../README.md). It's deployed on Vercel: [remote-workforce-platform.vercel.app](https://remote-workforce-platform.vercel.app/)

It shows a stats grid (active users, security score, uptime), a 24-hour activity chart, a security event log you can filter by severity, a monthly cost card and a system status panel. For now all of it runs on generated sample data that updates every few seconds (`src/hooks/index.ts`). Connecting it to the API behind the ALB is the next step.

## Stack

- React 18.2 and TypeScript 5.3 in strict mode, built with Vite
- Tailwind CSS 3.4 with a dark theme and frosted-glass cards
- Recharts for the activity chart, Framer Motion for animations, Lucide for icons
- Inter for text, JetBrains Mono for numbers

## Run it

You need Node 18 or later.

```bash
npm install
npm run dev          # dev server on http://localhost:3000
npm run build        # type-check and production build
npm run preview      # serve the production build
npm run lint         # ESLint
npm run format       # Prettier
npm run type-check   # TypeScript only
```

## Layout

```
src/
├── components/   # StatCard, ActivityChart, SecurityEventRow, SystemStatus, CostCard, QuickAccessButton
├── hooks/        # useRealtimeData (sample data), useCurrentTime
├── types/
├── utils/
├── App.tsx
├── main.tsx
└── index.css     # Tailwind and global styles
```

## Deploy

Vercel builds and deploys on every push. To deploy by hand:

```bash
npm i -g vercel
vercel --prod
```

## Connecting to the backend

When the API is wired in, these go in a `.env` file:

```env
VITE_API_BASE_URL=https://<alb-dns-name>
VITE_COGNITO_USER_POOL_ID=<user-pool-id>
VITE_COGNITO_CLIENT_ID=<app-client-id>
VITE_AWS_REGION=us-east-1
```

## Next

- Replace the sample data with calls to the API and Cognito sign-in
- Unit tests and a Playwright end-to-end test

## License

MIT
