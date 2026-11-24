import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { SeatingTable } from '../../types';
import { useEventContext } from '../../context/EventContext';

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableToEdit?: SeatingTable | null;
  defaultEventId?: string;
}

export const TableModal: React.FC<TableModalProps> = ({
  isOpen,
  onClose,
  tableToEdit,
  defaultEventId,
}) => {
  const { addTable, updateTable, events, activeEventId } = useEventContext();

  const [eventId, setEventId] = useState('');
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState<number | ''>(8);
  const [shape, setShape] = useState<'Round' | 'Rectangular' | 'Long Banquet'>('Round');
  const [zone, setZone] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (tableToEdit) {
      setEventId(tableToEdit.eventId);
      setName(tableToEdit.name);
      setCapacity(tableToEdit.capacity);
      setShape(tableToEdit.shape);
      setZone(tableToEdit.zone || '');
    } else {
      const initialEvtId = defaultEventId || (activeEventId !== 'ALL' ? activeEventId : (events[0]?.id || ''));
      setEventId(initialEvtId);
      setName('');
      setCapacity(8);
      setShape('Round');
      setZone('Main Banquet Hall');
    }
    setErrors({});
  }, [tableToEdit, isOpen, defaultEventId, activeEventId, events]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!eventId) {
      newErrors.eventId = 'Please select an event for this table.';
    }

    if (!name.trim()) {
      newErrors.name = 'Table label or number is required.';
    }

    if (capacity === '' || Number(capacity) < 1 || !Number.isInteger(Number(capacity))) {
      newErrors.capacity = 'Please enter a valid seat capacity (at least 1).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (tableToEdit) {
      updateTable(tableToEdit.id, {
        eventId,
        name: name.trim(),
        capacity: Number(capacity),
        shape,
        zone: zone.trim() || 'General Seating Area',
      });
    } else {
      addTable({
        eventId,
        name: name.trim(),
        capacity: Number(capacity),
        shape,
        zone: zone.trim() || 'General Seating Area',
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tableToEdit ? 'Edit Seating Table' : 'Add Seating Table'}
      subtitle="Define table geometry, guest capacity, and venue arrangement zone"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Associated Event */}
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

        {/* Table Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
            Table Label / Number <span className="text-[#D98261]">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Table 1 - VIP Royal"
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

        {/* Capacity & Shape */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Seat Capacity <span className="text-[#D98261]">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={capacity}
              onChange={(e) => {
                setCapacity(e.target.value === '' ? '' : Number(e.target.value));
                if (errors.capacity) setErrors(prev => ({ ...prev, capacity: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border rounded-xl text-[#29231F] focus:outline-none transition-colors ${
                errors.capacity ? 'border-[#B96E42] bg-[#B96E42]/10' : 'border-[#E6D5C1] focus:border-[#D98261]'
              }`}
            />
            {errors.capacity && <p className="text-xs text-[#B96E42] mt-1">{errors.capacity}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Table Geometry
            </label>
            <select
              value={shape}
              onChange={(e) => setShape(e.target.value as any)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-xl focus:outline-none focus:border-[#D98261]"
            >
              <option value="Round">Round Table</option>
              <option value="Rectangular">Rectangular Table</option>
              <option value="Long Banquet">Long Banquet</option>
            </select>
          </div>
        </div>

        {/* Zone */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
            Zone / Area Location
          </label>
          <input
            type="text"
            placeholder="e.g. Stage Front Row, Garden Pavilion, Balcony"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
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
            {tableToEdit ? 'Save Table' : 'Add Table'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
