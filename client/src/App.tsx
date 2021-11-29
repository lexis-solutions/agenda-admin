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

  return (
    <div className="flex flex-col items-center justify-between p-16">
      <JobsTable page={page} />
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
