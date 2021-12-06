import React, { useState } from 'react';
import JobsTableRow from 'src/components/JobsTableRow';
import SortableColumnButton from 'src/components/SortableColumnButton';
import { SortType } from 'src/types';

interface PropType {
  sortBy: SortType;
  setSortBy: (sortBy: SortType) => void;
  sortDesc: boolean;
  setSortDesc: (sortDesc: boolean) => void;
  data: any;
}

const JobsTable: React.FC<PropType> = ({
  sortBy,
  sortDesc,
  setSortBy,
  setSortDesc,
  data,
}) => {
  const [selectAll, setSelectAll] = useState(false);

  return (
    <div>
      <table className="table w-screen max-w-7xl">
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
          {data.map((job: any) => (
            <JobsTableRow job={job} key={job._id} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobsTable;
