import React, { useState } from 'react';
import { relativeTimeFormatter } from 'src/utils/formatter';

type StatusType =
  | 'repeating'
  | 'scheduled'
  | 'queued'
  | 'completed'
  | 'failed'
  | 'running';

interface JobStatusType {
  repeating: boolean;
  scheduled: boolean;
  queued: boolean;
  completed: boolean;
  failed: boolean;
  running: boolean;
}

interface PropsType {
  job: {
    _id: string;
    name: string;
    lastRunAt: string;
    nextRunAt: string;
    repeatInterval: string;
    status: JobStatusType;
  };
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

  const lastRunAt = relativeTimeFormatter(job.lastRunAt);
  const nextRunAt = relativeTimeFormatter(job.nextRunAt);

  const renderJobActions = () => (
    <div className="flex flex-wrap items-center justify-center">
      <button className="flex-1 m-1 text-white bg-green-600 rounded-box btn-sm">
        Info
      </button>
      <button className="flex-1 m-1 text-white bg-blue-500 rounded-box btn-sm">
        Reque
      </button>
      <button className="flex-1 m-1 text-white bg-red-500 rounded-box btn-sm">
        Delete
      </button>
    </div>
  );

  const renderJobStatus = () => (
    <div className="flex flex-wrap">
      {Object.keys(job.status).map((status) => {
        if (!job.status[status as StatusType]) {
          return null;
        }

        return (
          <span
            className={`p-1 m-1 text-white bg-gray-500 text-2xs rounded-sm ${
              statusColors[status as StatusType]
            }`}
            key={status}
          >
            {status === 'repeating' ? job.repeatInterval : status}
          </span>
        );
      })}
    </div>
  );

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
      <td>{renderJobStatus()}</td>
      <td>{job.name}</td>
      <td>
        <div
          data-tip={job.lastRunAt && new Date(job.lastRunAt).toLocaleString()}
          className="tooltip"
        >
          {lastRunAt}
        </div>
      </td>
      <td>
        <div
          data-tip={job.nextRunAt && new Date(job.nextRunAt).toLocaleString()}
          className="tooltip"
        >
          {nextRunAt}
        </div>
      </td>
      <td>{renderJobActions()}</td>
    </tr>
  );
};

export default JobsTableRow;
