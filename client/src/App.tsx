import { useContext } from 'react';
import JobsTable from 'src/components/JobsTable';
import JobFilters from 'src/components/JobFilters';
import { JobsListContext } from './context/JobsListContext';
import Footer from './components/Footer';

const App = () => {
  const { data } = useContext(JobsListContext)!;

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex flex-col items-center justify-between p-8 space-y-4">
        <JobFilters />
        <JobsTable />
        {data && data[0].jobs.length === 0 && (
          <div className="p-4 m-4">
            <span className="text-xl">No data found.</span>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
};

export default App;
