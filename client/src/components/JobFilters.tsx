import React, { useCallback, useEffect, useMemo, useState } from 'react';

import InputField from './InputField';
import JobNamesAutocomplete from './JobNamesAutocomplete';
import { debounce } from 'lodash';
import { useJobsListContext } from 'src/hooks/useJobsListContext';
import Overview from './Overview';

const DEBOUNCE_DELAY = 500;

const JobFilters: React.FC = () => {
  const {
    name: jobName,
    setName: setJobName,
    property: jobProperty,
    setProperty: setJobProperty,
    value: jobValue,
    setValue: setJobValue,
    setStatus: setJobStatus,
    refreshInterval,
    setRefreshInterval,
  } = useJobsListContext();

  const [term, setTerm] = useState('');
  const [property, setProperty] = useState('');
  const [value, setValue] = useState('');
  const [refreshRate, setRefreshRate] = useState(refreshInterval);

  useEffect(() => setTerm(jobName), [jobName]);
  useEffect(() => setProperty(jobProperty), [jobProperty]);
  useEffect(() => setValue(jobValue), [jobValue]);
  useEffect(() => setRefreshRate(refreshInterval), [refreshInterval]);

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

  const debouncedSetRefreshInterval = useMemo(
    () =>
      debounce((i: number) => {
        setRefreshInterval(i);
      }, DEBOUNCE_DELAY),
    [setRefreshInterval]
  );

  const handleRefreshIntervalChange = useCallback(
    (i: number) => {
      setRefreshRate(i);
      debouncedSetRefreshInterval(i);
    },
    [debouncedSetRefreshInterval, setRefreshRate]
  );

  const handleClearFilters = () => {
    setJobName('');
    setJobProperty('');
    setJobValue('');
    setJobStatus('');
  };

  return (
    <div className="flex flex-col w-full space-y-4">
      <div className="flex flex-row items-end space-x-4">
        <div className="flex-1 form-control">
          <label className="label">
            <span>Job Name</span>
          </label>
          <JobNamesAutocomplete
            renderInput={(props) => (
              <InputField
                showButton={!!jobName}
                onClear={() => setJobName('')}
                inputProps={{
                  title: jobName,
                  placeholder: 'All jobs',
                  ...props,
                }}
              />
            )}
            menuStyle={{
              top: 85,
              left: 0,
              maxWidth: 500,
              maxHeight: 600,
              overflowY: 'scroll',
            }}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onSelect={setJobName}
          />
        </div>
        <div className="flex-1 form-control">
          <label className="label">Form Value</label>
          <div className="flex flex-row">
            <InputField
              className="rounded-r-none"
              showButton={!!property}
              onClear={() => setJobProperty('')}
              inputProps={{
                type: 'text',
                value: property,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  handlePropertyChange(e.target.value),
                placeholder: 'Property',
              }}
            />
            <span className="px-4 mx-2 text-4xl text-center select-none bg-base-300 text-primary-content">
              =
            </span>
            <InputField
              className="rounded-l-none"
              showButton={!!value}
              onClear={() => setJobValue('')}
              inputProps={{
                type: 'text',
                value: value,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  handleValueChange(e.target.value),
                placeholder: 'Value',
              }}
            />
          </div>
        </div>
        <div className="flex-1 form-control">
          <label className="label">Refresh Interval (seconds)</label>
          <InputField
            showButton={false}
            onClear={() => null}
            inputProps={{
              type: 'number',
              min: 1,
              value: +refreshRate / 1000,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                handleRefreshIntervalChange(+e.target.value * 1000),
              placeholder: 'Refresh interval in seconds',
            }}
          />
        </div>
        <button className="btn btn-ghost" onClick={handleClearFilters}>
          Clear Filters
        </button>
      </div>
      <Overview />
    </div>
  );
};

export default JobFilters;
