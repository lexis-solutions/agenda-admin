import React, { useState } from 'react';
import { JobType, StatusType } from 'src/types';
import { formatRelativeTime } from 'src/utils/formatter';
interface PropsType {
  job: JobType;
}

const statusColors = {
  repeating: 'bg-blue-400',
  scheduled: 'bg-blue-400',
  queued: 'bg-blue-800',
  completed: 'bg-green-500',
  failed: 'bg-red-500',
  running: 'bg-yellow-500',
};

const JobsTableRow: React.FC<PropsType> = ({ job }) => {
  const [checked, setChecked] = useState(false);

  const lastRunAt = formatRelativeTime(job.job.lastRunAt);
  const nextRunAt = formatRelativeTime(job.job.nextRunAt);

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
                className={`p-1 m-1 text-white text-2xs rounded-sm ${
                  statusColors[status as StatusType]
                }`}
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
        <div
          data-tip={
            job.job.nextRunAt && new Date(job.job.nextRunAt).toLocaleString()
          }
          className="tooltip"
        >
          {nextRunAt}
        </div>
      </td>
      <td>
        <div
          data-tip={
            job.job.lastRunAt && new Date(job.job.lastRunAt).toLocaleString()
          }
          className="tooltip"
        >
          {lastRunAt}
        </div>
      </td>
      <td>
        <div className="flex flex-wrap items-center justify-center">
          <button className="flex-1 m-1 text-white bg-green-600 rounded-box btn-sm">
            Info
          </button>
          <button className="flex-1 m-1 text-white bg-blue-500 rounded-box btn-sm">
            Requeue
          </button>
          <button className="flex-1 m-1 text-white bg-red-500 rounded-box btn-sm">
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default JobsTableRow;
