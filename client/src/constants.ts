export const API_URL =
  `${process.env.PUBLIC_URL}/api` || 'http://localhost:4000/api';
export const ITEMS_PER_PAGE = process.env.REACT_APP_ITEMS_PER_PAGE || 20;
export const REFRESH_INTERVAL = process.env.REACT_APP_REFRESH_INTERVAL
  ? parseInt(process.env.REACT_APP_REFRESH_INTERVAL)
  : 15000;

export const JOB_COLORS = {
  scheduled: 'bg-black',
  queued: 'bg-blue-500',
  completed: 'bg-green-500',
  failed: 'bg-red-500',
  running: 'bg-yellow-500',
  repeating: 'bg-purple-500',
};
