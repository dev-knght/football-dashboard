import { Fixture } from './types';
import { WANTED_LEAGUES } from './leagues';

/**
 * Fetch fixtures for a specific date (YYYY-MM-DD) via our server-side API route.
 * If the server returns an error (e.g., API key missing), we fall back to mock data.
 */
export async function getFixtures(date: string): Promise<Fixture[]> {
  try {
    const res = await fetch(`/api/fixtures?date=${encodeURIComponent(date)}`);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const json = await res.json();
    return json.fixtures as Fixture[];
  } catch (error: any) {
    console.error('Fetch fixtures error:', error.message);
    return getMockFixtures(date);
  }
}

export async function getLiveFixtures(): Promise<Fixture[]> {
  try {
    const res = await fetch('/api/live/');
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const json = await res.json();
    return json.fixtures as Fixture[];
  } catch (error: any) {
    console.error('Fetch live fixtures error:', error.message);
    return [];
  }
}

/* -------------------------------------------------------------------------- */
/*                                 Mock data                                   */
/* -------------------------------------------------------------------------- */

function getMockFixtures(date: string): Fixture[] {
  const seed = date.split('-').map(Number).reduce((a, b) => a + b, 0);
  const mockLeagues = WANTED_LEAGUES.slice(0, 4);
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

  const fixtures: Fixture[] = [];
  mockLeagues.forEach((league, idx) => {
    const home = mockTeams[(seed + idx * 2) % mockTeams.length];
    const away = mockTeams[(seed + idx * 2 + 1) % mockTeams.length];
    const fixtureDate = new Date(date + 'T15:00:00Z');
    const now = new Date();
    const isToday = date === now.toISOString().split('T')[0];
    let statusShort: string = 'NS';
    let minute: number | undefined;
    const elapsed = Math.floor(Math.random() * 90) + 1;

    if (date < now.toISOString().split('T')[0]) {
      statusShort = 'FT';
    } else if (isToday) {
      const r = (seed + idx) % 3;
      if (r === 0) statusShort = 'FT';
      else if (r === 1) { statusShort = '1H'; minute = elapsed; }
      else statusShort = 'NS';
    }

    const statusLong = getLongStatus(statusShort);
    const timestamp = Math.floor(fixtureDate.getTime() / 1000);

    fixtures.push({
      id: seed + idx,
      referee: undefined,
      timezone: 'UTC',
      date: fixtureDate.toISOString(),
      timestamp,
      status: { short: statusShort, long: statusLong },
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
