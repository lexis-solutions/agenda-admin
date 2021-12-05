import { DateTime } from 'luxon';

export const formatRelativeTime = (time: string) =>
  time ? DateTime.fromISO(time).toRelative() : '';

export const abreviateNumber = (number: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(number);
