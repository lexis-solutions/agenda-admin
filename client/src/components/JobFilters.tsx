import classNames from 'classnames';
import { useEffect, useState } from 'react';
import Autocomplete from 'react-autocomplete';
import { API_URL } from 'src/constants';

const ALL_JOBS = { _id: 1, name: 'All jobs' };

interface PropsType {
  jobName: string;
  setJobName: (name: string) => void;
}

const fetchNames = async (term: string) =>
  await fetch(`${API_URL}/autocomplete?autocomplete=${term}`).then((res) =>
    res.json()
  );

const JobFilters: React.FC<PropsType> = ({ jobName, setJobName }) => {
  const [term, setTerm] = useState('');
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    fetchNames(term).then(({ data }) => setOptions([ALL_JOBS, ...data]));
  }, [term]);

  useEffect(() => setTerm(jobName), [jobName]);

  const handleJobSelect = (job: string) =>
    setJobName(job === ALL_JOBS.name ? '' : job);

  return (
    <div className="m-2 form-control">
      <label className="text-gray-500 label">
        <span>Job Name</span>
      </label>
      <Autocomplete
        menuStyle={{ position: 'absolute', zIndex: 1 }}
        getItemValue={(item) => item.name}
        items={options}
        renderItem={(item, isHighlighted) => (
          <div
            key={item._id}
            className={classNames({
              'bg-gray-200': isHighlighted,
              'bg-white': !isHighlighted,
            })}
          >
            {item.name}
          </div>
        )}
        renderInput={(props) => {
          return <input {...props} className="text-xl input input-bordered" />;
        }}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onSelect={handleJobSelect}
      />
    </div>
  );
};

export default JobFilters;
