import { DateTime } from 'luxon';

export const formatRelativeTime = (time: string) =>
  time ? DateTime.fromISO(time).toRelative() : '';
