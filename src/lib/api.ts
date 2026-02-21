import axios from 'axios';
import { Fixture } from './types';
import { WANTED_LEAGUES } from './leagues';

const API_BASE = 'https://v3.api-football.com';
const API_KEY = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY;

const api = axios.create({
  baseURL: API_BASE,
  headers: API_KEY ? { 'x-apisports-key': API_KEY } : {},
});

/**
 * Fetch fixtures for a specific date (YYYY-MM-DD).
 * If no API key, returns mock data.
 */
export async function getFixtures(date: string): Promise<Fixture[]> {
  if (!API_KEY) {
    console.warn('NEXT_PUBLIC_API_FOOTBALL_KEY not set, using mock fixtures');
    return getMockFixtures(date);
  }

  try {
    // Build comma-separated league IDs string
    const leagueIds = WANTED_LEAGUES.map(l => l.id).join(',');
    const response = await api.get('/fixtures', {
      params: {
        date,
        league: leagueIds,
        season: new Date().getFullYear(), // current season; might need adjustment for leagues running across years
      },
    });
    // API returns { response: [...] }
    return response.data.response as Fixture[];
  } catch (error: any) {
    console.error('API fetch error:', error.message);
    // Fallback to mock data on any error (rate limit, server error, etc.)
    return getMockFixtures(date);
  }
}

/**
 * Fetch live fixtures (currently in-play, halftime, etc.)
 */
export async function getLiveFixtures(): Promise<Fixture[]> {
  if (!API_KEY) {
    return [];
  }
  try {
    const leagueIds = WANTED_LEAGUES.map(l => l.id).join(',');
    const response = await api.get('/fixtures/live', {
      params: {
        league: leagueIds,
        season: new Date().getFullYear(),
      },
    });
    return response.data.response as Fixture[];
  } catch (error: any) {
    console.error('Live fixtures error:', error.message);
    return [];
  }
}

/**
 * Mock fixtures for development/demo without API key.
 * Provides a few sample matches across wanted leagues for the given date.
 */
function getMockFixtures(date: string): Fixture[] {
  // Generate deterministic mock data based on date string
  const seed = date.split('-').map(Number).reduce((a, b) => a + b, 0);
  const mockLeagues = WANTED_LEAGUES.slice(0, 4); // pick 4 leagues for mock
  const mockTeams = [
    { name: 'Manchester United', logo: 'https://media-3.api-sports.com/teams/66.png' },
    { name: 'Liverpool', logo: 'https://media-3.api-sports.com/teams/57.png' },
    { name: 'Real Madrid', logo: 'https://media-3.api-sports.com/teams/541.png' },
    { name: 'Barcelona', logo: 'https://media-3.api-sports.com/teams/529.png' },
    { name: 'Juventus', logo: 'https://media-3.api-sports.com/teams/109.png' },
    { name: 'AC Milan', logo: 'https://media-3.api-sports.com/teams/98.png' },
    { name: 'Bayern Munich', logo: 'https://media-3.api-sports.com/teams/5.png' },
    { name: 'Dortmund', logo: 'https://media-3.api-sports.com/teams/4.png' },
  ];

  // Create some fixtures with varying status based on date
  const fixtures: Fixture[] = [];
  mockLeagues.forEach((league, idx) => {
    const home = mockTeams[(seed + idx * 2) % mockTeams.length];
    const away = mockTeams[(seed + idx * 2 + 1) % mockTeams.length];

    // Determine status: if date is today, mix of upcoming and live; if past, finished; if future, upcoming.
    const fixtureDate = new Date(date + 'T15:00:00Z'); // arbitrary afternoon UTC
    const now = new Date();
    const isToday = date === now.toISOString().split('T')[0];
    let statusShort: string = 'NS';
    let minute: number | undefined;
    const elapsed = Math.floor(Math.random() * 90) + 1;

    if (date < now.toISOString().split('T')[0]) {
      statusShort = 'FT';
    } else if (isToday) {
      // mix: some finished, some live, some upcoming
      const r = (seed + idx) % 3;
      if (r === 0) statusShort = 'FT';
      else if (r === 1) { statusShort = '1H'; minute = elapsed; }
      else statusShort = 'NS';
    }

    fixtures.push({
      id: seed + idx,
      referee: undefined,
      timezone: 'UTC',
      date: fixtureDate.toISOString(),
      timestamp: fixtureDate.getTime() / 1000,
      status: { short: statusShort, long: getLongStatus(statusShort) },
      minute,
      elapsed: minute,
      homeTeam: { ...home, id: 0, country: '' },
      awayTeam: { ...away, id: 0, country: '' },
      goals: statusShort === 'FT' ? { home: Math.floor(Math.random() * 4), away: Math.floor(Math.random() * 4) } : undefined,
      league: { ...league, id: league.id, season: new Date().getFullYear(), logo: '' },
    });
  });

  return fixtures;
}

function getLongStatus(short: string): string {
  switch (short) {
    case 'NS': return 'Not Started';
    case '1H': return 'First Half';
    case 'HT': return 'Halftime';
    case '2H': return 'Second Half';
    case 'ET': return 'Extra Time';
    case 'P': return 'Penalty Shootout';
    case 'FT': return 'Finished';
    case 'AET': return 'After Extra Time';
    default: return short;
  }
}
