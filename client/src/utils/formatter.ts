import { DateTime } from 'luxon';

export const formatRelativeDateTime = (time: string) =>
  time ? DateTime.fromISO(time).toRelative() : '';

export const formatLocalDateTime = (time: string) =>
  time ? new Date(time).toLocaleString() : '';

export const abbreviateNumber = (number: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(number);
