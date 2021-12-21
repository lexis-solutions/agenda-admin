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
  const [jobListUpdatedAt, setJobListUpdatedAt] = useState(Date.now());
  const [selected] = useState(new Set<string>());

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
    <div className="max-w-screen-xl mx-auto">
      <div className="flex flex-col items-center justify-between p-8 space-y-4">
        <JobFilters
          jobName={name}
          jobProperty={property}
          jobValue={value}
          jobStatus={status}
          jobListUpdatedAt={jobListUpdatedAt}
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
      </div>
      <div className="sticky bottom-0 z-10 flex flex-row items-center justify-between w-full p-2 bg-white border-t">
        {data && (
          <PaginationButtons
            page={page}
            pagesCount={data[0].pages[0] ? data[0].pages[0].pagesCount : 1}
            setPage={setPage}
          />
        )}
        <div className="flex flex-row items-center space-x-2">
          <div>{selected.size} jobs selected</div>
          <button className="btn btn-sm btn-ghost text-primary">
            Select All
          </button>
          <button className="btn btn-sm btn-ghost text-secondary">
            Requeue All
          </button>
          <button className="btn btn-sm btn-ghost text-warning">
            Delete All
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
