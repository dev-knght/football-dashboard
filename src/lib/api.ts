import axios from 'axios';
import { Fixture } from './types';
import { WANTED_LEAGUES } from './leagues';

const API_BASE = 'https://api.football-data.org/v4';
const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_DATA_KEY;

const api = axios.create({
  baseURL: API_BASE,
  headers: API_KEY ? { 'X-Auth-Token': API_KEY } : {},
  timeout: 8000, // 8-second timeout to avoid hanging
});

/**
 * Map a football-data.org match object to our Fixture shape.
 */
function mapMatchToFixture(match: any): Fixture {
  const utcDate = match.utcDate;
  const dateObj = new Date(utcDate);
  const timestamp = Math.floor(dateObj.getTime() / 1000);
  const areaName = match.area?.name || '';

  // Determine status.short and status.long
  let statusShort = 'NS';
  let statusLong = 'Not Started';
  const rawStatus = match.status;
  const minute = match.minute;

  switch (rawStatus) {
    case 'SCHEDULED':
      statusShort = 'NS';
      statusLong = 'Not Started';
      break;
    case 'IN_PLAY':
      if (minute != null) {
        if (minute < 45) {
          statusShort = '1H';
          statusLong = 'First Half';
        } else if (minute < 90) {
          statusShort = '2H';
          statusLong = 'Second Half';
        } else {
          statusShort = 'ET';
          statusLong = 'Extra Time';
        }
      } else {
        statusShort = '1H';
        statusLong = 'First Half';
      }
      break;
    case 'PAUSED':
      statusShort = 'HT';
      statusLong = 'Halftime';
      break;
    case 'FINISHED':
      statusShort = 'FT';
      statusLong = 'Finished';
      break;
    case 'POSTPONED':
      statusShort = 'PST';
      statusLong = 'Postponed';
      break;
    case 'CANCELLED':
      statusShort = 'CAN';
      statusLong = 'Cancelled';
      break;
    default:
      statusShort = rawStatus ? rawStatus.substring(0, 2).toUpperCase() : 'UN';
      statusLong = rawStatus || 'Unknown';
  }

  // Goals from fullTime (current score)
  let goals: { home: number | null; away: number | null } | undefined;
  if (match.score?.fullTime) {
    goals = {
      home: match.score.fullTime.home ?? null,
      away: match.score.fullTime.away ?? null,
    };
  }

  // Referee from referees array
  let referee: string | undefined;
  if (Array.isArray(match.referees)) {
    const mainRef = match.referees.find((r: any) => r.type === 'REFEREE');
    if (mainRef) referee = mainRef.name;
  }

  // Venue (optional)
  let venue: { id: number; name: string; city: string } | undefined;
  if (match.venue) {
    venue = {
      id: match.venue.id,
      name: match.venue.name,
      city: match.venue.city || '',
    };
  }

  // League with season year
  const competition = match.competition || {};
  const season = match.season || {};
  let seasonYear = new Date().getFullYear();
  if (season.startDate) {
    const parts = season.startDate.split('-');
    if (parts[0]) seasonYear = parseInt(parts[0], 10);
  }

  const league = {
    id: competition.id,
    name: competition.name,
    country: areaName,
    logo: competition.emblem || '',
    season: seasonYear,
  };

  // Teams
  const homeTeam = {
    id: match.homeTeam.id,
    name: match.homeTeam.name,
    logo: match.homeTeam.crest || '',
    country: areaName,
  };
  const awayTeam = {
    id: match.awayTeam.id,
    name: match.awayTeam.name,
    logo: match.awayTeam.crest || '',
    country: areaName,
  };

  return {
    id: match.id,
    referee,
    timezone: 'UTC',
    date: utcDate,
    timestamp,
    status: { short: statusShort, long: statusLong },
    minute: match.minute,
    elapsed: match.minute,
    venue,
    homeTeam,
    awayTeam,
    goals,
    league,
  };
}

/**
 * Fetch fixtures for a specific date (YYYY-MM-DD).
 * If no API key, returns mock data.
 */
export async function getFixtures(date: string): Promise<Fixture[]> {
  if (!API_KEY) {
    console.warn('NEXT_PUBLIC_FOOTBALL_DATA_KEY not set, using mock fixtures');
    return getMockFixtures(date);
  }

  try {
    const leagueIds = WANTED_LEAGUES.map(l => l.id).join(',');
    const response = await api.get('/matches', {
      params: {
        date,
        competitions: leagueIds,
      },
    });
    const matches = response.data.matches || [];
    return matches.map(mapMatchToFixture);
  } catch (error: any) {
    console.error('API fetch error:', error.message);
    return getMockFixtures(date);
  }
}

/**
 * Fetch live fixtures (currently in-play or paused).
 */
export async function getLiveFixtures(): Promise<Fixture[]> {
  if (!API_KEY) {
    return [];
  }
  try {
    const leagueIds = WANTED_LEAGUES.map(l => l.id).join(',');
    const response = await api.get('/matches', {
      params: {
        status: 'IN_PLAY,PAUSED',
        competitions: leagueIds,
      },
    });
    const matches = response.data.matches || [];
    return matches.map(mapMatchToFixture);
  } catch (error: any) {
    console.error('Live fixtures error:', error.message);
    return [];
  }
}

/* -------------------------------------------------------------------------- */
/*                                 Mock data                                   */
/* -------------------------------------------------------------------------- */

/**
 * Mock fixtures for development/demo without API key.
 * Uses WANTED_LEAGUES IDs (football-data.org) and placeholder team logos.
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
