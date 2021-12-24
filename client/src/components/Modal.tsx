import { useEffect } from 'react';

interface PropsType {
  id: string;
  onClose?: () => void;
}

const closeModalOnEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    window.location.href = '#!';
  }
};

const Modal: React.FC<PropsType> = ({ id, onClose, children }) => {
  useEffect(() => {
    window.addEventListener('keydown', closeModalOnEsc);
    return () => window.removeEventListener('keydown', closeModalOnEsc);
  }, []);

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
