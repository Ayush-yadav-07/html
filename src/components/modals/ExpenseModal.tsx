import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Expense, ExpenseCategory, PaymentStatus } from '../../types';
import { useEventContext } from '../../context/EventContext';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseToEdit?: Expense | null;
  defaultEventId?: string;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  expenseToEdit,
  defaultEventId,
}) => {
  const { addExpense, updateExpense, events, activeEventId, vendors } = useEventContext();

  const [eventId, setEventId] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Venue');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (expenseToEdit) {
      setEventId(expenseToEdit.eventId);
      setName(expenseToEdit.name);
      setCategory(expenseToEdit.category);
      setAmount(expenseToEdit.amount);
      setDate(expenseToEdit.date);
      setVendorName(expenseToEdit.vendorName);
      setPaymentStatus(expenseToEdit.paymentStatus);
      setNotes(expenseToEdit.notes || '');
    } else {
      const initialEvtId = defaultEventId || (activeEventId !== 'ALL' ? activeEventId : (events[0]?.id || ''));
      setEventId(initialEvtId);
      setName('');
      setCategory('Venue');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setVendorName('');
      setPaymentStatus('Paid');
      setNotes('');
    }
    setErrors({});
  }, [expenseToEdit, isOpen, defaultEventId, activeEventId, events]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!eventId) {
      newErrors.eventId = 'Please select an event for this expense.';
    }

    if (!name.trim()) {
      newErrors.name = 'Expense description is required.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Expense description must be at least 2 characters.';
    }

    if (amount === '' || isNaN(Number(amount))) {
      newErrors.amount = 'Please enter a valid amount.';
    } else if (Number(amount) < 0) {
      newErrors.amount = 'Amount cannot be negative.';
    } else if (Number(amount) === 0) {
      newErrors.amount = 'Please enter an amount greater than zero.';
    }

    if (!date) {
      newErrors.date = 'Expense date is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (expenseToEdit) {
      updateExpense(expenseToEdit.id, {
        eventId,
        name: name.trim(),
        category,
        amount: Number(amount),
        date,
        vendorName: vendorName.trim() || 'Internal / Direct',
        paymentStatus,
        notes: notes.trim(),
      });
    } else {
      addExpense({
        eventId,
        name: name.trim(),
        category,
        amount: Number(amount),
        date,
        vendorName: vendorName.trim() || 'Internal / Direct',
        paymentStatus,
        notes: notes.trim(),
      });
    }
    onClose();
  };

  const categories: ExpenseCategory[] = [
    'Venue',
    'Catering',
    'Decoration',
    'Photography',
    'Transport',
    'Entertainment',
    'Other',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expenseToEdit ? 'Edit Expense Record' : 'Record New Expense'}
      subtitle="Log event costs, invoices, disbursement dates, and payment settlements"
      maxWidth="lg"
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

        {/* Expense Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
            Expense Item Description <span className="text-[#D98261]">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Banquet Hall Advance Deposit"
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

        {/* Category & Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Category <span className="text-[#D98261]">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-xl focus:outline-none focus:border-[#D98261]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Amount (₹ INR) <span className="text-[#D98261]">*</span>
            </label>
            <input
              type="number"
              min="1"
              step="100"
              placeholder="e.g. 75000"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value === '' ? '' : Number(e.target.value));
                if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border rounded-xl text-[#29231F] focus:outline-none transition-colors ${
                errors.amount ? 'border-[#B96E42] bg-[#B96E42]/10' : 'border-[#E6D5C1] focus:border-[#D98261]'
              }`}
            />
            {errors.amount && <p className="text-xs text-[#B96E42] mt-1">{errors.amount}</p>}
          </div>
        </div>

        {/* Date & Payment Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
              Expense Date <span className="text-[#D98261]">*</span>
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
              Payment Status <span className="text-[#D98261]">*</span>
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-xl focus:outline-none focus:border-[#D98261]"
            >
              <option value="Paid">Paid in Full</option>
              <option value="Partial">Partial Payment</option>
              <option value="Pending">Payment Pending</option>
            </select>
          </div>
        </div>

        {/* Vendor */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
            Vendor / Payee Name
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              list="existing-vendors"
              placeholder="e.g. Royal Flavours Catering or Taj Banquets"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-xl focus:outline-none focus:border-[#D98261]"
            />
            <datalist id="existing-vendors">
              {vendors.map(v => (
                <option key={v.id} value={v.name} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
            Invoice / Receipt Notes
          </label>
          <input
            type="text"
            placeholder="e.g. Transaction Ref #TXN9821; receipt attached in office folder."
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
            {expenseToEdit ? 'Save Expense' : 'Record Expense'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
