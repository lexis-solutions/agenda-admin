import React, { useCallback, useEffect, useState } from 'react';
import JobsTableRow from 'src/components/JobsTableRow';
import SortableColumnButton from 'src/components/SortableColumnButton';
import { useJobsListContext } from 'src/hooks/useJobsListContext';
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
    selectFiltered,
    handleDeleteJobs,
    handleRequeueJobs,
  } = useJobsListContext();

  const [selectAll, setSelectAll] = useState(false);
  const [modalJob, setModalJob] = useState<JobType | null>(null);

  const formattedLastRunAt = formatLocalDateTime(modalJob?.job.lastRunAt);
  const formattedNextRunAt = formatLocalDateTime(modalJob?.job.nextRunAt);
  const formattedFailedAt = formatLocalDateTime(modalJob?.job.failedAt);

  const updateSelectedJobs = useCallback(
    (allAreSelected: boolean) => {
      setSelectAll(allAreSelected);
      if (!allAreSelected) {
        setSelected(new Set<string>());
      } else {
        const ids = data ? data[0].jobs.map((job) => job.job._id) : [];
        setSelected(new Set(ids));
      }
    },
    [data, setSelected]
  );

  useEffect(() => {
    if (data && selected.size !== data[0].jobs.length) {
      setSelectAll(false);
    }
  }, [selected, data]);

  useEffect(() => {
    updateSelectedJobs(selectFiltered);
  }, [selectFiltered, updateSelectedJobs]);

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
                  updateSelectedJobs(!selectAll);
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
      {modalJob && (
        <>
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
            <div className="h-48 overflow-scroll resize-y textarea textarea-bordered">
              <pre>
                <code>{JSON.stringify(modalJob?.job.data, null, 2)}</code>
              </pre>
            </div>
            {modalJob?.job.failCount && (
              <>
                <div className="font-bold text-red-500">
                  Fail Count: {modalJob?.job.failCount}
                </div>
                <div className="font-bold text-red-500">
                  Failed At: {formattedFailedAt}
                </div>
                <div className="font-bold text-red-500">Reason:</div>
                <div className="font-bold text-red-500">
                  <div className="h-48 overflow-scroll resize-y textarea textarea-bordered">
                    <pre>
                      <code>{modalJob?.job.failReason}</code>
                    </pre>
                  </div>
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
            title="Requeue job?"
            job={modalJob}
            onClose={() => setModalJob(null)}
          >
            <div className="modal-action">
              <a
                href="#!"
                className="btn btn-warning"
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
            title="Delete job?"
            job={modalJob}
            onClose={() => setModalJob(null)}
          >
            <div className="modal-action">
              <a
                href="#!"
                className="btn btn-error"
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
        </>
      )}
    </div>
  );
};

export default JobsTable;
