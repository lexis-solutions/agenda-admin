import { API_URL } from 'src/constants';
import useSWR from 'swr';

interface ArgsType {
  name: string;
  property: string;
  value: string;
}

export const useJobsOverview = ({ name, property, value }: ArgsType) =>
  useSWR(
    `${API_URL}/overview?name=${name}&property=${property}&value=${value}`
  );
