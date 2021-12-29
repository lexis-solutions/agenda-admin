import cx from 'classnames';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { JOB_COLORS } from 'src/constants';
import { useJobsListContext } from 'src/hooks/useJobsListContext';
import { useJobsOverview } from 'src/hooks/useJobsOverview';
import XCircle from 'src/svgs/Backspace';
import { StatusType } from 'src/types';
import { abbreviateNumber } from 'src/utils/formatter';
import JobNamesAutocomplete from './JobNamesAutocomplete';

const DEBOUNCE_DELAY = 500;

const STATUS_BUTTONS: StatusType[] = [
  'scheduled',
  'queued',
  'running',
  'completed',
  'failed',
];

const JobFilters: React.FC = () => {
  const {
    name: jobName,
    setName: setJobName,
    property: jobProperty,
    setProperty: setJobProperty,
    value: jobValue,
    setValue: setJobValue,
    status: jobStatus,
    setStatus: setJobStatus,
    jobListUpdatedAt,
  } = useJobsListContext();

  const [term, setTerm] = useState('');
  const [property, setProperty] = useState('');
  const [value, setValue] = useState('');

  const { data, mutate: refreshOverview } = useJobsOverview({
    name: jobName,
    property: jobProperty,
    value: jobValue,
  });

  useEffect(() => setTerm(jobName), [jobName]);
  useEffect(() => setProperty(jobProperty), [jobProperty]);
  useEffect(() => setValue(jobValue), [jobValue]);
  useEffect(() => {
    refreshOverview();
  }, [refreshOverview, jobListUpdatedAt]);

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

  const handleClearFilters = () => {
    setJobName('');
    setJobProperty('');
    setJobValue('');
    setJobStatus('');
  };

  return (
    <div className="flex flex-col w-full space-y-4">
      <div className="flex flex-row space-x-4">
        <div className="form-control">
          <label className="label">
            <span>Job Name</span>
          </label>
          <JobNamesAutocomplete
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
          {STATUS_BUTTONS.map((name) => (
            <a
              key={name}
              className={cx(
                'tab h-16 transition-colors duration-200 flex-1',
                JOB_COLORS[name],
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
      <div>
        <button className="btn btn-ghost btn-sm" onClick={handleClearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default JobFilters;
