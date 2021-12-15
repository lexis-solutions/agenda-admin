import React, { useState } from 'react';
import JobsTableRow from 'src/components/JobsTableRow';
import SortableColumnButton from 'src/components/SortableColumnButton';
import { JobType, SortType } from 'src/types';

interface PropsType {
  sortBy: SortType;
  setSortBy: (sortBy: SortType) => void;
  sortDesc: boolean;
  setSortDesc: (sortDesc: boolean) => void;
  data: JobType[];
  onDeleteJobs: (ids: string[]) => void;
  onRequeueJobs: (ids: string[]) => void;
}

const JobsTable: React.FC<PropsType> = ({
  sortBy,
  sortDesc,
  setSortBy,
  setSortDesc,
  data,
  onDeleteJobs,
  onRequeueJobs,
}) => {
  const [selectAll, setSelectAll] = useState(false);

  return (
    <table className="table w-full table-zebra">
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
          <th>
            <SortableColumnButton
              title="Next Run At"
              column="nextRunAt"
              currentColumn={sortBy}
              setCurrentColumn={setSortBy}
              sortDesc={sortDesc}
              setSortDesc={setSortDesc}
            />
          </th>
          <th>
            <SortableColumnButton
              title="Last Run At"
              column="lastRunAt"
              currentColumn={sortBy}
              setCurrentColumn={setSortBy}
              sortDesc={sortDesc}
              setSortDesc={setSortDesc}
            />
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((job: JobType) => (
          <JobsTableRow
            job={job}
            key={job.job._id}
            onDeleteJobs={onDeleteJobs}
            onRequeueJobs={onRequeueJobs}
          />
        ))}
      </tbody>
    </table>
  );
};

export default JobsTable;
