import Footer from 'src/components/Footer';
import Header from 'src/components/Header';
import JobsTable from 'src/components/JobsTable';
import Logo from './svgs/Logo';
import { useJobsListContext } from 'src/hooks/useJobsListContext';

const App = () => {
  const { data } = useJobsListContext();

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex flex-col items-center justify-between py-8 mb-16 space-y-4">
        <a href="/" className="flex items-center self-start space-x-2 ">
          <Logo className="h-16 w-16" />
          <h1 className="text-3xl select-none font-bold">Agenda Admin</h1>
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
