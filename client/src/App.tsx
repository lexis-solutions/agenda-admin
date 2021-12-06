import { useEffect, useState } from 'react';
import JobsTable from 'src/components/JobsTable';
import PaginationButtons from 'src/components/PaginationButtons';
import JobFilters from 'src/components/JobFilters';
import { SortType, StatusType } from 'src/types';
import useJobsList from './hooks/useJobsList';

const App = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortType>('lastRunAt');
  const [sortDesc, setSortDesc] = useState(true);
  const [name, setName] = useState('');
  const [property, setProperty] = useState('');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<StatusType | ''>('');

  const { data, error } = useJobsList(
    name,
    property,
    value,
    status,
    page,
    sortBy,
    sortDesc
  );

  useEffect(() => setPage(1), [name, property, value, status]);

  if (!data && !error) return null;

  return (
    <div className="flex flex-col items-center justify-between p-16">
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
      <JobsTable
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDesc={sortDesc}
        setSortDesc={setSortDesc}
        data={data[0].jobs}
      />
      {data[0].jobs.length === 0 && (
        <div className="flex items-center justify-center p-4 m-4">
          <span className="text-xl text-gray-600 shadow-md">
            No data found!
          </span>
        </div>
      )}
      <PaginationButtons
        page={page}
        pagesCount={data[0].pages[0] ? data[0].pages[0].pagesCount : 1}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
