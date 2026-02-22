'use client';

import { format, subDays, addDays } from 'date-fns';

interface DateNavProps {
  currentDate: string;
  onNavigate: (date: string) => void;
}

export default function DateNav({ currentDate, onNavigate }: DateNavProps) {
  const today = new Date();
  const current = new Date(currentDate);

  // Navigation targets (relative to current view for yesterday/tomorrow, absolute for today)
  const yesterday = format(subDays(current, 1), 'yyyy-MM-dd');
  const tomorrow = format(addDays(current, 1), 'yyyy-MM-dd');
  const todayStr = format(today, 'yyyy-MM-dd');

  // Determine active button based on whether currentDate matches the fixed day relative to real today
  const realYesterday = format(subDays(today, 1), 'yyyy-MM-dd');
  const realTomorrow = format(addDays(today, 1), 'yyyy-MM-dd');

  const isYesterdayActive = currentDate === realYesterday;
  const isTodayActive = currentDate === todayStr;
  const isTomorrowActive = currentDate === realTomorrow;

  const baseClasses = 'px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600';
  const activeClasses = 'bg-blue-500 text-white';

  return (
    <div className="flex justify-center gap-4 my-6">
      <button
        onClick={() => onNavigate(yesterday)}
        className={`${baseClasses} ${isYesterdayActive ? activeClasses : 'bg-gray-200 dark:bg-gray-700'}`}
      >
        Yesterday
      </button>
      <button
        onClick={() => onNavigate(todayStr)}
        className={`${baseClasses} ${isTodayActive ? activeClasses : 'bg-gray-200 dark:bg-gray-700'}`}
      >
        Today
      </button>
      <button
        onClick={() => onNavigate(tomorrow)}
        className={`${baseClasses} ${isTomorrowActive ? activeClasses : 'bg-gray-200 dark:bg-gray-700'}`}
      >
        Tomorrow
      </button>
    </div>
  );
}
