import getRelativeTime from 'src/utils/get-relative-time';

export const relativeTimeFormatter = (time: string | Date | null) =>
  time ? getRelativeTime(new Date(time)) : 'never';
