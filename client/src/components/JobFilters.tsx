import classNames from 'classnames';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import Autocomplete from 'react-autocomplete';
import { API_URL } from 'src/constants';
import useJobsOverview from 'src/hooks/useJobsOverview';
import { StatusType } from 'src/types';
import { abbreviateNumber } from 'src/utils/formatter';

const ALL_JOBS = { _id: 1, name: 'All jobs' };
const DEBOUNCE_DELAY = 500;
const STATUS_BUTTONS: { name: StatusType; color: string }[] = [
  { name: 'scheduled', color: 'bg-black' },
  { name: 'queued', color: 'bg-blue-400' },
  { name: 'running', color: 'bg-yellow-500' },
  { name: 'completed', color: 'bg-green-500' },
  { name: 'failed', color: 'bg-red-500' },
];

interface PropsType {
  jobName: string;
  jobProperty: string;
  jobValue: string;
  jobStatus: StatusType | '';
  setJobName: (name: string) => void;
  setJobProperty: (property: string) => void;
  setJobValue: (value: string) => void;
  setJobStatus: (status: StatusType | '') => void;
}

const fetchNames = async (term: string) =>
  await fetch(`${API_URL}/autocomplete?autocomplete=${term}`).then((res) =>
    res.json()
  );

const JobFilters: React.FC<PropsType> = ({
  jobName,
  jobProperty,
  jobValue,
  jobStatus,
  setJobName,
  setJobProperty,
  setJobValue,
  setJobStatus,
}) => {
  const [term, setTerm] = useState('');
  const [property, setProperty] = useState('');
  const [value, setValue] = useState('');
  const [options, setOptions] = useState<any[]>([]);

  const { data } = useJobsOverview(jobName, jobProperty, jobValue);

  useEffect(() => {
    fetchNames(term).then(({ data }) => setOptions([ALL_JOBS, ...data]));
  }, [term]);

  useEffect(() => setTerm(jobName), [jobName]);
  useEffect(() => setProperty(jobProperty), [jobProperty]);
  useEffect(() => setValue(jobValue), [jobValue]);

  const handleJobSelect = (job: string) =>
    setJobName(job === ALL_JOBS.name ? '' : job);

  const debouncedSetJobProperty = useMemo(
    () =>
      debounce((val: string) => {
        setJobProperty(val);
      }, DEBOUNCE_DELAY),
    [setJobProperty]
  );

  const handlePropertyChange = (val: string) => {
    setProperty(val);
    debouncedSetJobProperty(val);
  };

  const debouncedSetJobValue = useMemo(
    () =>
      debounce((val: string) => {
        setJobValue(val);
      }, DEBOUNCE_DELAY),
    [setJobValue]
  );

  const handleValueChange = (val: string) => {
    setValue(val);
    debouncedSetJobValue(val);
  };

  const handleStatusSelect = (btnStatus: StatusType) => () =>
    setJobStatus(jobStatus !== btnStatus ? btnStatus : '');

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="m-2 form-control">
          <label className="text-gray-500 label">
            <span>Job Name</span>
          </label>
          <Autocomplete
            menuStyle={{ position: 'absolute', zIndex: 999 }}
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
                <input
                  {...props}
                  className="text-xl input input-bordered"
                  placeholder="All jobs"
                />
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
              onChange={(e) => handlePropertyChange(e.target.value)}
            />
            <span className="px-4 text-4xl text-center bg-gray-300 border-black">
              =
            </span>
            <input
              className="rounded-l-none input input-bordered"
              type="text"
              placeholder="value"
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
            />
          </div>
        </div>
      </div>
      {data && data.data.length ? (
        <div className="flex w-full m-2 btn-group">
          {STATUS_BUTTONS.map(({ name, color }) => (
            <button
              key={name}
              className={classNames(
                `btn btn-lg flex-1 text-white border-none ${color}`,
                { 'btn-active': jobStatus === name }
              )}
              onClick={handleStatusSelect(name)}
            >
              <div className="flex flex-col">
                <span className="text-3xl">
                  {abbreviateNumber(data.data[0][name])}
                </span>
                <span className="text-sm">{name}</span>
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default JobFilters;
