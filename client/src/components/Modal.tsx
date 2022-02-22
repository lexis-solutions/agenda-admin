import { useEffect } from 'react';

interface PropsType {
  id: string;
  title: string;
  onClose?: () => void;
}

const Modal: React.FC<PropsType> = ({ id, onClose, title, children }) => {
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
      onMouseDown={() => {
        window.location.href = '#!';
        if (onClose) onClose();
      }}
    >
      <div
        className="space-y-4 modal-box"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="text-2xl">{title}</div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
