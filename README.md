# Football Dashboard

A Next.js dashboard showing daily football (soccer) matches with local (Amman) times, league info, and Jordan broadcast channels.

## Features

- View matches for today, yesterday, or tomorrow
- Live match indicators (in-play, halftime, etc.)
- Times displayed in Amman (Asia/Amman)
- Team logos (from API-Football)
- League flags and names
- Broadcast information: main channel and Jordan-specific channel (mapped)
- Responsive grid layout (mobile, tablet, desktop)
- Dark mode support (via Tailwind)

## Supported Leagues

- Premier League (England)
- La Liga (Spain)
- Serie A (Italy)
- Bundesliga (Germany)
- Ligue 1 (France)
- UEFA Champions League
- UEFA Europa League

More can be added by editing `src/lib/leagues.ts`.

## Setup

1. **Get an API key** from [api-football.com](https://www.api-football.com/) (free tier: 100 requests/day).
2. Copy `.env.local.example` to `.env.local` and fill in your key:

```bash
cp .env.local.example .env.local
# Then edit .env.local and set NEXT_PUBLIC_API_FOOTBALL_KEY=your_key
```

3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for production

```bash
npm run build
npm start
```

## Notes

- The app uses the free API-Football tier. Be mindful of the 100 requests/day limit. Caching can be added later.
- If no API key is set, the app shows mock data for demonstration.
- Times are converted from UTC to Amman using `date-fns-tz`.
- Broadcast channels for Jordan are mapped per league in `src/lib/leagues.ts`. Feel free to adjust.

## Future improvements

- Add caching (React Query / SWR) to reduce API calls
- Show live score updates (polling)
- Allow filtering by league
- Show standings, team stats
- Use Next.js Image component for optimized logos
- Add international competitions (World Cup, Euros, etc.)

## License

MIT
