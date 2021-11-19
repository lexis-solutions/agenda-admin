import React from 'react';
import useSWR from 'swr';

const JobsTable = () => {
  const { data, error } = useSWR('http://localhost:4000/api/jobs');

  if (!data && !error) return null;

  const renderJobActions = () => (
    <>
      <button className="mx-1 text-white bg-green-500 btn-sm">Info</button>
      <button className="mx-1 text-white bg-blue-500 btn-sm">Reque</button>
      <button className="mx-1 text-white bg-red-500 btn-sm">Delete</button>
    </>
  );

  const renderJobsList = data.jobs.map((job: any) => (
    <tr key={job._id}>
      <th>
        <input type="checkbox" className="checkbox" />
      </th>
      <td></td>
      <td>{job.name}</td>
      <td>{job.lastRunAt}</td>
      <td>{job.nextRunAt}</td>
      <td>{renderJobActions()}</td>
    </tr>
  ));

  return (
    <div>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Select All</th>
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
