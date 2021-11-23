import React, { useState } from 'react';
import useSWR from 'swr';
import JobsTableRow from 'src/components/JobsTableRow';
import arrowUp from 'src/svgs/chevron-up.svg';
import arrowDown from 'src/svgs/chevron-down.svg';

interface PropType {
  page: number;
}

type SortType = 'lastRunAt' | 'nextRunAt';

const JobsTable: React.FC<PropType> = ({ page }) => {
  const [selectAll, setSelectAll] = useState(false);
  const [sortBy, setSortBy] = useState<SortType>('lastRunAt');
  const [sortDesc, setSortDesc] = useState(true);
  const { data, error } = useSWR(
    `${
      process.env.REACT_APP_API_URL
    }/jobs?page=${page}&sortBy=${sortBy}&sortType=${sortDesc ? 'desc' : 'asc'}`
  );

  if (!data && !error) return null;

  const sortableColumnButton = (title: string, type: SortType) => (
    <div
      className="flex flex-row items-center justify-between cursor-pointer"
      onClick={() => {
        if (type === sortBy) {
          setSortDesc(!sortDesc);
        } else {
          setSortBy(type);
        }
      }}
    >
      <div>{title}</div>
      {type === sortBy && (
        <img src={sortDesc ? arrowDown : arrowUp} width={20} />
      )}
    </div>
  );

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
            <th>{sortableColumnButton('Last Run At', 'lastRunAt')}</th>
            <th>{sortableColumnButton('Next Run At', 'nextRunAt')}</th>
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
