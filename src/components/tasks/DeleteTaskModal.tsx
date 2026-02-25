import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './DeleteTaskModal.css';

interface DeleteTaskModalProps {
    isOpen: boolean;
    taskTitle: string;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({
    isOpen,
    taskTitle,
    onClose,
    onConfirm
}) => {
    // Блок скролл body когда модалка открыта
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
            <div className="delete-modal-backdrop" onClick={onClose} />
            <div className="delete-modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="delete-modal-header">
                    <h2 className="delete-modal-title">Delete Task</h2>
                </div>
                <div className="delete-modal-content">
                    <p className="delete-confirm-text">
                        Вы хотите удалить "{taskTitle}"? 
                    </p>
                </div>
                <div className="delete-modal-actions">
                    <button className="delete-cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="delete-confirm-btn" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </>,
        document.body // Рендер
    );
};

export default DeleteTaskModal;