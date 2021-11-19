import React, { useState } from 'react';
import getRelativeTime from '../utils/getRelativeTime';

interface PropsType {
  job: {
    _id: string;
    name: string;
    lastRunAt: string;
    nextRunAt: string;
  };
}

const JobsTableRow: React.FC<PropsType> = ({ job }) => {
  const [checked, setChecked] = useState(false);

  const lastRunAt = job.lastRunAt
    ? getRelativeTime(new Date(job.lastRunAt))
    : 'never';
  const nextRunAt = job.nextRunAt
    ? getRelativeTime(new Date(job.nextRunAt))
    : 'never';

  const renderJobActions = () => (
    <>
      <button className="mx-1 text-white bg-green-500 btn-sm">Info</button>
      <button className="mx-1 text-white bg-blue-500 btn-sm">Reque</button>
      <button className="mx-1 text-white bg-red-500 btn-sm">Delete</button>
    </>
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
      <td></td>
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
