import React, { useState } from 'react';
import { JobType, StatusType } from 'src/types';
import {
  formatLocalDateTime,
  formatRelativeDateTime,
} from 'src/utils/formatter';
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

  const relativeLastRunAt = formatRelativeDateTime(job.job.lastRunAt);
  const relativeNextRunAt = formatRelativeDateTime(job.job.nextRunAt);

  const formattedLastRunAt = formatLocalDateTime(job.job.lastRunAt);
  const formattedNextRunAt = formatLocalDateTime(job.job.nextRunAt);
  const formattedFailedAt = formatLocalDateTime(job.job.failedAt);

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
        <div data-tip={formattedNextRunAt} className="tooltip">
          {relativeNextRunAt}
        </div>
      </td>
      <td>
        <div data-tip={formattedLastRunAt} className="tooltip">
          {relativeLastRunAt}
        </div>
      </td>
      <td>
        <div className="flex flex-wrap">
          {/* Info button */}
          <a href={`#job-data@${job.job._id}`} className="btn btn-ghost">
            <Info />
          </a>
          {/* Requeue button */}
          <a href={`#requeue-job@${job.job._id}`} className="btn btn-ghost">
            <Refresh />
          </a>
          {/* Delete button */}
          <a href={`#delete-job@${job.job._id}`} className="btn btn-ghost">
            <Trash />
          </a>
          {/* Info modal */}
          <div id={`job-data@${job.job._id}`} className="modal">
            <div className="space-y-4 modal-box">
              <div className="text-2xl">{`Job data - ${job.job.name}`}</div>
              <div>Last Run At: {formattedLastRunAt}</div>
              <div>Next Run At: {formattedNextRunAt}</div>
              <div>Job Data:</div>
              <div className="textarea textarea-bordered">
                <pre className="overflow-scroll">
                  <code>{JSON.stringify(job.job.data, null, 2)}</code>
                </pre>
              </div>
              {job.job.failCount && (
                <>
                  <div className="font-bold text-red-500">
                    {`Fail Count: ${job.job.failCount}`}
                  </div>
                  <div className="font-bold text-red-500">
                    {`Reason: ${job.job.failReason}`}
                  </div>
                  <div className="font-bold text-red-500">
                    Failed At: {formattedFailedAt}
                  </div>
                </>
              )}
              <div className="modal-action">
                <a href="#" className="btn">
                  Close
                </a>
              </div>
            </div>
          </div>
          {/* Requeue modal */}
          <div id={`requeue-job@${job.job._id}`} className="modal">
            <div className="space-y-4 modal-box">
              <div className="text-2xl">Requeue job</div>
              <div>{`ID: ${job.job._id}`}</div>
              <div>{`Name: ${job.job.name}`}</div>
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
          {/* Delete modal */}
          <div id={`delete-job@${job.job._id}`} className="modal">
            <div className="space-y-4 modal-box">
              <div className="text-2xl">Delete job</div>
              <div>{`ID: ${job.job._id}`}</div>
              <div>{`Name: ${job.job.name}`}</div>
              <div className="modal-action">
                <a
                  href="#"
                  className="btn btn-warning"
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
