import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formatted: string;
}

export function useCountdown(targetDate: string | Date): CountdownResult {
  const [timeLeft, setTimeLeft] = useState<CountdownResult>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    formatted: '0d 0h 0m',
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = dayjs();
      const target = dayjs(targetDate);
      const diff = target.diff(now);

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          formatted: 'Expired',
        });
        return;
      }

      const duration = dayjs.duration(diff);
      const days = Math.floor(duration.asDays());
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      const formatted = days > 0 
        ? `${days}d ${hours}h ${minutes}m`
        : hours > 0
        ? `${hours}h ${minutes}m`
        : `${minutes}m ${seconds}s`;

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
        formatted,
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export function addDaysToNow(days: number): string {
  return dayjs().add(days, 'day').toISOString();
}

export function formatDate(date: string | Date): string {
  return dayjs(date).format('MMM DD, YYYY');
}

export function formatRelativeTime(date: string | Date): string {
  return dayjs(date).fromNow();
}
