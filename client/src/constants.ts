export const API_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
export const ITEMS_PER_PAGE = process.env.REACT_APP_ITEMS_PER_PAGE || 20;
export const REFRESH_INTERVAL = process.env.REACT_APP_REFRESH_INTERVAL
  ? parseInt(process.env.REACT_APP_REFRESH_INTERVAL)
  : 15000;
