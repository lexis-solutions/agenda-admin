import classNames from 'classnames';
import { useEffect, useState } from 'react';
import Autocomplete from 'react-autocomplete';
import { API_URL } from 'src/constants';

const ALL_JOBS = { _id: 1, name: 'All jobs' };

interface PropsType {
  jobName: string;
  jobProperty: string;
  jobValue: string;
  setJobName: (name: string) => void;
  setJobProperty: (property: string) => void;
  setJobValue: (value: string) => void;
}

const fetchNames = async (term: string) =>
  await fetch(`${API_URL}/autocomplete?autocomplete=${term}`).then((res) =>
    res.json()
  );

const JobFilters: React.FC<PropsType> = ({
  jobName,
  jobProperty,
  jobValue,
  setJobName,
  setJobProperty,
  setJobValue,
}) => {
  const [term, setTerm] = useState('');
  const [property, setProperty] = useState('');
  const [value, setValue] = useState('');
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    fetchNames(term).then(({ data }) => setOptions([ALL_JOBS, ...data]));
  }, [term]);

  useEffect(() => setTerm(jobName), [jobName]);
  useEffect(() => setProperty(jobProperty), [jobProperty]);
  useEffect(() => setValue(jobValue), [jobValue]);

  const handleJobSelect = (job: string) =>
    setJobName(job === ALL_JOBS.name ? '' : job);

  return (
    <div className="flex flex-row">
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
              className={classNames('text-md p-2', {
                'bg-gray-200': isHighlighted,
                'bg-white': !isHighlighted,
              })}
            >
              {item.name}
            </div>
          )}
          renderInput={(props) => {
            return (
              <input {...props} className="text-xl input input-bordered" />
            );
          }}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onSelect={handleJobSelect}
        />
      </div>
      <div className="m-2 form-control">
        <label className="text-gray-500 label">Form Value</label>
        <div className="flex flex-row">
          <input
            className="rounded-r-none input input-bordered"
            type="text"
            placeholder="property"
            value={property}
            onChange={(e) => setProperty(e.target.value)}
            onBlur={() => setJobProperty(property)}
          />
          <span className="px-4 text-4xl text-center bg-gray-300 border-black">
            =
          </span>
          <input
            className="rounded-l-none input input-bordered"
            type="text"
            placeholder="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => setJobValue(value)}
          />
        </div>
      </div>
    </div>
  );
};

export default JobFilters;
