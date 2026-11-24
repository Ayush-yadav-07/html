import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Guest, GuestCategory, RSVPStatus } from '../../types';
import { useEventContext } from '../../context/EventContext';

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestToEdit?: Guest | null;
  defaultEventId?: string;
}

export const GuestModal: React.FC<GuestModalProps> = ({
  isOpen,
  onClose,
  guestToEdit,
  defaultEventId,
}) => {
  const { addGuest, updateGuest, events, activeEventId, tables } = useEventContext();

  const [eventId, setEventId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<GuestCategory>('General');
  const [plusGuests, setPlusGuests] = useState<number>(1);
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>('Pending');
  const [tableId, setTableId] = useState<string>('');
  const [dietaryPreference, setDietaryPreference] = useState<'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Jain' | 'None'>('Vegetarian');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (guestToEdit) {
      setEventId(guestToEdit.eventId);
      setName(guestToEdit.name);
      setPhone(guestToEdit.phone);
      setEmail(guestToEdit.email);
      setCategory(guestToEdit.category);
      setPlusGuests(guestToEdit.plusGuests || 1);
      setRsvpStatus(guestToEdit.rsvpStatus);
      setTableId(guestToEdit.tableId || '');
      setDietaryPreference(guestToEdit.dietaryPreference || 'Vegetarian');
      setNotes(guestToEdit.notes || '');
    } else {
      const initialEvtId = defaultEventId || (activeEventId !== 'ALL' ? activeEventId : (events[0]?.id || ''));
      setEventId(initialEvtId);
      setName('');
      setPhone('');
      setEmail('');
      setCategory('Friend');
      setPlusGuests(1);
      setRsvpStatus('Pending');
      setTableId('');
      setDietaryPreference('Vegetarian');
      setNotes('');
    }
    setErrors({});
  }, [guestToEdit, isOpen, defaultEventId, activeEventId, events]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!eventId) {
      newErrors.eventId = 'Please select an event for this guest.';
    }

    if (!name.trim()) {
      newErrors.name = 'Guest name is required.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Guest name must be at least 2 characters.';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^[0-9+ -]{7,16}$/.test(phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (plusGuests === null || plusGuests === undefined || Number(plusGuests) < 1) {
      newErrors.plusGuests = 'Party count must be at least 1.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (guestToEdit) {
      updateGuest(guestToEdit.id, {
        eventId,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        category,
        plusGuests: Number(plusGuests),
        rsvpStatus,
        tableId: tableId || undefined,
        dietaryPreference,
        notes: notes.trim(),
      });
    } else {
      addGuest({
        eventId,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        category,
        plusGuests: Number(plusGuests),
        rsvpStatus,
        tableId: tableId || undefined,
        dietaryPreference,
        notes: notes.trim(),
      });
    }
    onClose();
  };

  const categories: GuestCategory[] = [
    'VIP',
    'Family',
    'Bride Side',
    'Groom Side',
    'Colleague',
    'Friend',
    'General',
  ];

  const relevantTables = tables.filter(t => t.eventId === eventId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={guestToEdit ? 'Edit Guest Details' : 'Add New Guest'}
      subtitle="Enter attendee contact, RSVP status, party headcount, and seating preferences"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Linked Event */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
            Associated Event <span className="text-[#D98261]">*</span>
          </label>
          <select
            value={eventId}
            onChange={(e) => {
              setEventId(e.target.value);
              setTableId('');
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

        {/* Guest Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
            Guest Full Name <span className="text-[#D98261]">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Rahul Sharma"
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

        {/* Phone & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Phone Number <span className="text-[#D98261]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border rounded-xl text-[#29231F] focus:outline-none transition-colors ${
                errors.phone ? 'border-[#B96E42] bg-[#B96E42]/10' : 'border-[#E6D5C1] focus:border-[#D98261]'
              }`}
            />
            {errors.phone && <p className="text-xs text-[#B96E42] mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Email Address <span className="text-[#D98261]">*</span>
            </label>
            <input
              type="email"
              placeholder="e.g. rahul@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border rounded-xl text-[#29231F] focus:outline-none transition-colors ${
                errors.email ? 'border-[#B96E42] bg-[#B96E42]/10' : 'border-[#E6D5C1] focus:border-[#D98261]'
              }`}
            />
            {errors.email && <p className="text-xs text-[#B96E42] mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Category & Party Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Guest Category <span className="text-[#D98261]">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as GuestCategory)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-xl focus:outline-none focus:border-[#D98261]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Total Party Size (Headcount) <span className="text-[#D98261]">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={plusGuests}
              onChange={(e) => {
                setPlusGuests(Number(e.target.value));
                if (errors.plusGuests) setErrors(prev => ({ ...prev, plusGuests: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border rounded-xl text-[#29231F] focus:outline-none transition-colors ${
                errors.plusGuests ? 'border-[#B96E42] bg-[#B96E42]/10' : 'border-[#E6D5C1] focus:border-[#D98261]'
              }`}
            />
            {errors.plusGuests && <p className="text-xs text-[#B96E42] mt-1">{errors.plusGuests}</p>}
          </div>
        </div>

        {/* RSVP Status & Dietary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              RSVP Status <span className="text-[#D98261]">*</span>
            </label>
            <select
              value={rsvpStatus}
              onChange={(e) => setRsvpStatus(e.target.value as RSVPStatus)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-xl focus:outline-none focus:border-[#D98261]"
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Declined">Declined</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Dietary Preference
            </label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value as any)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-xl focus:outline-none focus:border-[#D98261]"
            >
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Jain">Jain (No Root Veg)</option>
              <option value="Vegan">Vegan</option>
              <option value="None">No Preference</option>
            </select>
          </div>
        </div>

        {/* Assigned Table (Optional) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
            Seating Table Assignment
          </label>
          <select
            value={tableId}
            onChange={(e) => setTableId(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-xl focus:outline-none focus:border-[#D98261]"
          >
            <option value="">-- No table assigned yet --</option>
            {relevantTables.map(tbl => (
              <option key={tbl.id} value={tbl.id}>{tbl.name} (Max {tbl.capacity})</option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
            Special Notes / Requests
          </label>
          <input
            type="text"
            placeholder="e.g. Needs high chair, airport pickup required..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
            {guestToEdit ? 'Save Guest' : 'Add Guest'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
