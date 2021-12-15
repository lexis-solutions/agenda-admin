import React, { useState } from 'react';
import { JobType, StatusType } from 'src/types';
import { formatRelativeTime } from 'src/utils/formatter';
import cx from 'classnames';
import Info from 'src/svgs/Info';
import Refresh from 'src/svgs/Refresh';
import Trash from 'src/svgs/Trash';

interface PropsType {
  job: JobType;
  onDeleteJobs: (ids: string[]) => void;
  onRequeueJobs: (ids: string[]) => void;
}

const statusColors = {
  repeating: 'bg-blue-400',
  scheduled: 'bg-blue-400',
  queued: 'bg-blue-800',
  completed: 'bg-green-500',
  failed: 'bg-red-500',
  running: 'bg-yellow-500',
};

const JobsTableRow: React.FC<PropsType> = ({
  job,
  onDeleteJobs,
  onRequeueJobs,
}) => {
  const [checked, setChecked] = useState(false);

  const lastRunAt = formatRelativeTime(job.job.lastRunAt);
  const nextRunAt = formatRelativeTime(job.job.nextRunAt);

  return (
    <tr>
      <th>
        <input
          type="checkbox"
          className="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
      </th>
      <td>
        <div className="flex flex-wrap">
          {Object.keys(job.status).map((status) => {
            if (!job.status[status as StatusType]) {
              return null;
            }

            return (
              <span
                className={cx(
                  'p-1 m-1 text-2xs text-primary-content rounded-sm',
                  statusColors[status as StatusType]
                )}
                key={status}
              >
                {status === 'repeating' ? job.job.repeatInterval : status}
              </span>
            );
          })}
        </div>
      </td>
      <td>{job.job.name}</td>
      <td>
        <div
          data-tip={
            job.job.nextRunAt && new Date(job.job.nextRunAt).toLocaleString()
          }
          className="tooltip"
        >
          {nextRunAt}
        </div>
      </td>
      <td>
        <div
          data-tip={
            job.job.lastRunAt && new Date(job.job.lastRunAt).toLocaleString()
          }
          className="tooltip"
        >
          {lastRunAt}
        </div>
      </td>
      <td>
        <div className="flex flex-wrap items-center justify-around">
          <a href={`#job-data${job.job._id}`} className="tab">
            <Info />
          </a>
          <div id={`job-data${job.job._id}`} className="modal">
            <div className="space-y-4 modal-box">
              <p className="text-2xl">{`Job data - ${job.job.name}`}</p>
              <p>{`Last Run At: ${new Date(
                job.job.lastRunAt
              ).toLocaleString()}`}</p>
              <p>{`Next Run At: ${new Date(
                job.job.nextRunAt
              ).toLocaleString()}`}</p>
              <p>Job Data</p>
              <div className="textarea textarea-bordered">
                <pre>
                  <code>{JSON.stringify(job.job.data, null, 2)}</code>
                </pre>
              </div>
              {job.job.failCount && (
                <>
                  <p className="font-bold text-red-500">
                    {`Fail Count: ${job.job.failCount}`}
                  </p>
                  <p className="font-bold text-red-500">
                    {`Reason: ${job.job.failReason}`}
                  </p>
                  <p className="font-bold text-red-500">
                    {`Failed At: ${new Date(
                      job.job.failedAt!
                    ).toLocaleString()}`}
                  </p>
                </>
              )}
              <div className="modal-action">
                <a href="#" className="btn">
                  Close
                </a>
              </div>
            </div>
          </div>
          <a href={`#requeue-job${job.job._id}`} className="tab">
            <Refresh />
          </a>
          <div id={`requeue-job${job.job._id}`} className="modal">
            <div className="space-y-4 modal-box">
              <p className="text-2xl">Requeue job?</p>
              <p>{`Name: ${job.job.name}`}</p>
              <div className="modal-action">
                <a
                  href="#"
                  className="btn btn-primary"
                  onClick={() => onRequeueJobs([job.job._id])}
                >
                  Requeue
                </a>
                <a href="#" className="btn">
                  Close
                </a>
              </div>
            </div>
          </div>
          <a href={`#delete-job${job.job._id}`} className="tab">
            <Trash />
          </a>
          <div id={`delete-job${job.job._id}`} className="modal">
            <div className="space-y-4 modal-box">
              <p className="text-2xl">Delete job?</p>
              <p>{`Name: ${job.job.name}`}</p>
              <div className="modal-action">
                <a
                  href="#"
                  className="btn btn-primary"
                  onClick={() => onDeleteJobs([job.job._id])}
                >
                  Delete
                </a>
                <a href="#" className="btn">
                  Close
                </a>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default JobsTableRow;
