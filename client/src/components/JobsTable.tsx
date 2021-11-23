import React, { useState } from 'react';
import useSWR from 'swr';
import JobsTableRow from 'src/components/JobsTableRow';
import SortableColumnButton from './SortableColumnButton';
import { API_URL } from 'src/constants';

interface PropType {
  page: number;
}

type SortType = 'lastRunAt' | 'nextRunAt';

const JobsTable: React.FC<PropType> = ({ page }) => {
  const [selectAll, setSelectAll] = useState(false);
  const [sortBy, setSortBy] = useState<SortType>('lastRunAt');
  const [sortDesc, setSortDesc] = useState(true);
  const { data, error } = useSWR(
    `${API_URL}/jobs?page=${page}&sortBy=${sortBy}&sortType=${
      sortDesc ? 'desc' : 'asc'
    }`
  );

  if (!data && !error) return null;

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
          {data.jobs.map((job: any) => (
            <JobsTableRow job={job} key={job._id} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobsTable;
