import React, { useState } from 'react';
import JobsTableRow from 'src/components/JobsTableRow';
import SortableColumnButton from 'src/components/SortableColumnButton';
import { JobType, SortType } from 'src/types';
import { formatLocalDateTime } from 'src/utils/formatter';
import JobModal from './JobModal';

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
  const [modalJob, setModalJob] = useState<JobType | null>(null);

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
      <JobModal
        id="job-data"
        title="Job Info"
        job={modalJob}
        onClose={() => setModalJob(null)}
      >
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
          <a href="#!" onClick={() => setModalJob(null)} className="btn">
            Close
          </a>
        </div>
      </JobModal>
      {/* Requeue modal */}
      <JobModal
        id="requeue-job"
        title="Requeue Job"
        job={modalJob}
        onClose={() => setModalJob(null)}
      >
        <div className="modal-action">
          <a
            href="#!"
            className="btn btn-primary"
            onClick={() => {
              if (modalJob) {
                onRequeueJobs([modalJob.job._id]);
                setModalJob(null);
              }
            }}
          >
            Requeue
          </a>
          <a href="#!" onClick={() => setModalJob(null)} className="btn">
            Close
          </a>
        </div>
      </JobModal>
      {/* Delete modal */}
      <JobModal
        id="delete-job"
        title="Delete Job"
        job={modalJob}
        onClose={() => setModalJob(null)}
      >
        <div className="modal-action">
          <a
            href="#!"
            className="btn btn-warning"
            onClick={() => {
              if (modalJob) {
                onDeleteJobs([modalJob.job._id]);
                setModalJob(null);
              }
            }}
          >
            Delete
          </a>
          <a href="#!" onClick={() => setModalJob(null)} className="btn">
            Close
          </a>
        </div>
      </JobModal>
    </div>
  );
};

export default JobsTable;
