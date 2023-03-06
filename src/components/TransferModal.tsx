import React, { FC, useState } from 'react';
import classNames from 'classnames';
import '../styles/containers/TransferModal.scss';

type TransferModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

const TransferModal: FC<TransferModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  React.useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const modalClass = classNames({
    modal: true,
    'modal--open': isOpen,
    'modal--mobile': isMobile,
  });

  return (
    <div className={modalClass}>
      <div
        className="modal__overlay"
        role="presentation"
        onClick={onClose}
        onKeyDown={onClose}
      />
      <div className="modal__container">
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button type="submit" className="modal__close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal__content">{children}</div>
      </div>
    </div>
  );
};

export default TransferModal;
