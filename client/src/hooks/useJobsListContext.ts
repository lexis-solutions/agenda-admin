import { useContext } from 'react';
import { JobsListContext } from 'src/context/JobsListContext';

export const useJobsListContext = () => {
  return useContext(JobsListContext);
};
