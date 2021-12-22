import { useCallback, useEffect, useState } from 'react';
import JobsTable from 'src/components/JobsTable';
import PaginationButtons from 'src/components/PaginationButtons';
import JobFilters from 'src/components/JobFilters';
import { SortType, StatusType } from 'src/types';
import { useJobsList } from './hooks/useJobsList';
import {
  deleteJobsById,
  requeueJobsById,
  deleteJobsByQuery,
  requeueJobsByQuery,
} from './api';

const App = () => {
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

  const handleBulkDelete = useCallback(async () => {
    if (selectFiltered) {
      await deleteJobsByQuery({ name, property, value, status });
      setSelectFiltered(false);
      mutate();
    } else {
      await handleDeleteJobs(Array.from(selected));
      setSelected(new Set());
    }
  }, [
    mutate,
    handleDeleteJobs,
    selectFiltered,
    selected,
    name,
    property,
    value,
    status,
  ]);

  const handleBulkRequeue = useCallback(async () => {
    if (selectFiltered) {
      await requeueJobsByQuery({ name, property, value, status });
      setSelectFiltered(false);
      mutate();
    } else {
      await handleRequeueJobs(Array.from(selected));
      setSelected(new Set());
    }
  }, [
    mutate,
    handleRequeueJobs,
    selectFiltered,
    selected,
    name,
    property,
    value,
    status,
  ]);

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
            selected={selected}
            setSelected={setSelected}
          />
        )}
        {data && data[0].jobs.length === 0 && (
          <div className="p-4 m-4">
            <span className="text-xl">No data found.</span>
          </div>
        )}
      </div>
      {data && (
        <div className="sticky bottom-0 z-10 flex flex-row items-center justify-between w-full p-2 border-t bg-base-100">
          <PaginationButtons
            page={page}
            pagesCount={data[0].pages[0] ? data[0].pages[0].pagesCount : 1}
            setPage={setPage}
          />
          <div className="flex flex-row items-center space-x-2">
            <div>
              {`${
                selectFiltered && data[0].pages[0]
                  ? data[0].pages[0].itemsCount
                  : selected.size
              } jobs selected`}
            </div>
            <button
              className="btn btn-sm btn-ghost text-primary"
              onClick={() => setSelectFiltered((state) => !state)}
            >
              {selectFiltered ? 'Unselect All' : 'Select All'}
            </button>
            <a
              href="#bulk-requeue"
              className="btn btn-sm btn-ghost text-secondary"
            >
              Requeue All
            </a>
            <a
              href="#bulk-delete"
              className="btn btn-sm btn-ghost text-warning"
            >
              Delete All
            </a>
            <div id="bulk-requeue" className="modal">
              <div className="modal-box">
                <div className="text-xl">
                  {`Requeue ${
                    selectFiltered && data[0].pages[0]
                      ? data[0].pages[0].itemsCount
                      : selected.size
                  } jobs?`}
                </div>
                <div className="modal-action">
                  <a
                    href="#!"
                    className="btn btn-primary"
                    onClick={handleBulkRequeue}
                  >
                    Requeue
                  </a>
                  <a href="#!" className="btn">
                    Close
                  </a>
                </div>
              </div>
            </div>
            <div id="bulk-delete" className="modal">
              <div className="modal-box">
                <div className="text-xl">
                  {`Delete ${
                    selectFiltered && data[0].pages[0]
                      ? data[0].pages[0].itemsCount
                      : selected.size
                  } jobs?`}
                </div>
                <div className="modal-action">
                  <a
                    href="#!"
                    className="btn btn-warning"
                    onClick={handleBulkDelete}
                  >
                    Delete
                  </a>
                  <a href="#!" className="btn">
                    Close
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
