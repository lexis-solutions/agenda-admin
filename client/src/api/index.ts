import { API_URL } from 'src/constants';
import { StatusType } from 'src/types';
import { Fetcher } from 'swr';

export const fetcher: Fetcher<any> = (url) =>
  fetch(url).then((res) => res.json());

export const fetchNames = (term: string) =>
  fetch(`${API_URL}/autocomplete?autocomplete=${term}`).then((res) =>
    res.json()
  );

export const deleteJobsById = (ids: string[]) =>
  fetch(`${API_URL}/delete/id`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  }).then((res) => res.json());

export const requeueJobsById = (ids: string[]) =>
  fetch(`${API_URL}/requeue/id`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ ids }),
  }).then((res) => res.json());

export const deleteJobsByQuery = ({
  name,
  property,
  value,
  status,
}: {
  name: string;
  property: string;
  value: string;
  status: StatusType | '';
}) =>
  fetch(
    `${API_URL}/delete/query?name=${name}&property=${property}&value=${value}&status=${status}`,
    { method: 'DELETE' }
  );

export const requeueJobsByQuery = ({
  name,
  property,
  value,
  status,
}: {
  name: string;
  property: string;
  value: string;
  status: StatusType | '';
}) =>
  fetch(
    `${API_URL}/requeue/query?name=${name}&property=${property}&value=${value}&status=${status}`,
    { method: 'POST' }
  );

export const createNewJob = (job: {
  name: string;
  repeatInterval?: string;
  schedule?: string;
  data?: string;
}) =>
  fetch(`${API_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(job),
  }).then((res) => res.json());
