export interface Team {
  id: number;
  name: string;
  logo: string;
  country: string;
}

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  season: number;
}

export interface Fixture {
  id: number;
  referee?: string;
  timezone: string;
  date: string; // ISO 8601
  timestamp: number;
  status: {
    short: string; // e.g., "NS", "LH", "FT", "HT", "ET", "P"
    long: string;
  };
  minute?: number; // current minute if live
  elapsed?: number; // elapsed minutes
  venue?: {
    id: number;
    name: string;
    city: string;
  };
  homeTeam: Team;
  awayTeam: Team;
  goals?: {
    home: number | null;
    away: number | null;
  };
  league: League;
  tv?: {
    name?: string;
    logo?: string;
    country?: string;
  }[];
}

export interface ApiResponse<T> {
  response: T[];
}

// Jordan TV channel mapping per league
export interface JordanBroadcast {
  leagueId: number;
  mainChannel: string;
  jordanChannel: string;
}
