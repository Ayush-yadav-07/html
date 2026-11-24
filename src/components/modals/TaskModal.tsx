import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { useEventContext } from '../../context/EventContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  defaultEventId?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  defaultEventId,
}) => {
  const { addTask, updateTask, events, activeEventId } = useEventContext();

  const [eventId, setEventId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [status, setStatus] = useState<TaskStatus>('To Do');
  const [assignedTo, setAssignedTo] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (taskToEdit) {
      setEventId(taskToEdit.eventId);
      setName(taskToEdit.name);
      setDescription(taskToEdit.description);
      setDueDate(taskToEdit.dueDate);
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setAssignedTo(taskToEdit.assignedTo || '');
    } else {
      const initialEvtId = defaultEventId || (activeEventId !== 'ALL' ? activeEventId : (events[0]?.id || ''));
      setEventId(initialEvtId);
      setName('');
      setDescription('');
      setDueDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
      setPriority('Medium');
      setStatus('To Do');
      setAssignedTo('');
    }
    setErrors({});
  }, [taskToEdit, isOpen, defaultEventId, activeEventId, events]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!eventId) {
      newErrors.eventId = 'Please select an event for this task.';
    }

    if (!name.trim()) {
      newErrors.name = 'Task title is required.';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Task title must be at least 3 characters.';
    }

    if (!dueDate) {
      newErrors.dueDate = 'Due date is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        eventId,
        name: name.trim(),
        description: description.trim(),
        dueDate,
        priority,
        status,
        assignedTo: assignedTo.trim() || undefined,
      });
    } else {
      addTask({
        eventId,
        name: name.trim(),
        description: description.trim(),
        dueDate,
        priority,
        status,
        assignedTo: assignedTo.trim() || undefined,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edit Milestone Task' : 'Create New Milestone'}
      subtitle="Schedule checklist deliverables, target dates, assignees, and priority levels"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
            Associated Event <span className="text-[#D98261]">*</span>
          </label>
          <select
            value={eventId}
            onChange={(e) => {
              setEventId(e.target.value);
              if (errors.eventId) setErrors(prev => ({ ...prev, eventId: '' }));
            }}
            className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border rounded-xl text-[#29231F] focus:outline-none transition-colors ${
              errors.eventId ? 'border-[#B96E42] bg-[#B96E42]/10' : 'border-[#E6D5C1] focus:border-[#D98261]'
            }`}
          >
            {events.length === 0 && <option value="">No events available</option>}
            {events.map(evt => (
              <option key={evt.id} value={evt.id}>{evt.name}</option>
            ))}
          </select>
          {errors.eventId && <p className="text-xs text-[#B96E42] mt-1">{errors.eventId}</p>}
        </div>

        {/* Task Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
            Task Title <span className="text-[#D98261]">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Finalize Tasting Menu with Catering Chef"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
            }}
            className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border rounded-xl text-[#29231F] focus:outline-none transition-colors ${
              errors.name ? 'border-[#B96E42] bg-[#B96E42]/10' : 'border-[#E6D5C1] focus:border-[#D98261]'
            }`}
          />
          {errors.name && <p className="text-xs text-[#B96E42] mt-1">{errors.name}</p>}
        </div>

        {/* Priority & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Priority Level <span className="text-[#D98261]">*</span>
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-xl focus:outline-none focus:border-[#D98261]"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Progress Status <span className="text-[#D98261]">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-xl focus:outline-none focus:border-[#D98261]"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Due Date & Assignee */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Target Due Date <span className="text-[#D98261]">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                if (errors.dueDate) setErrors(prev => ({ ...prev, dueDate: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border rounded-xl text-[#29231F] focus:outline-none transition-colors ${
                errors.dueDate ? 'border-[#B96E42] bg-[#B96E42]/10' : 'border-[#E6D5C1] focus:border-[#D98261]'
              }`}
            />
            {errors.dueDate && <p className="text-xs text-[#B96E42] mt-1">{errors.dueDate}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Assigned Person / Team
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Singhania, Catering Lead"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-xl focus:outline-none focus:border-[#D98261]"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
            Task Description / Instructions
          </label>
          <textarea
            rows={3}
            placeholder="Specific deliverables, references, phone numbers or requirements..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-xl focus:outline-none focus:border-[#D98261]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6D5C1]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#483329] bg-[#F7F0E5] border border-[#E6D5C1] rounded-xl hover:bg-[#E6D5C1]/50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#D98261] hover:bg-[#B96E42] active:scale-98 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            {taskToEdit ? 'Save Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
