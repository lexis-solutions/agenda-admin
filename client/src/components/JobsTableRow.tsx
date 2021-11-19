import React, { useState } from 'react';

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
      <td>{job.lastRunAt}</td>
      <td>{job.nextRunAt}</td>
      <td>{renderJobActions()}</td>
    </tr>
  );
};

export default JobsTableRow;
