import { useState } from 'react';
import useSWR from 'swr';
import JobsTable from './components/JobsTable';
import PaginationButtons from './components/PaginationButtons';

const App = () => {
  const [page, setPage] = useState(1);
  const { data, error } = useSWR(`http://localhost:4000/api/jobs?page=${page}`);

  if (!data && !error) return null;

  return (
    <div className="flex flex-col items-center justify-between p-16">
      <JobsTable page={page} />
      <PaginationButtons
        page={page}
        pagesCount={data.pagesCount}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
