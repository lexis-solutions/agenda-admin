import { useCallback, useEffect, useState } from 'react';
import JobsTable from 'src/components/JobsTable';
import PaginationButtons from 'src/components/PaginationButtons';
import JobFilters from 'src/components/JobFilters';
import { SortType, StatusType } from 'src/types';
import { useJobsList } from './hooks/useJobsList';
import { deleteJobs, requeueJobs } from './api';

const App = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortType>('lastRunAt');
  const [sortDesc, setSortDesc] = useState(true);
  const [name, setName] = useState('');
  const [property, setProperty] = useState('');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<StatusType | ''>('');

  const { data, mutate } = useJobsList({
    name,
    property,
    value,
    status,
    page,
    sortBy,
    sortDesc,
  });

  const handleDeleteJobs = useCallback(
    async (ids: string[]) => {
      await deleteJobs(ids);
      mutate();
    },
    [mutate]
  );

  const handleRequeueJobs = useCallback(
    async (ids: string[]) => {
      await requeueJobs(ids);
      mutate();
    },
    [mutate]
  );

  useEffect(() => setPage(1), [name, property, value, status]);

  return (
    <div className="flex flex-col items-center justify-between max-w-screen-xl p-8 mx-auto space-y-4">
      <JobFilters
        jobName={name}
        jobProperty={property}
        jobValue={value}
        jobStatus={status}
        setJobName={setName}
        setJobProperty={setProperty}
        setJobValue={setValue}
        setJobStatus={setStatus}
      />
      {data && (
        <JobsTable
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDesc={sortDesc}
          setSortDesc={setSortDesc}
          data={data[0].jobs}
          onDeleteJobs={handleDeleteJobs}
          onRequeueJobs={handleRequeueJobs}
        />
      )}
      {data && data[0].jobs.length === 0 && (
        <div className="p-4 m-4">
          <span className="text-xl">No data found.</span>
        </div>
      )}
      {data && (
        <PaginationButtons
          page={page}
          pagesCount={data[0].pages[0] ? data[0].pages[0].pagesCount : 1}
          setPage={setPage}
        />
      )}
    </div>
  );
};

export default App;
