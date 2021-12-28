import { useEffect } from 'react';

interface PropsType {
  id: string;
  onClose?: () => void;
}

const Modal: React.FC<PropsType> = ({ id, onClose, children }) => {
  useEffect(() => {
    const closeModalOnEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.location.href = '#!';
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', closeModalOnEsc);
    return () => window.removeEventListener('keydown', closeModalOnEsc);
  }, [onClose]);

  return (
    <div
      id={id}
      className="modal"
      onClick={() => {
        window.location.href = '#!';
        if (onClose) onClose();
      }}
    >
      <div className="space-y-4 modal-box" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
