export const API_URL =
  process.env.REACT_APP_API_URL || process.env.PUBLIC_URL + '/api';
export const DEFAULT_REFRESH_INTERVAL = 15000;

export const JOB_COLORS = {
  scheduled: 'bg-black',
  queued: 'bg-blue-500',
  completed: 'bg-green-500',
  failed: 'bg-red-500',
  running: 'bg-yellow-500',
  repeating: 'bg-purple-500',
};
