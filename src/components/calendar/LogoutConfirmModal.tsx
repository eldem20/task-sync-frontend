// frontend/src/components/modals/LogoutConfirmModal.tsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './LogoutConfirmModal.css';

interface LogoutConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = '';
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <>
            <div className="logout-modal-backdrop" onClick={onClose} />
            <div className="logout-modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="logout-modal-header">
                    <h2 className="logout-modal-title">Выход из системы</h2>
                </div>
                <div className="logout-modal-content">
                    <p className="logout-confirm-text">
                        Вы действительно хотите выйти?
                    </p>
                </div>
                <div className="logout-modal-actions">
                    <button className="logout-cancel-btn" onClick={onClose}>
                        Отмена
                    </button>
                    <button className="logout-confirm-btn" onClick={onConfirm}>
                        Выйти
                    </button>
                </div>
            </div>
        </>,
        document.body
    );
};

export default LogoutConfirmModal;