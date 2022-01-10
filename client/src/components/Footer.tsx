import { useCallback, useState } from 'react';
import cx from 'classnames';
import { deleteJobsByQuery, requeueJobsByQuery } from 'src/api';
import PaginationButtons from 'src/components/PaginationButtons';
import Modal from 'src/components/Modal';
import { useJobsListContext } from 'src/hooks/useJobsListContext';

const Footer: React.FC = () => {
  const {
    data,
    refreshJobsList,
    name,
    property,
    value,
    status,
    selectFiltered,
    setSelectFiltered,
    selected,
    setSelected,
    handleDeleteJobs,
    handleRequeueJobs,
  } = useJobsListContext();

  const [renderModals, setRenderModals] = useState(false);
  const selectedJobsCount =
    selectFiltered && data && data[0].pages[0]
      ? data[0].pages[0].itemsCount
      : selected.size;
  const jobsMsg = `${selectedJobsCount} ${
    selectedJobsCount === 1 ? 'job' : 'jobs'
  }`;

  const handleBulkDelete = useCallback(async () => {
    if (selectFiltered) {
      await deleteJobsByQuery({ name, property, value, status });
      setSelectFiltered(false);
      refreshJobsList();
    } else {
      await handleDeleteJobs(Array.from(selected));
      setSelected(new Set());
    }
  }, [
    refreshJobsList,
    handleDeleteJobs,
    selectFiltered,
    setSelectFiltered,
    selected,
    setSelected,
    name,
    property,
    value,
    status,
  ]);

  const handleBulkRequeue = useCallback(async () => {
    if (selectFiltered) {
      await requeueJobsByQuery({ name, property, value, status });
      setSelectFiltered(false);
      refreshJobsList();
    } else {
      await handleRequeueJobs(Array.from(selected));
      setSelected(new Set());
    }
  }, [
    refreshJobsList,
    handleRequeueJobs,
    selectFiltered,
    selected,
    name,
    property,
    value,
    status,
    setSelected,
    setSelectFiltered,
  ]);

  if (!data) return null;

  return (
    <div className="fixed px-4 bottom-0 z-10 flex flex-row items-center justify-between w-full max-w-screen-xl p-2 mx-auto border-t bg-base-100">
      <div className="flex flex-row items-center space-x-1">
        <div>{jobsMsg} selected</div>
        <button
          className={cx('btn btn-link btn-xs')}
          onClick={() => setSelectFiltered(!selectFiltered)}
        >
          {selectFiltered ? 'Unselect All' : 'Select All'}
        </button>
        {selectedJobsCount > 0 && (
          <a
            href="#bulk-requeue"
            className="btn btn-sm btn-ghost text-secondary"
            onClick={() => setRenderModals(true)}
          >
            Requeue Selected
          </a>
        )}
        {selectedJobsCount > 0 && (
          <a
            href="#bulk-delete"
            className="btn btn-sm btn-ghost text-warning"
            onClick={() => setRenderModals(true)}
          >
            Delete Selected
          </a>
        )}
        {renderModals && (
          <>
            {/* Bulk requeue modal */}
            <Modal id="bulk-requeue" onClose={() => setRenderModals(false)}>
              <div className="text-xl">Requeue {jobsMsg}</div>
              <div className="modal-action">
                <a
                  href="#!"
                  className="btn btn-primary"
                  onClick={() => {
                    handleBulkRequeue();
                    setRenderModals(false);
                  }}
                >
                  Requeue
                </a>
                <a
                  href="#!"
                  className="btn"
                  onClick={() => setRenderModals(false)}
                >
                  Close
                </a>
              </div>
            </Modal>
            {/* Bulk delete modal */}
            <Modal id="bulk-delete" onClose={() => setRenderModals(false)}>
              <div className="text-xl">Delete {jobsMsg}</div>
              <div className="modal-action">
                <a
                  href="#!"
                  className="btn btn-warning"
                  onClick={() => {
                    handleBulkDelete();
                    setRenderModals(false);
                  }}
                >
                  Delete
                </a>
                <a
                  href="#!"
                  className="btn"
                  onClick={() => setRenderModals(false)}
                >
                  Close
                </a>
              </div>
            </Modal>
          </>
        )}
      </div>
      <PaginationButtons />
    </div>
  );
};

export default Footer;
