import React, { useCallback } from 'react';
import { JobType, StatusType } from 'src/types';
import {
  formatLocalDateTime,
  formatRelativeDateTime,
} from 'src/utils/formatter';
import cx from 'classnames';
import Info from 'src/svgs/Info';
import Refresh from 'src/svgs/Refresh';
import Trash from 'src/svgs/Trash';
import { JOB_COLORS } from 'src/constants';
import { useJobsListContext } from 'src/hooks/useJobsListContext';

interface PropsType {
  job: JobType;
  setModalJob: (job: JobType) => void;
}

const JobsTableRow: React.FC<PropsType> = ({ job, setModalJob }) => {
  const { selected, setSelected } = useJobsListContext();

  const relativeLastRunAt = formatRelativeDateTime(job.job.lastRunAt);
  const relativeNextRunAt = formatRelativeDateTime(job.job.nextRunAt);

  const formattedLastRunAt = formatLocalDateTime(job.job.lastRunAt);
  const formattedNextRunAt = formatLocalDateTime(job.job.nextRunAt);

  const addJobToSelected = useCallback(
    (id: string) => {
      const newSet = new Set(selected);
      newSet.add(id);
      setSelected(newSet);
    },
    [selected, setSelected]
  );

  const removeJobFromSelected = useCallback(
    (id: string) => {
      const newSet = new Set(selected);
      newSet.delete(id);
      setSelected(newSet);
    },
    [selected, setSelected]
  );

  return (
    <tr>
      <th>
        <input
          type="checkbox"
          className="checkbox"
          checked={selected.has(job.job._id)}
          onChange={() =>
            selected.has(job.job._id)
              ? removeJobFromSelected(job.job._id)
              : addJobToSelected(job.job._id)
          }
        />
      </th>
      <td>
        <div className="flex flex-wrap">
          {Object.keys(job.status).map((status) => {
            if (!job.status[status as StatusType]) {
              return null;
            }

            return (
              <span
                className={cx(
                  'p-1 m-1 text-2xs text-primary-content rounded-sm',
                  JOB_COLORS[status as StatusType]
                )}
                key={status}
              >
                {status === 'repeating' ? job.job.repeatInterval : status}
              </span>
            );
          })}
        </div>
      </td>
      <td className="max-w-sm">
        <span className="whitespace-normal">{job.job.name}</span>
      </td>
      <td>
        <div data-tip={formattedNextRunAt} className="tooltip">
          {relativeNextRunAt}
        </div>
      </td>
      <td>
        <div data-tip={formattedLastRunAt} className="tooltip">
          {relativeLastRunAt}
        </div>
      </td>
      <td>
        <div className="flex flex-wrap">
          {/* Info button */}
          <a
            href="#job-data"
            className="btn btn-ghost no-animation"
            onClick={() => setModalJob(job)}
          >
            <Info />
          </a>
          {/* Requeue button */}
          <a
            href="#requeue-job"
            className="btn btn-ghost no-animation"
            onClick={() => setModalJob(job)}
          >
            <Refresh />
          </a>
          {/* Delete button */}
          <a
            href="#delete-job"
            className="btn btn-ghost no-animation"
            onClick={() => setModalJob(job)}
          >
            <Trash />
          </a>
        </div>
      </td>
    </tr>
  );
};

export default JobsTableRow;
