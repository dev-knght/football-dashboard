import { JordanBroadcast } from './types';

// League IDs from football-data.org (v4)
export const WANTED_LEAGUES = [
  { id: 2021, name: 'Premier League', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 2014, name: 'La Liga', country: 'Spain', flag: '🇪🇸' },
  { id: 2019, name: 'Serie A', country: 'Italy', flag: '🇮🇹' },
  { id: 2002, name: 'Bundesliga', country: 'Germany', flag: '🇩🇪' },
  { id: 2015, name: 'Ligue 1', country: 'France', flag: '🇫🇷' },
  { id: 2001, name: 'UEFA Champions League', country: 'Europe', flag: '🇪🇺' },
  { id: 2146, name: 'UEFA Europa League', country: 'Europe', flag: '🇪🇺' },
];

export const JORDAN_BROADCAST_MAP: Record<number, JordanBroadcast> = {
  2021: { leagueId: 2021, mainChannel: 'Sky Sports / Premier League Productions', jordanChannel: 'beIN Sports 1 (MENA)' },
  2014: { leagueId: 2014, mainChannel: 'DAZN / Movistar+', jordanChannel: 'beIN Sports 2 (MENA)' },
  2019: { leagueId: 2019, mainChannel: 'Serie A TV / DAZN', jordanChannel: 'beIN Sports 3 (MENA)' },
  2002: { leagueId: 2002, mainChannel: 'Sky Deutschland / DAZN', jordanChannel: 'beIN Sports 4 (MENA)' },
  2015: { leagueId: 2015, mainChannel: 'Canal+ / beIN Sports', jordanChannel: 'beIN Sports 5 (MENA)' },
  2001: { leagueId: 2001, mainChannel: 'UEFA / Broadcast Partners', jordanChannel: 'beIN Sports 6 (MENA)' },
  2146: { leagueId: 2146, mainChannel: 'UEFA / Broadcast Partners', jordanChannel: 'beIN Sports 7 (MENA)' },
};
