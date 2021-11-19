import React, { useState } from 'react';
import useSWR from 'swr';
import JobsTableRow from './JobsTableRow';

interface PropType {
  page: number;
}

const JobsTable: React.FC<PropType> = ({ page }) => {
  const [selectAll, setSelectAll] = useState(false);
  const { data, error } = useSWR(`http://localhost:4000/api/jobs?page=${page}`);

  if (!data && !error) return null;

  const renderJobsList = data.jobs.map((job: any) => (
    <JobsTableRow job={job} key={job._id} />
  ));

  return (
    <div>
      <table className="table w-full">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                className="checkbox"
                checked={selectAll}
                onChange={() => setSelectAll(!selectAll)}
              />
            </th>
            <th>Status</th>
            <th>Name</th>
            <th>Last Run</th>
            <th>Next Run</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{renderJobsList}</tbody>
      </table>
    </div>
  );
};

export default JobsTable;
