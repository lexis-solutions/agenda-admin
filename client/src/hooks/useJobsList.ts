import { API_URL, ITEMS_PER_PAGE } from 'src/constants';
import { SortType, StatusType } from 'src/types';
import useSWR from 'swr';

interface ArgsType {
  name: string;
  property: string;
  value: string;
  status: StatusType | '';
  page: number;
  sortBy: SortType;
  sortDesc: boolean;
}

export const useJobsList = ({
  name,
  property,
  value,
  status,
  page,
  sortBy,
  sortDesc,
}: ArgsType) =>
  useSWR(
    `${API_URL}/jobs?name=${name}&property=${property}&value=${value}&status=${status}&page=${page}&itemsPerPage=${ITEMS_PER_PAGE}&sortBy=${sortBy}&sortType=${
      sortDesc ? 'desc' : 'asc'
    }`
  );
