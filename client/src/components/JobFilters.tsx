import cx from 'classnames';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Autocomplete from 'react-autocomplete';
import { API_URL } from 'src/constants';
import { useJobsOverview } from 'src/hooks/useJobsOverview';
import XCircle from 'src/svgs/Backspace';
import { StatusType } from 'src/types';
import { abbreviateNumber } from 'src/utils/formatter';

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

const fetchNames = (term: string) =>
  fetch(`${API_URL}/autocomplete?autocomplete=${term}`).then((res) =>
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

  const { data } = useJobsOverview({
    name: jobName,
    property: jobProperty,
    value: jobValue,
  });

  useEffect(() => {
    fetchNames(term).then(({ data }) => setOptions(data));
  }, [term]);

  useEffect(() => setTerm(jobName), [jobName]);
  useEffect(() => setProperty(jobProperty), [jobProperty]);
  useEffect(() => setValue(jobValue), [jobValue]);

  const debouncedSetJobProperty = useMemo(
    () => debounce(setJobProperty, DEBOUNCE_DELAY),
    [setJobProperty]
  );

  const handlePropertyChange = useCallback(
    (val: string) => {
      setProperty(val);
      debouncedSetJobProperty(val);
    },
    [debouncedSetJobProperty]
  );

  const debouncedSetJobValue = useMemo(
    () =>
      debounce((val: string) => {
        setJobValue(val);
      }, DEBOUNCE_DELAY),
    [setJobValue]
  );

  const handleValueChange = useCallback(
    (val: string) => {
      setValue(val);
      debouncedSetJobValue(val);
    },
    [debouncedSetJobValue]
  );

  const handleStatusSelect = useCallback(
    (btnStatus: StatusType) => () =>
      setJobStatus(jobStatus !== btnStatus ? btnStatus : ''),
    [jobStatus, setJobStatus]
  );

  return (
    <div className="flex flex-col w-full space-y-4">
      <div className="flex flex-row space-x-4">
        <div className="form-control">
          <label className="label">
            <span>Job Name</span>
          </label>
          <Autocomplete
            menuStyle={{
              position: 'absolute',
              overflow: 'hidden',
              zIndex: 999,
              borderWidth: 2,
              borderRadius: 8,
              marginTop: 8,
            }}
            getItemValue={(item) => item.name}
            items={options}
            renderItem={(item, isHighlighted) => (
              <div
                key={item._id}
                className={cx('text-md p-2 border-b-2', {
                  'bg-base-200': isHighlighted,
                  'bg-base-100': !isHighlighted,
                })}
              >
                {item.name}
              </div>
            )}
            renderInput={(props) => {
              return (
                <div className="relative">
                  <input
                    {...props}
                    title={jobName}
                    className="input input-bordered"
                    placeholder="All jobs"
                  />
                  <button
                    onClick={() => setJobName('')}
                    className={cx('absolute right-0 m-2 btn-sm btn', {
                      hidden: !jobName,
                    })}
                  >
                    <XCircle />
                  </button>
                </div>
              );
            }}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onSelect={setJobName}
          />
        </div>
        <div className="form-control">
          <label className="label">Form Value</label>
          <div className="flex flex-row">
            <input
              className="rounded-r-none input input-bordered"
              type="text"
              placeholder="Property"
              value={property}
              onChange={(e) => handlePropertyChange(e.target.value)}
            />
            <span className="px-4 mx-2 text-4xl text-center select-none bg-primary text-primary-content">
              =
            </span>
            <input
              className="rounded-l-none input input-bordered"
              type="text"
              placeholder="Value"
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
            />
          </div>
        </div>
      </div>
      {!!data?.data.length && (
        <div className="flex w-full overflow-hidden rounded-box tabs">
          {STATUS_BUTTONS.map(({ name, color }) => (
            <a
              key={name}
              className={cx(
                'tab h-16 transition-colors duration-200 flex-1',
                color,
                {
                  'bg-opacity-25': jobStatus && jobStatus !== name,
                  'tab-active bg-opacity-100': jobStatus === name,
                }
              )}
              onClick={handleStatusSelect(name)}
            >
              <div className="flex flex-col text-primary-content">
                <span className="text-3xl font-bold">
                  {abbreviateNumber(data.data[0][name])}
                </span>
                <span className="text-sm">{name}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobFilters;
