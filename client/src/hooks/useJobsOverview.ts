import { API_URL } from 'src/constants';
import { JobsOverviewResponseType } from 'src/types';
import useSWR from 'swr';

interface ArgsType {
  name: string;
  property: string;
  value: string;
}

export const useJobsOverview = ({ name, property, value }: ArgsType) =>
  useSWR<JobsOverviewResponseType>(
    `${API_URL}/overview?name=${name}&property=${property}&value=${value}`
  );
