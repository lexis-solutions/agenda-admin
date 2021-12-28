import JobsTable from 'src/components/JobsTable';
import JobFilters from 'src/components/JobFilters';
import Footer from './components/Footer';
import { useJobsListContext } from './hooks/useJobsListContext';

const App = () => {
  const { data } = useJobsListContext();

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex flex-col items-center justify-between p-8 mb-16 space-y-4">
        <JobFilters />
        <JobsTable />
        {data && data[0].jobs.length === 0 && (
          <div className="p-4 m-4">
            <span className="text-xl">No data found.</span>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;
