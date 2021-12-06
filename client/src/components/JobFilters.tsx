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
        <div className="flex w-full m-2 btn-group">
          <button
            className={classNames(
              'btn btn-lg flex-1 text-white border-none bg-black rounded-l-xl',
              { 'btn-active': jobStatus === 'scheduled' }
            )}
            onClick={handleStatusSelect('scheduled')}
          >
            <div className="flex flex-col">
              <span className="text-3xl">
                {abreviateNumber(data.data[0].scheduled)}
              </span>
              <span className="text-sm">SCHEDULED</span>
            </div>
          </button>
          <button
            className={classNames(
              'btn btn-lg flex-1 text-white border-none bg-blue-400',
              { 'btn-active': jobStatus === 'queued' }
            )}
            onClick={handleStatusSelect('queued')}
          >
            <div className="flex flex-col">
              <span className="text-3xl">
                {abreviateNumber(data.data[0].queued)}
              </span>
              <span className="text-sm">QUEUED</span>
            </div>
          </button>
          <button
            className={classNames(
              'btn btn-lg flex-1 text-white border-none bg-yellow-500',
              { 'btn-active': jobStatus === 'running' }
            )}
            onClick={handleStatusSelect('running')}
          >
            <div className="flex flex-col">
              <span className="text-3xl">
                {abreviateNumber(data.data[0].running)}
              </span>
              <span className="text-sm">RUNNING</span>
            </div>
          </button>
          <button
            className={classNames(
              'btn btn-lg flex-1 text-white border-none bg-green-500',
              { 'btn-active': jobStatus === 'completed' }
            )}
            onClick={handleStatusSelect('completed')}
          >
            <div className="flex flex-col">
              <span className="text-3xl">
                {abreviateNumber(data.data[0].completed)}
              </span>
              <span className="text-sm">COMPLETED</span>
            </div>
          </button>
          <button
            className={classNames(
              'btn btn-lg flex-1 text-white border-none bg-red-500 rounded-r-xl',
              { 'btn-active': jobStatus === 'failed' }
            )}
            onClick={handleStatusSelect('failed')}
          >
            <div className="flex flex-col">
              <span className="text-3xl">
                {abreviateNumber(data.data[0].failed)}
              </span>
              <span className="text-sm">FAILED</span>
            </div>
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default JobFilters;
