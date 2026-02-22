'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Fixture } from '@/lib/types';
import MatchListClient from '@/components/MatchListClient';
import { getFixtures, getLiveFixtures } from '@/lib/api';

export default function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dateParam = searchParams.get('date');
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [currentDate, setCurrentDate] = useState<string>(dateParam || today);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const date = dateParam || today;
    setCurrentDate(date);
    setError(null);
    setIsLoading(true);

    // Fetch fixtures for the selected date
    getFixtures(date)
      .then(dateFixtures => {
        console.log(`[DEBUG] getFixtures(${date}) returned ${dateFixtures.length} items`);
        if (dateFixtures.length > 0) {
          console.log('First date fixture:', dateFixtures[0]);
        }

        // If viewing today, also fetch live fixtures and merge
        if (date === today) {
          return getLiveFixtures().then(liveFixtures => {
            console.log(`[DEBUG] getLiveFixtures() returned ${liveFixtures.length} items`);
            if (liveFixtures.length > 0) {
              console.log('First live fixture:', liveFixtures[0]);
            }
            // Merge: combine both arrays, then deduplicate by fixture.id
            const combined = [...dateFixtures];
            const seen = new Set(dateFixtures.map(f => f.id));
            for (const f of liveFixtures) {
              if (!seen.has(f.id)) {
                combined.push(f);
                seen.add(f.id);
              }
            }
            // Sort: live first (by status short), then by time
            combined.sort((a, b) => {
              const aLive = ['1H','2H','HT','ET','P','AET'].includes(a.status.short);
              const bLive = ['1H','2H','HT','ET','P','AET'].includes(b.status.short);
              if (aLive && !bLive) return -1;
              if (!aLive && bLive) return 1;
              return a.timestamp - b.timestamp;
            });
            setFixtures(combined);
          });
        } else {
          setFixtures(dateFixtures);
        }
      })
      .catch((err: Error) => {
        console.error('[DEBUG] Fetch error:', err);
        setError(err.message || 'Failed to load fixtures');
        setFixtures([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dateParam, today]);

  const handleNavigate = useCallback((newDate: string) => {
    router.push(`/?date=${newDate}`);
  }, [router]);

  return (
    <main className="min-h-screen p-4 md:p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">Football Matches</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mt-2">
          {isLoading ? 'Loading…' : error ? `Error: ${error}` : `Showing ${fixtures.length} fixtures for ${currentDate}`}
        </p>
        {error && (
          <p className="text-center text-red-600 mt-2">
            Showing mock data for demonstration. Check console for details.
          </p>
        )}
      </header>

      <MatchListClient
        fixtures={fixtures}
        currentDate={currentDate}
        isLoading={isLoading}
        onNavigate={handleNavigate}
      />
    </main>
  );
}
