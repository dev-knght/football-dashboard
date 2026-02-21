'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Fixture } from '@/lib/types';
import MatchCard from './MatchCard';
import DateNav from './DateNav';

interface MatchListClientProps {
  initialFixtures: Fixture[];
  currentDate: string; // YYYY-MM-DD (the date used for API call)
}

export default function MatchListClient({ initialFixtures, currentDate }: MatchListClientProps) {
  const router = useRouter();
  const [fixtures, setFixtures] = useState<Fixture[]>(initialFixtures);
  const [isLoading, setIsLoading] = useState(false);

  // Optional: poll live fixtures if today is selected and we have API key
  useEffect(() => {
    const isToday = new Date().toISOString().split('T')[0] === currentDate;
    if (!isToday) return;
    // Poll every 60 seconds for live updates? But we'd need to fetch again for the same date.
    // We can implement live refresh later.
    // For now, static.
  }, [currentDate]);

  const ammanTimeZone = 'Asia/Amman';

  // Group fixtures by league? Or just grid.
  return (
    <>
      <DateNav currentDate={currentDate} />
      {isLoading ? (
        <div className="text-center py-10">Loading...</div>
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
