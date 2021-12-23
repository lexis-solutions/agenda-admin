import { useContext, useCallback } from 'react';
import cx from 'classnames';
import { deleteJobsByQuery, requeueJobsByQuery } from 'src/api';
import PaginationButtons from 'src/components/PaginationButtons';
import { JobsListContext } from 'src/context/JobsListContext';
import Modal from 'src/components/Modal';

const Footer: React.FC = () => {
  const {
    data,
    mutate,
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
  } = useContext(JobsListContext)!;

  const handleBulkDelete = useCallback(async () => {
    if (selectFiltered) {
      await deleteJobsByQuery({ name, property, value, status });
      setSelectFiltered(false);
      mutate();
    } else {
      await handleDeleteJobs(Array.from(selected));
      setSelected(new Set());
    }
  }, [
    mutate,
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
      mutate();
    } else {
      await handleRequeueJobs(Array.from(selected));
      setSelected(new Set());
    }
  }, [
    mutate,
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
    <div className="sticky bottom-0 z-10 flex flex-row items-center justify-between w-full p-2 border-t bg-base-100">
      <PaginationButtons />
      <div className="flex flex-row items-center space-x-2">
        <div>
          {`${
            selectFiltered && data[0].pages[0]
              ? data[0].pages[0].itemsCount
              : selected.size
          } jobs selected`}
        </div>
        <button
          className={cx('btn btn-sm', {
            'btn-ghost text-primary': !selectFiltered,
            'bg-primary text-base-100': selectFiltered,
          })}
          onClick={() => setSelectFiltered(!selectFiltered)}
        >
          {selectFiltered ? 'Unselect All' : 'Select All'}
        </button>
        <a href="#bulk-requeue" className="btn btn-sm btn-ghost text-secondary">
          Requeue Selected
        </a>
        <a href="#bulk-delete" className="btn btn-sm btn-ghost text-warning">
          Delete Selected
        </a>
        {/* Bulk requeue modal */}
        <Modal id="bulk-requeue">
          <div className="text-xl">
            {`Requeue ${
              selectFiltered && data[0].pages[0]
                ? data[0].pages[0].itemsCount
                : selected.size
            } jobs?`}
          </div>
          <div className="modal-action">
            <a
              href="#!"
              className="btn btn-primary"
              onClick={handleBulkRequeue}
            >
              Requeue
            </a>
            <a href="#!" className="btn">
              Close
            </a>
          </div>
        </Modal>
        {/* Bulk delete modal */}
        <Modal id="bulk-delete">
          <div className="text-xl">
            {`Delete ${
              selectFiltered && data[0].pages[0]
                ? data[0].pages[0].itemsCount
                : selected.size
            } jobs?`}
          </div>
          <div className="modal-action">
            <a href="#!" className="btn btn-warning" onClick={handleBulkDelete}>
              Delete
            </a>
            <a href="#!" className="btn">
              Close
            </a>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Footer;
