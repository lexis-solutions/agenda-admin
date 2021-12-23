import React, { useContext, useEffect, useState } from 'react';
import JobsTableRow from 'src/components/JobsTableRow';
import SortableColumnButton from 'src/components/SortableColumnButton';
import { JobsListContext } from 'src/context/JobsListContext';
import { JobType } from 'src/types';
import { formatLocalDateTime } from 'src/utils/formatter';
import JobModal from './JobModal';

const JobsTable: React.FC = () => {
  const {
    data,
    sortBy,
    setSortBy,
    sortDesc,
    setSortDesc,
    selected,
    setSelected,
    handleDeleteJobs,
    handleRequeueJobs,
  } = useContext(JobsListContext)!;

  const [selectAll, setSelectAll] = useState(false);
  const [modalJob, setModalJob] = useState<JobType | null>(null);

  const formattedLastRunAt = formatLocalDateTime(modalJob?.job.lastRunAt);
  const formattedNextRunAt = formatLocalDateTime(modalJob?.job.nextRunAt);
  const formattedFailedAt = formatLocalDateTime(modalJob?.job.failedAt);

  useEffect(() => {
    if (data && selected.size !== data[0].jobs.length) {
      setSelectAll(false);
    }
  }, [selected, data]);

  if (!data) return null;

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
                onChange={() => {
                  if (selectAll) {
                    setSelected(new Set<string>());
                  } else {
                    const ids = data
                      ? data[0].jobs.map((job) => job.job._id)
                      : [];
                    setSelected(new Set(ids));
                  }
                  setSelectAll(!selectAll);
                }}
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
          {data[0].jobs.map((job: JobType) => (
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
                handleRequeueJobs([modalJob.job._id]);
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
                handleDeleteJobs([modalJob.job._id]);
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
