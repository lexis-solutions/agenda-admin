import { API_URL } from 'src/constants';
import { GetJobsResponseType, SortType, StatusType } from 'src/types';
import useSWR, { SWRConfiguration } from 'swr';

interface ArgsType {
  name: string;
  property: string;
  value: string;
  status: StatusType | '';
  page: number;
  sortBy: SortType;
  sortDesc: boolean;
}

export const useJobsList = (
  { name, property, value, status, page, sortBy, sortDesc }: ArgsType,
  config?: SWRConfiguration
) =>
  useSWR<GetJobsResponseType>(
    `${API_URL}/jobs?name=${name}&property=${property}&value=${value}&status=${status}&page=${page}&sortBy=${sortBy}&sortType=${
      sortDesc ? 'desc' : 'asc'
    }`,
    config
  );
