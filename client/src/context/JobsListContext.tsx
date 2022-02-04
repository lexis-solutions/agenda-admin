import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { GetJobsResponseType, SortType, StatusType } from 'src/types';
import { deleteJobsById, requeueJobsById } from 'src/api';

import { DEFAULT_REFRESH_INTERVAL } from 'src/constants';
import { KeyedMutator } from 'swr';
import { useJobsList } from 'src/hooks/useJobsList';

interface JobsListContextType {
  data: GetJobsResponseType | null;
  refreshJobsList: KeyedMutator<GetJobsResponseType>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  property: string;
  setProperty: Dispatch<SetStateAction<string>>;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  status: StatusType | '';
  setStatus: Dispatch<SetStateAction<StatusType | ''>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  sortBy: SortType;
  setSortBy: Dispatch<SetStateAction<SortType>>;
  sortDesc: boolean;
  setSortDesc: Dispatch<SetStateAction<boolean>>;
  jobListUpdatedAt: number;
  setJobListUpdatedAt: Dispatch<SetStateAction<number>>;
  selectFiltered: boolean;
  setSelectFiltered: Dispatch<SetStateAction<boolean>>;
  selected: Set<string>;
  setSelected: Dispatch<SetStateAction<Set<string>>>;
  handleDeleteJobs: (ids: string[]) => void;
  handleRequeueJobs: (ids: string[]) => void;
  refreshInterval: number;
  setRefreshInterval: (i: number) => void;
  error: any;
}

const defaultValue: JobsListContextType = {
  data: null,
  name: '',
  property: '',
  value: '',
  status: '',
  page: 1,
  sortBy: 'lastRunAt',
  sortDesc: true,
  jobListUpdatedAt: 0,
  selectFiltered: false,
  selected: new Set<string>(),
  refreshInterval: DEFAULT_REFRESH_INTERVAL,
  refreshJobsList: async () => undefined,
  setName: () => null,
  setProperty: () => null,
  setValue: () => null,
  setStatus: () => null,
  setPage: () => null,
  setSortBy: () => null,
  setSortDesc: () => null,
  setJobListUpdatedAt: () => null,
  setSelectFiltered: () => null,
  setSelected: () => null,
  handleDeleteJobs: () => null,
  handleRequeueJobs: () => null,
  setRefreshInterval: () => null,
  error: null,
};

export const JobsListContext = createContext<JobsListContextType>(defaultValue);

export const JobsListContextProvider: React.FC = ({ children }) => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortType>('lastRunAt');
  const [sortDesc, setSortDesc] = useState(true);
  const [name, setName] = useState('');
  const [property, setProperty] = useState('');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<StatusType | ''>('');
  const [jobListUpdatedAt, setJobListUpdatedAt] = useState(Date.now());
  const [selectFiltered, setSelectFiltered] = useState(false);
  const [selected, setSelected] = useState(new Set<string>());
  const [refreshRate, setRefreshRate] = useState(
    localStorage.getItem('refreshInterval') || DEFAULT_REFRESH_INTERVAL
  );

  const { data, mutate, error } = useJobsList(
    {
      name,
      property,
      value,
      status,
      page,
      sortBy,
      sortDesc,
    },
    {
      refreshInterval: selected.size !== 0 ? undefined : +refreshRate,
      onSuccess: () => setJobListUpdatedAt(Date.now()),
    }
  );

  const setRefreshInterval = useCallback(
    (i: number) => {
      setRefreshRate(i);
      localStorage.setItem('refreshInterval', i.toString());
    },
    [setRefreshRate]
  );

  const handleDeleteJobs = useCallback(
    async (ids: string[]) => {
      await deleteJobsById(ids);
      mutate();
    },
    [mutate]
  );

  const handleRequeueJobs = useCallback(
    async (ids: string[]) => {
      await requeueJobsById(ids);
      mutate();
    },
    [mutate]
  );

  useEffect(() => setPage(1), [name, property, value, status, setPage]);

  return (
    <JobsListContext.Provider
      value={{
        data: data || null,
        refreshJobsList: mutate,
        name,
        setName,
        property,
        setProperty,
        value,
        setValue,
        status,
        setStatus,
        page,
        setPage,
        sortBy,
        setSortBy,
        sortDesc,
        setSortDesc,
        jobListUpdatedAt,
        setJobListUpdatedAt,
        selectFiltered,
        setSelectFiltered,
        selected,
        setSelected,
        handleDeleteJobs,
        handleRequeueJobs,
        refreshInterval: +refreshRate,
        setRefreshInterval,
        error,
      }}
    >
      {children}
    </JobsListContext.Provider>
  );
};
