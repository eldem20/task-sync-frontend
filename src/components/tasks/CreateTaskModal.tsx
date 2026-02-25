import React, { useState } from 'react';
import './CreateTaskModal.css';

export type TaskPriority = 'low' | 'medium' | 'high';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (task: { name: string; priority: TaskPriority }) => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
    isOpen,
    onClose,
    onSubmit
}) => {
    const [taskName, setTaskName] = useState<string>('');
    const [priority, setPriority] = useState<TaskPriority>('medium');

    const handleSubmit = () => {

        if (!taskName.trim()) {

            return;
        }

        onSubmit({
            name: taskName.trim(),
            priority
        });


        setTaskName('');
        setPriority('medium');


        onClose();
    };

if (!isOpen) return null;

return (
  <>

    <div className="modal-backdrop" onClick={onClose} />
    

    <div className="modal-card">

      <div className="modal-header">
        <h2 className="modal-title">New Task</h2>
      </div>
      

      <div className="modal-content">
   
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Name"
            className="name-input"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">Priority</label>
          <div className="priority-buttons">
            <button
              type="button"
              className={`priority-btn high ${priority === 'high' ? 'active' : ''}`}
              onClick={() => setPriority('high')}
            >
              High
            </button>
            <button
              type="button"
              className={`priority-btn medium ${priority === 'medium' ? 'active' : ''}`}
              onClick={() => setPriority('medium')}
            >
              Medium
            </button>
            <button
              type="button"
              className={`priority-btn low ${priority === 'low' ? 'active' : ''}`}
              onClick={() => setPriority('low')}
            >
              Low
            </button>
          </div>
        </div>
      </div>
      
  
      <div className="modal-action">
        <button
          type="submit"
          className="submit-check-btn"
          onClick={handleSubmit}
          disabled={!taskName.trim()}
        >
          ✓
        </button>
      </div>
    </div>
  </>
);
};

export default CreateTaskModal;