import Footer from 'src/components/Footer';
import Header from 'src/components/Header';
import JobsTable from 'src/components/JobsTable';
import Logo from './svgs/Logo';

const App = () => {
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex flex-col items-center justify-between py-8 mb-16 space-y-4">
        <div className="flex items-center self-start space-x-2">
          <Logo className="w-16 h-16" />
          <h1 className="text-3xl font-bold select-none">Agenda Admin</h1>
        </div>
        <Header />
        <JobsTable />
        <Footer />
      </div>
    </div>
  );
};

export default App;
