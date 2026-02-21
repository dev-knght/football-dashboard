import { JordanBroadcast } from './types';

// Known league IDs from API-Football (verified via community sources)
export const WANTED_LEAGUES = [
  { id: 39, name: 'Premier League', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 140, name: 'La Liga', country: 'Spain', flag: '🇪🇸' },
  { id: 135, name: 'Serie A', country: 'Italy', flag: '🇮🇹' },
  { id: 78, name: 'Bundesliga', country: 'Germany', flag: '🇩🇪' },
  { id: 61, name: 'Ligue 1', country: 'France', flag: '🇫🇷' },
  { id: 2, name: 'UEFA Champions League', country: 'Europe', flag: '🇪🇺' },
  { id: 3, name: 'UEFA Europa League', country: 'Europe', flag: '🇪🇺' },
  // Optional: UEFA Conference League (ID 4), World Cup (ID 1?) but we'll add after confirming
];

export const JORDAN_BROADCAST_MAP: Record<number, JordanBroadcast> = {
  39: { leagueId: 39, mainChannel: 'Sky Sports / Premier League Productions', jordanChannel: 'beIN Sports 1 (MENA)' },
  140: { leagueId: 140, mainChannel: 'DAZN / Movistar+', jordanChannel: 'beIN Sports 2 (MENA)' },
  135: { leagueId: 135, mainChannel: 'Serie A TV / DAZN', jordanChannel: 'beIN Sports 3 (MENA)' },
  78: { leagueId: 78, mainChannel: 'Sky Deutschland / DAZN', jordanChannel: 'beIN Sports 4 (MENA)' },
  61: { leagueId: 61, mainChannel: ' Canal+ / beIN Sports', jordanChannel: 'beIN Sports 5 (MENA)' },
  2: { leagueId: 2, mainChannel: 'UEFA / Broadcast Partners', jordanChannel: 'beIN Sports 6 (MENA)' },
  3: { leagueId: 3, mainChannel: 'UEFA / Broadcast Partners', jordanChannel: 'beIN Sports 7 (MENA)' },
};
