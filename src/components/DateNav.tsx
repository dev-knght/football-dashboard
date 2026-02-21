'use client';

import { format, subDays, addDays } from 'date-fns';
import { useRouter } from 'next/navigation';

interface DateNavProps {
  currentDate: string; // YYYY-MM-DD
}

export default function DateNav({ currentDate }: DateNavProps) {
  const router = useRouter();
  const today = new Date();
  const current = new Date(currentDate);

  const yesterday = format(subDays(current, 1), 'yyyy-MM-dd');
  const tomorrow = format(addDays(current, 1), 'yyyy-MM-dd');
  const isToday = currentDate === format(today, 'yyyy-MM-dd');

  const navigate = (date: string) => {
    router.push(`/date/${date}`);
  };

  return (
    <div className="flex justify-center gap-4 my-6">
      <button
        onClick={() => navigate(yesterday)}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Yesterday
      </button>
      <button
        onClick={() => navigate(tomorrow)}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Tomorrow
      </button>
    </div>
  );
}
