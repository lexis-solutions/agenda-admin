import JobsTable from 'src/components/JobsTable';
import Footer from 'src/components/Footer';
import { useJobsListContext } from 'src/hooks/useJobsListContext';
import Header from 'src/components/Header';

const App = () => {
  const { data } = useJobsListContext();

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex flex-col items-center justify-between py-8 mb-16 space-y-4">
        <Header />
        <JobsTable />
        {data && data[0].jobs.length === 0 && (
          <div className="p-4 m-4">
            <span>No data found.</span>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
};

export default App;
