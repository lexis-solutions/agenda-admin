import Footer from 'src/components/Footer';
import Header from 'src/components/Header';
import JobsTable from 'src/components/JobsTable';
import Logo from './svgs/Logo';
import { useJobsListContext } from 'src/hooks/useJobsListContext';

const App = () => {
  const { data, error } = useJobsListContext();

  if (!data && !error) return null;

  if (error) {
    return (
      <div className="m-4 text-xl text-error">
        <p>An error has occurred!</p>
        <p>Error message: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex flex-col items-center justify-between py-8 mb-16 space-y-4">
        <a href="/" className="flex items-center self-start space-x-2 ">
          <Logo className="w-16 h-16" />
          <h1 className="text-3xl font-bold select-none">Agenda Admin</h1>
        </a>
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
