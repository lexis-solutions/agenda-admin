import { useCallback, useEffect } from 'react';
import { JOB_COLORS } from 'src/constants';
import { abbreviateNumber } from 'src/utils/formatter';
import cx from 'classnames';
import { StatusType } from 'src/types';
import { useJobsListContext } from 'src/hooks/useJobsListContext';
import { useJobsOverview } from 'src/hooks/useJobsOverview';

const STATUS_BUTTONS: StatusType[] = [
  'scheduled',
  'queued',
  'running',
  'completed',
  'failed',
];

const Overview = () => {
  const { name, property, value, status, setStatus, jobListUpdatedAt } =
    useJobsListContext();

  const { data, mutate: refreshOverview } = useJobsOverview({
    name,
    property,
    value,
  });

  useEffect(() => {
    refreshOverview();
  }, [refreshOverview, jobListUpdatedAt]);

  const handleStatusSelect = useCallback(
    (btnStatus: StatusType) => () =>
      setStatus(status !== btnStatus ? btnStatus : ''),
    [status, setStatus]
  );

  return (
    <div className="flex w-full overflow-hidden rounded-box tabs">
      {STATUS_BUTTONS.map((name) => (
        <a
          key={name}
          className={cx(
            'tab h-16 transition-colors duration-200 flex-1',
            JOB_COLORS[name],
            {
              'bg-opacity-25': status && status !== name,
              'tab-active bg-opacity-100': status === name,
            }
          )}
          onClick={handleStatusSelect(name)}
        >
          <div className="flex flex-col text-primary-content">
            <span className="text-3xl font-bold">
              {abbreviateNumber(
                data && data.data.length ? data.data[0][name] : 0
              )}
            </span>
            <span className="text-sm">{name}</span>
          </div>
        </a>
      ))}
    </div>
  );
};

export default Overview;
