'use client';

import { Fixture } from '@/lib/types';
import MatchCard from './MatchCard';
import DateNav from './DateNav';

interface MatchListClientProps {
  fixtures: Fixture[];
  currentDate: string; // YYYY-MM-DD
  isLoading?: boolean;
  onNavigate: (date: string) => void;
}

export default function MatchListClient({ fixtures, currentDate, isLoading = false, onNavigate }: MatchListClientProps) {
  const ammanTimeZone = 'Asia/Amman';

  return (
    <>
      <DateNav currentDate={currentDate} onNavigate={onNavigate} />
      {isLoading ? (
        <div className="text-center py-10">Loading…</div>
      ) : fixtures.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No matches found for this date.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fixtures.map(fixture => (
            <MatchCard key={fixture.id} fixture={fixture} ammanTimeZone={ammanTimeZone} />
          ))}
        </div>
      )}
    </>
  );
}
