'use client';

import { Fixture } from '@/lib/types';
import { WANTED_LEAGUES, JORDAN_BROADCAST_MAP } from '@/lib/leagues';
import { format, toZonedTime } from 'date-fns-tz';

interface MatchCardProps {
  fixture: Fixture;
  ammanTimeZone: string;
}

export default function MatchCard({ fixture, ammanTimeZone }: MatchCardProps) {
  const { homeTeam, awayTeam, league, goals, status, date, minute, tv } = fixture;

  // Convert UTC date to Amman time
  const ammanDate = toZonedTime(date, ammanTimeZone);
  const timeStr = format(ammanDate, 'HH:mm');
  const dateStr = format(ammanDate, 'MMM d, yyyy');

  // League metadata from WANTED_LEAGUES
  const leagueMeta = WANTED_LEAGUES.find(l => l.id === league.id);
  const leagueFlag = leagueMeta?.flag || '🏆';

  // Broadcast info: prefer our Jordan mapping, else fallback to API's tv array
  const jordanBroadcast = JORDAN_BROADCAST_MAP[league.id];

  // Determine status badge color
  const statusBadgeClass = status.short === 'FT' ? 'bg-green-600' :
                          (status.short === 'NS' ? 'bg-blue-500' : 'bg-yellow-500');

  // Live indicator
  const isLive = ['1H','2H','HT','ET','P','AET'].includes(status.short);
  const liveDot = isLive ? (
    <span className="inline-block w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>
  ) : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col gap-2">
      {/* Header: League + time + status */}
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <span>{leagueFlag}</span>
          <span className="font-medium">{league.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {liveDot}
          <span className={`px-2 py-0.5 rounded text-xs text-white ${statusBadgeClass}`}>
            {status.long}
          </span>
        </div>
      </div>

      {/* Date & time in Amman */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {dateStr} • {timeStr} (Amman)
      </div>

      {/* Teams & Score */}
      <div className="flex items-center justify-between gap-2 my-1">
        <div className="flex-1 text-right">
          <div className="flex items-center justify-end gap-2">
            <span className="font-semibold">{homeTeam.name}</span>
            {homeTeam.logo && (
              <img src={homeTeam.logo} alt={homeTeam.name} className="w-6 h-6 object-contain" />
            )}
          </div>
        </div>
        <div className="w-12 text-center font-mono text-lg">
          {goals ? `${goals.home} - ${goals.away}` : '-'}
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center justify-start gap-2">
            {awayTeam.logo && (
              <img src={awayTeam.logo} alt={awayTeam.name} className="w-6 h-6 object-contain" />
            )}
            <span className="font-semibold">{awayTeam.name}</span>
          </div>
        </div>
      </div>

      {/* Broadcast Info */}
      <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 border-t pt-2">
        {jordanBroadcast ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <span>📺</span>
              <span className="font-medium">Jordan:</span>
              <span>{jordanBroadcast.jordanChannel}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <span>🌍</span>
              <span>{jordanBroadcast.mainChannel}</span>
            </div>
          </div>
        ) : tv && tv.length > 0 ? (
          <div className="flex items-center gap-1">
            <span>📺</span>
            <span>{tv[0].name}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
