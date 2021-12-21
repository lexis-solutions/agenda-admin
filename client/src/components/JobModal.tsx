import { useCallback, useEffect, useState } from 'react';
import ClipboardCheck from 'src/svgs/ClipboardCheck';
import ClipboardCopy from 'src/svgs/ClipboardCopy';
import { JobType } from 'src/types';

interface PropsType {
  id: string;
  title: string;
  job: JobType | null;
  onClose: () => void;
}

const JobModal: React.FC<PropsType> = ({
  id,
  title,
  job,
  children,
  onClose,
}) => {
  const [copied, setCopied] = useState<'name' | 'id' | null>(null);

  const handleCopy = useCallback(
    (field: 'name' | 'id' | null, value: string) => {
      setCopied(field);
      navigator.clipboard.writeText(value);
    },
    [setCopied]
  );

  const closeModal = useCallback(() => {
    window.location.href = '#!';
    onClose();
  }, [onClose]);

  useEffect(() => {
    const closeModalOnEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    setCopied(null);
    window.addEventListener('keydown', closeModalOnEsc);
    return () => window.removeEventListener('keydown', closeModalOnEsc);
  }, [job, closeModal]);

  if (!job) return null;

  return (
    <div id={id} className="modal" onClick={() => closeModal()}>
      <div className="space-y-4 modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="text-2xl">{title}</div>
        <div className="flex flex-row">
          ID: {job.job._id}
          <button
            className="ml-2 tooltip btn btn-xs btn-ghost btn-square"
            data-tip="Copy ID"
            onClick={() => handleCopy('id', job.job._id)}
          >
            {copied === 'id' ? (
              <ClipboardCheck className="text-success" />
            ) : (
              <ClipboardCopy />
            )}
          </button>
        </div>
        <div className="flex flex-row">
          Name: {job?.job.name}
          <button
            className="ml-2 tooltip btn btn-xs btn-ghost btn-square"
            data-tip="Copy Name"
            onClick={() => handleCopy('name', job.job.name)}
          >
            {copied === 'name' ? (
              <ClipboardCheck className="text-success" />
            ) : (
              <ClipboardCopy />
            )}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default JobModal;
