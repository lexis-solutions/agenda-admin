import { useState } from 'react';
import useSWR from 'swr';
import JobsTable from 'src/components/JobsTable';
import PaginationButtons from 'src/components/PaginationButtons';
import { API_URL, ITEMS_PER_PAGE } from 'src/constants';

const App = () => {
  const [page, setPage] = useState(1);
  const { data, error } = useSWR(
    `${API_URL}/jobs?page=${page}&itemsPerPage=${ITEMS_PER_PAGE}`
  );

  if (!data && !error) return null;

  if (data[0].jobs.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-2xl text-gray-600 shadow-xl">No data found!</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between p-16">
      <JobsTable page={page} />
      <PaginationButtons
        page={page}
        pagesCount={data[0].pages[0].pagesCount}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
