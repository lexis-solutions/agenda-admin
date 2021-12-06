import classNames from 'classnames';
import { useEffect, useState } from 'react';
import Autocomplete from 'react-autocomplete';
import { API_URL } from 'src/constants';
import { StatusType } from 'src/types';
import { abreviateNumber } from 'src/utils/formatter';
import useSWR from 'swr';

const ALL_JOBS = { _id: 1, name: 'All jobs' };

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

  const { data } = useSWR(
    `${API_URL}/overview?name=${jobName}&property=${jobProperty}&value=${jobValue}`
  );

  useEffect(() => {
    fetchNames(term).then(({ data }) => setOptions([ALL_JOBS, ...data]));
  }, [term]);

  useEffect(() => setTerm(jobName), [jobName]);
  useEffect(() => setProperty(jobProperty), [jobProperty]);
  useEffect(() => setValue(jobValue), [jobValue]);

  const handleJobSelect = (job: string) =>
    setJobName(job === ALL_JOBS.name ? '' : job);

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
      {data && data.data.length ? (
        <div className="flex w-full m-2">
          <button
            className={classNames(
              'flex flex-col items-center justify-center flex-1 py-2 text-white bg-black border-4 border-white rounded-l-xl',
              { 'border-none': jobStatus !== 'scheduled' }
            )}
            onClick={handleStatusSelect('scheduled')}
          >
            <span className="text-4xl">
              {abreviateNumber(data.data[0].scheduled)}
            </span>
            <span>SCHEDULED</span>
          </button>
          <button
            className={classNames(
              'flex flex-col items-center justify-center flex-1 py-2 text-white bg-blue-500 border-4 border-white',
              { 'border-none': jobStatus !== 'queued' }
            )}
            onClick={handleStatusSelect('queued')}
          >
            <span className="text-4xl">
              {abreviateNumber(data.data[0].queued)}
            </span>
            <span>QUEUED</span>
          </button>
          <button
            className={classNames(
              'flex flex-col items-center justify-center flex-1 py-2 text-white bg-yellow-500 border-4 border-white',
              { 'border-none': jobStatus !== 'running' }
            )}
            onClick={handleStatusSelect('running')}
          >
            <span className="text-4xl">
              {abreviateNumber(data.data[0].running)}
            </span>
            <span>RUNNING</span>
          </button>
          <button
            className={classNames(
              'flex flex-col items-center justify-center flex-1 py-2 text-white bg-green-500 border-4 border-white',
              { 'border-none': jobStatus !== 'completed' }
            )}
            onClick={handleStatusSelect('completed')}
          >
            <span className="text-4xl">
              {abreviateNumber(data.data[0].completed)}
            </span>
            <span>COMPLETED</span>
          </button>
          <button
            className={classNames(
              'flex flex-col items-center justify-center flex-1 py-2 text-white bg-red-500 border-4 border-white rounded-r-xl',
              { 'border-none': jobStatus !== 'failed' }
            )}
            onClick={handleStatusSelect('failed')}
          >
            <span className="text-4xl">
              {abreviateNumber(data.data[0].failed)}
            </span>
            <span>FAILED</span>
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default JobFilters;
