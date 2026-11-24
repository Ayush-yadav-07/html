import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { EventItem, EventType, EventStatus } from '../../types';
import { useEventContext } from '../../context/EventContext';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: EventItem | null;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  eventToEdit,
}) => {
  const { addEvent, updateEvent } = useEventContext();

  const [name, setName] = useState('');
  const [type, setType] = useState<EventType>('Wedding');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [expectedGuests, setExpectedGuests] = useState<number | ''>('');
  const [budget, setBudget] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<EventStatus>('Upcoming');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (eventToEdit) {
      setName(eventToEdit.name);
      setType(eventToEdit.type);
      setDate(eventToEdit.date);
      setTime(eventToEdit.time);
      setVenue(eventToEdit.venue);
      setExpectedGuests(eventToEdit.expectedGuests);
      setBudget(eventToEdit.budget);
      setDescription(eventToEdit.description);
      setStatus(eventToEdit.status);
    } else {
      setName('');
      setType('Wedding');
      setDate(new Date().toISOString().split('T')[0]);
      setTime('18:00');
      setVenue('');
      setExpectedGuests(150);
      setBudget(500000);
      setDescription('');
      setStatus('Upcoming');
    }
    setErrors({});
  }, [eventToEdit, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Event name is required.';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Event name must be at least 3 characters.';
    }

    if (!date) {
      newErrors.date = 'Event date is required.';
    }

    if (!time) {
      newErrors.time = 'Start time is required.';
    }

    if (!venue.trim()) {
      newErrors.venue = 'Venue location is required.';
    }

    if (expectedGuests === '' || Number(expectedGuests) <= 0) {
      newErrors.expectedGuests = 'Expected guests must be greater than 0.';
    }

    if (budget === '' || Number(budget) <= 0) {
      newErrors.budget = 'Allocated budget must be greater than ₹0.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (eventToEdit) {
      updateEvent(eventToEdit.id, {
        name: name.trim(),
        type,
        date,
        time,
        venue: venue.trim(),
        expectedGuests: Number(expectedGuests),
        budget: Number(budget),
        description: description.trim(),
        status,
      });
    } else {
      addEvent({
        name: name.trim(),
        type,
        date,
        time,
        venue: venue.trim(),
        expectedGuests: Number(expectedGuests),
        budget: Number(budget),
        description: description.trim(),
        status,
      });
    }
    onClose();
  };

  const eventTypes: EventType[] = [
    'Wedding',
    'Birthday',
    'Corporate Event',
    'Conference',
    'Anniversary',
    'Concert',
    'Gala Dinner',
    'Other',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={eventToEdit ? 'Edit Event Details' : 'Plan New Event'}
      subtitle="Define celebration schedule, venue location, guest capacity, and budget allocation"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
            Event Name <span className="text-[#D98261]">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Royal Grand Palace Wedding"
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

        {/* Event Type & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Event Type <span className="text-[#D98261]">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as EventType)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-xl focus:outline-none focus:border-[#D98261]"
            >
              {eventTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Status <span className="text-[#D98261]">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EventStatus)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-xl focus:outline-none focus:border-[#D98261]"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Date <span className="text-[#D98261]">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors(prev => ({ ...prev, date: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border rounded-xl text-[#29231F] focus:outline-none transition-colors ${
                errors.date ? 'border-[#B96E42] bg-[#B96E42]/10' : 'border-[#E6D5C1] focus:border-[#D98261]'
              }`}
            />
            {errors.date && <p className="text-xs text-[#B96E42] mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Start Time <span className="text-[#D98261]">*</span>
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                if (errors.time) setErrors(prev => ({ ...prev, time: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border rounded-xl text-[#29231F] focus:outline-none transition-colors ${
                errors.time ? 'border-[#B96E42] bg-[#B96E42]/10' : 'border-[#E6D5C1] focus:border-[#D98261]'
              }`}
            />
            {errors.time && <p className="text-xs text-[#B96E42] mt-1">{errors.time}</p>}
          </div>
        </div>

        {/* Venue */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
            Venue Location <span className="text-[#D98261]">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. The Leela Palace, Bengaluru"
            value={venue}
            onChange={(e) => {
              setVenue(e.target.value);
              if (errors.venue) setErrors(prev => ({ ...prev, venue: '' }));
            }}
            className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border rounded-xl text-[#29231F] focus:outline-none transition-colors ${
              errors.venue ? 'border-[#B96E42] bg-[#B96E42]/10' : 'border-[#E6D5C1] focus:border-[#D98261]'
            }`}
          />
          {errors.venue && <p className="text-xs text-[#B96E42] mt-1">{errors.venue}</p>}
        </div>

        {/* Expected Guests & Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Expected Guests <span className="text-[#D98261]">*</span>
            </label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 250"
              value={expectedGuests}
              onChange={(e) => {
                setExpectedGuests(e.target.value === '' ? '' : Number(e.target.value));
                if (errors.expectedGuests) setErrors(prev => ({ ...prev, expectedGuests: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border rounded-xl text-[#29231F] focus:outline-none transition-colors ${
                errors.expectedGuests ? 'border-[#B96E42] bg-[#B96E42]/10' : 'border-[#E6D5C1] focus:border-[#D98261]'
              }`}
            />
            {errors.expectedGuests && <p className="text-xs text-[#B96E42] mt-1">{errors.expectedGuests}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Allocated Budget (₹ INR) <span className="text-[#D98261]">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              placeholder="e.g. 500000"
              value={budget}
              onChange={(e) => {
                setBudget(e.target.value === '' ? '' : Number(e.target.value));
                if (errors.budget) setErrors(prev => ({ ...prev, budget: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border rounded-xl text-[#29231F] focus:outline-none transition-colors ${
                errors.budget ? 'border-[#B96E42] bg-[#B96E42]/10' : 'border-[#E6D5C1] focus:border-[#D98261]'
              }`}
            />
            {errors.budget && <p className="text-xs text-[#B96E42] mt-1">{errors.budget}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
            Description / Overview
          </label>
          <textarea
            rows={3}
            placeholder="Key highlights, themes, special requirements..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-xl focus:outline-none focus:border-[#D98261]"
          />
        </div>

        {/* Form Actions */}
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
            {eventToEdit ? 'Save Changes' : 'Create Event'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
