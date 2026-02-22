import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { WANTED_LEAGUES } from '@/lib/leagues';
import { Fixture } from '@/lib/types';

function mapMatchToFixture(match: any): Fixture {
  const utcDate = match.utcDate;
  const dateObj = new Date(utcDate);
  const timestamp = Math.floor(dateObj.getTime() / 1000);
  const areaName = match.area?.name || '';

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

  let goals: { home: number | null; away: number | null } | undefined;
  if (match.score?.fullTime) {
    goals = {
      home: match.score.fullTime.home ?? null,
      away: match.score.fullTime.away ?? null,
    };
  }

  let referee: string | undefined;
  if (Array.isArray(match.referees)) {
    const mainRef = match.referees.find((r: any) => r.type === 'REFEREE');
    if (mainRef) referee = mainRef.name;
  }

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
    homeTeam,
    awayTeam,
    goals,
    league,
  };
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.FOOTBALL_DATA_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');

  try {
    const leagueIds = WANTED_LEAGUES.map(l => l.id).join(',');
    const apiUrl = 'https://api.football-data.org/v4/matches';
    const params = new URLSearchParams();
    params.set('competitions', leagueIds);
    if (date) {
      params.set('date', date);
    }
    const response = await axios.get(apiUrl, {
      headers: { 'X-Auth-Token': apiKey },
      params,
      timeout: 8000,
    });
    const matches = response.data.matches || [];
    const fixtures: Fixture[] = matches.map(mapMatchToFixture);
    return NextResponse.json({ fixtures });
  } catch (error: any) {
    console.error('API error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch fixtures' }, { status: 500 });
  }
}
