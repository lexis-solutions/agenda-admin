import {
  createContext,
  Dispatch,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { deleteJobsById, requeueJobsById } from 'src/api';
import { useJobsList } from 'src/hooks/useJobsList';
import { SortType, StatusType, GetJobsResponseType } from 'src/types';
import { KeyedMutator } from 'swr';

interface ContextValueType {
  data: GetJobsResponseType | null;
  refreshJobsList: KeyedMutator<GetJobsResponseType>;
  name: string;
  setName: Dispatch<string>;
  property: string;
  setProperty: Dispatch<string>;
  value: string;
  setValue: Dispatch<string>;
  status: StatusType | '';
  setStatus: Dispatch<StatusType | ''>;
  page: number;
  setPage: Dispatch<number>;
  sortBy: SortType;
  setSortBy: Dispatch<SortType>;
  sortDesc: boolean;
  setSortDesc: Dispatch<boolean>;
  jobListUpdatedAt: number;
  setJobListUpdatedAt: Dispatch<number>;
  selectFiltered: boolean;
  setSelectFiltered: Dispatch<boolean>;
  selected: Set<string>;
  setSelected: Dispatch<Set<string>>;
  handleDeleteJobs: (ids: string[]) => void;
  handleRequeueJobs: (ids: string[]) => void;
}

export const JobsListContext = createContext<ContextValueType | null>(null);

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

  const { data, mutate } = useJobsList(
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
      onSuccess: () => setJobListUpdatedAt(Date.now()),
    }
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
      }}
    >
      {children}
    </JobsListContext.Provider>
  );
};
