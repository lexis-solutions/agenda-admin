import React, { useState } from 'react';
import JobsTableRow from 'src/components/JobsTableRow';
import SortableColumnButton from 'src/components/SortableColumnButton';
import { JobType, SortType } from 'src/types';
import { formatLocalDateTime } from 'src/utils/formatter';

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
  data,
  sortBy,
  sortDesc,
  setSortBy,
  setSortDesc,
  onDeleteJobs,
  onRequeueJobs,
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [modalJob, setModalJob] = useState<JobType>();

  const formattedLastRunAt = formatLocalDateTime(modalJob?.job.lastRunAt);
  const formattedNextRunAt = formatLocalDateTime(modalJob?.job.nextRunAt);
  const formattedFailedAt = formatLocalDateTime(modalJob?.job.failedAt);

  return (
    <div className="w-full">
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
              key={job?.job._id}
              setModalJob={setModalJob}
            />
          ))}
        </tbody>
      </table>

      {/* Info modal */}
      <div id="job-data" className="modal">
        <div className="space-y-4 modal-box">
          <div className="text-2xl">Job data - {modalJob?.job.name}</div>
          <div>Last Run At: {formattedLastRunAt}</div>
          <div>Next Run At: {formattedNextRunAt}</div>
          <div>Job Data:</div>
          <div className="textarea textarea-bordered">
            <pre className="overflow-scroll">
              <code>{JSON.stringify(modalJob?.job.data, null, 2)}</code>
            </pre>
          </div>
          {modalJob?.job.failCount && (
            <>
              <div className="font-bold text-red-500">
                Fail Count: {modalJob?.job.failCount}
              </div>
              <div className="font-bold text-red-500">
                Reason: {modalJob?.job.failReason}
              </div>
              <div className="font-bold text-red-500">
                Failed At: {formattedFailedAt}
              </div>
            </>
          )}
          <div className="modal-action">
            <a href="#!" className="btn">
              Close
            </a>
          </div>
        </div>
      </div>
      {/* Requeue modal */}
      <div id="requeue-job" className="modal">
        <div className="space-y-4 modal-box">
          <div className="text-2xl">Requeue job</div>
          <div>ID: {modalJob?.job._id}</div>
          <div>Name: {modalJob?.job.name}</div>
          <div className="modal-action">
            <a
              href="#!"
              className="btn btn-primary"
              onClick={() => modalJob && onRequeueJobs([modalJob.job._id])}
            >
              Requeue
            </a>
            <a href="#!" className="btn">
              Close
            </a>
          </div>
        </div>
      </div>
      {/* Delete modal */}
      <div id="delete-job" className="modal">
        <div className="space-y-4 modal-box">
          <div className="text-2xl">Delete job</div>
          <div>ID: {modalJob?.job._id}</div>
          <div>Name: {modalJob?.job.name}</div>
          <div className="modal-action">
            <a
              href="#!"
              className="btn btn-warning"
              onClick={() => modalJob && onDeleteJobs([modalJob?.job._id])}
            >
              Delete
            </a>
            <a href="#!" className="btn">
              Close
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsTable;
