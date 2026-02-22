'use client';

import { format, subDays, addDays } from 'date-fns';

interface DateNavProps {
  currentDate: string;
  onNavigate: (date: string) => void;
}

export default function DateNav({ currentDate, onNavigate }: DateNavProps) {
  const today = new Date();
  const current = new Date(currentDate);

  const yesterday = format(subDays(current, 1), 'yyyy-MM-dd');
  const tomorrow = format(addDays(current, 1), 'yyyy-MM-dd');
  const todayStr = format(today, 'yyyy-MM-dd');

  const isToday = currentDate === todayStr;

  return (
    <div className="flex justify-center gap-4 my-6">
      <button
        onClick={() => onNavigate(yesterday)}
        className={`px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 ${
          currentDate === yesterday ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        Yesterday
      </button>
      <button
        onClick={() => onNavigate(todayStr)}
        className={`px-4 py-2 rounded hover:bg-blue-600 ${
          isToday ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        Today
      </button>
      <button
        onClick={() => onNavigate(tomorrow)}
        className={`px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 ${
          currentDate === tomorrow ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        Tomorrow
      </button>
    </div>
  );
}
