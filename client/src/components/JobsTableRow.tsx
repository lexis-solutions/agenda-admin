import React, { useState } from 'react';
import { JobType, StatusType } from 'src/types';
import {
  formatLocalDateTime,
  formatRelativeDateTime,
} from 'src/utils/formatter';
import cx from 'classnames';
import Info from 'src/svgs/Info';
import Refresh from 'src/svgs/Refresh';
import Trash from 'src/svgs/Trash';

interface PropsType {
  job: JobType;
  setModalJob: (job: JobType) => void;
}

const statusColors = {
  repeating: 'bg-blue-400',
  scheduled: 'bg-blue-400',
  queued: 'bg-blue-800',
  completed: 'bg-green-500',
  failed: 'bg-red-500',
  running: 'bg-yellow-500',
};

const JobsTableRow: React.FC<PropsType> = ({ job, setModalJob }) => {
  const [checked, setChecked] = useState(false);

  const relativeLastRunAt = formatRelativeDateTime(job.job.lastRunAt);
  const relativeNextRunAt = formatRelativeDateTime(job.job.nextRunAt);

  const formattedLastRunAt = formatLocalDateTime(job.job.lastRunAt);
  const formattedNextRunAt = formatLocalDateTime(job.job.nextRunAt);

  return (
    <tr>
      <th>
        <input
          type="checkbox"
          className="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
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
                  statusColors[status as StatusType]
                )}
                key={status}
              >
                {status === 'repeating' ? job.job.repeatInterval : status}
              </span>
            );
          })}
        </div>
      </td>
      <td>{job.job.name}</td>
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
            className="btn btn-ghost"
            onClick={() => setModalJob(job)}
          >
            <Info />
          </a>
          {/* Requeue button */}
          <a
            href="#requeue-job"
            className="btn btn-ghost"
            onClick={() => setModalJob(job)}
          >
            <Refresh />
          </a>
          {/* Delete button */}
          <a
            href="#delete-job"
            className="btn btn-ghost"
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
