import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Vendor, VendorCategory, VendorStatus } from '../../types';
import { useEventContext } from '../../context/EventContext';

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorToEdit?: Vendor | null;
  defaultEventId?: string;
}

export const VendorModal: React.FC<VendorModalProps> = ({
  isOpen,
  onClose,
  vendorToEdit,
  defaultEventId,
}) => {
  const { addVendor, updateVendor, events, activeEventId } = useEventContext();

  const [eventId, setEventId] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<VendorCategory>('Catering');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cost, setCost] = useState<number | ''>('');
  const [status, setStatus] = useState<VendorStatus>('Confirmed');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (vendorToEdit) {
      setEventId(vendorToEdit.eventId);
      setName(vendorToEdit.name);
      setCategory(vendorToEdit.category);
      setContactPerson(vendorToEdit.contactPerson);
      setPhone(vendorToEdit.phone);
      setEmail(vendorToEdit.email);
      setCost(vendorToEdit.cost);
      setStatus(vendorToEdit.status);
      setNotes(vendorToEdit.notes || '');
    } else {
      const initialEvtId = defaultEventId || (activeEventId !== 'ALL' ? activeEventId : (events[0]?.id || ''));
      setEventId(initialEvtId);
      setName('');
      setCategory('Catering');
      setContactPerson('');
      setPhone('');
      setEmail('');
      setCost('');
      setStatus('Confirmed');
      setNotes('');
    }
    setErrors({});
  }, [vendorToEdit, isOpen, defaultEventId, activeEventId, events]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!eventId) {
      newErrors.eventId = 'Please select an event for this vendor.';
    }

    if (!name.trim()) {
      newErrors.name = 'Vendor name is required.';
    }

    if (!contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person name is required.';
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

    if (cost === '' || isNaN(Number(cost))) {
      newErrors.cost = 'Please enter a valid amount.';
    } else if (Number(cost) < 0) {
      newErrors.cost = 'Agreed cost cannot be negative.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (vendorToEdit) {
      updateVendor(vendorToEdit.id, {
        eventId,
        name: name.trim(),
        category,
        contactPerson: contactPerson.trim(),
        phone: phone.trim(),
        email: email.trim(),
        cost: Number(cost),
        status,
        notes: notes.trim(),
      });
    } else {
      addVendor({
        eventId,
        name: name.trim(),
        category,
        contactPerson: contactPerson.trim(),
        phone: phone.trim(),
        email: email.trim(),
        cost: Number(cost),
        status,
        notes: notes.trim(),
      });
    }
    onClose();
  };

  const categories: VendorCategory[] = [
    'Catering',
    'Photography & Video',
    'Venue',
    'Floral & Decor',
    'Sound & DJ',
    'Makeup & Styling',
    'Transport & Logistics',
    'Invitations & Gifts',
    'Other',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vendorToEdit ? 'Edit Vendor Contract' : 'Register New Vendor'}
      subtitle="Register partner agency, primary contact details, and agreed price quotes"
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

        {/* Vendor Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Vendor / Agency Name <span className="text-[#D98261]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Royal Flavours Gourmet"
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

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Service Category <span className="text-[#D98261]">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as VendorCategory)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-xl focus:outline-none focus:border-[#D98261]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact Person & Cost */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Contact Person <span className="text-[#D98261]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Chef Manpreet Singh"
              value={contactPerson}
              onChange={(e) => {
                setContactPerson(e.target.value);
                if (errors.contactPerson) setErrors(prev => ({ ...prev, contactPerson: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border rounded-xl text-[#29231F] focus:outline-none transition-colors ${
                errors.contactPerson ? 'border-[#B96E42] bg-[#B96E42]/10' : 'border-[#E6D5C1] focus:border-[#D98261]'
              }`}
            />
            {errors.contactPerson && <p className="text-xs text-[#B96E42] mt-1">{errors.contactPerson}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Estimated Cost (₹ INR) <span className="text-[#D98261]">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              placeholder="e.g. 150000"
              value={cost}
              onChange={(e) => {
                setCost(e.target.value === '' ? '' : Number(e.target.value));
                if (errors.cost) setErrors(prev => ({ ...prev, cost: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border rounded-xl text-[#29231F] focus:outline-none transition-colors ${
                errors.cost ? 'border-[#B96E42] bg-[#B96E42]/10' : 'border-[#E6D5C1] focus:border-[#D98261]'
              }`}
            />
            {errors.cost && <p className="text-xs text-[#B96E42] mt-1">{errors.cost}</p>}
          </div>
        </div>

        {/* Phone & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Phone Number <span className="text-[#D98261]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. +91 98200 45678"
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
              placeholder="e.g. contact@royalflavours.com"
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

        {/* Status */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
            Contract Status <span className="text-[#D98261]">*</span>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as VendorStatus)}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-xl focus:outline-none focus:border-[#D98261]"
          >
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending Negotiation</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
            Deliverables & Contract Notes
          </label>
          <input
            type="text"
            placeholder="e.g. Includes 4 camera operators, live video feed on LED wall..."
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
            {vendorToEdit ? 'Save Vendor' : 'Add Vendor'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
