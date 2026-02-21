import { notFound } from 'next/navigation';
import MatchListClient from '@/components/MatchListClient';
import { getFixtures } from '@/lib/api';

interface PageProps {
  params: Promise<{ date: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// This server component fetches fixtures for the given date (UTC)
export default async function DatePage({ params }: PageProps) {
  const { date } = await params;
  // Validate date format YYYY-MM-DD (basic)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    notFound();
  }

  const fixtures = await getFixtures(date);

  return (
    <main className="min-h-screen p-4 md:p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">Football Matches</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mt-2">
          Showing {fixtures.length} fixtures for {date}
        </p>
      </header>

      <MatchListClient initialFixtures={fixtures} currentDate={date} />
    </main>
  );
}
