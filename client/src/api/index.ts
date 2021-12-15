import { API_URL } from 'src/constants';

export const deleteJobs = (ids: string[]) =>
  fetch(`${API_URL}/delete`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  }).then((res) => res.json());

export const requeueJobs = (ids: string[]) =>
  fetch(`${API_URL}/requeue`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ ids }),
  }).then((res) => res.json());
