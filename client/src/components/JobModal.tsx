import { useCallback, useState } from 'react';
import ClipboardCheck from 'src/svgs/ClipboardCheck';
import ClipboardCopy from 'src/svgs/ClipboardCopy';
import { JobType } from 'src/types';
import Modal from 'src/components/Modal';

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

  if (!job) return null;

  return (
    <Modal id={id} onClose={onClose} title={title}>
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
    </Modal>
  );
};

export default JobModal;
