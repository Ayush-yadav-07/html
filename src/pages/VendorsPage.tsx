import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Building2, 
  Phone, 
  Mail, 
  User, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  RotateCcw,
  X,
  Layers
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { Vendor, VendorCategory, VendorStatus } from '../types';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';

interface VendorsPageProps {
  onOpenCreateModal: () => void;
  onOpenEditModal: (vendor: Vendor) => void;
}

export const VendorsPage: React.FC<VendorsPageProps> = ({
  onOpenCreateModal,
  onOpenEditModal,
}) => {
  const { 
    filteredVendors, 
    deleteVendor, 
    updateVendorStatus, 
    formatCurrency, 
    events, 
    globalSearch,
    activeEventId,
    activeEvent,
    setActiveEventId 
  } = useEventContext();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedEventId, setSelectedEventId] = useState<string>('ALL');
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);

  const searchQuery = (localSearch || globalSearch).toLowerCase().trim();

  // Filtered Vendors
  const displayedVendors = useMemo(() => {
    return filteredVendors.filter((v) => {
      const matchesSearch = 
        !searchQuery ||
        v.name.toLowerCase().includes(searchQuery) ||
        v.contactPerson.toLowerCase().includes(searchQuery) ||
        v.email.toLowerCase().includes(searchQuery) ||
        v.phone.toLowerCase().includes(searchQuery) ||
        v.category.toLowerCase().includes(searchQuery);

      const matchesCategory = selectedCategory === 'ALL' || v.category === selectedCategory;
      const matchesStatus = selectedStatus === 'ALL' || v.status === selectedStatus;
      const matchesEvent = activeEventId !== 'ALL' || selectedEventId === 'ALL' || v.eventId === selectedEventId;

      return matchesSearch && matchesCategory && matchesStatus && matchesEvent;
    });
  }, [filteredVendors, searchQuery, selectedCategory, selectedStatus, selectedEventId, activeEventId]);

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || (activeEventId === 'ALL' && selectedEventId !== 'ALL');

  const handleResetFilters = () => {
    setLocalSearch('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSelectedEventId('ALL');
  };

  const totalVendorsCount = filteredVendors.length;
  const confirmedVendorsCount = filteredVendors.filter(v => v.status === 'Confirmed').length;
  const totalContractCost = filteredVendors.reduce((sum, v) => sum + (Number(v.cost) || 0), 0);
  const confirmedContractCost = filteredVendors
    .filter(v => v.status === 'Confirmed')
    .reduce((sum, v) => sum + (Number(v.cost) || 0), 0);

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
    <div className="space-y-6 pb-12">
      {/* Scope banner if focused on single event */}
      {activeEvent && (
        <div className="p-3.5 px-5 rounded-2xl bg-[#FCF8F1] border border-[#D98261]/40 flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D98261] shrink-0" />
            <span className="text-[#483329]">
              Showing vendors for: <strong className="text-[#29231F] font-bold">{activeEvent.name}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveEventId('ALL')}
            className="font-bold text-[#D98261] hover:text-[#B96E42] underline"
          >
            Show All Events Vendors
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="paper-card bg-[#FCF8F1] p-5 rounded-3xl border border-[#E6D5C1] shadow-xs">
          <p className="text-[10px] font-bold text-[#B96E42] uppercase tracking-wider">Total Vendors</p>
          <h4 className="text-2xl sm:text-3xl font-editorial font-bold text-[#29231F] mt-1 tabular-nums">{totalVendorsCount}</h4>
          <p className="text-xs text-[#483329]/70 mt-0.5 font-medium">Agencies in active scope</p>
        </div>

        <div className="paper-card bg-[#FCF8F1] p-5 rounded-3xl border border-[#E6D5C1] shadow-xs">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#555635] uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#A6A77A]" />
            <span>Confirmed Contracts</span>
          </div>
          <h4 className="text-2xl sm:text-3xl font-editorial font-bold text-[#29231F] mt-1 tabular-nums">{confirmedVendorsCount}</h4>
          <p className="text-xs text-[#483329]/70 mt-0.5 font-medium">Agreements locked in</p>
        </div>

        <div className="paper-card bg-[#FCF8F1] p-5 rounded-3xl border border-[#E6D5C1] shadow-xs">
          <p className="text-[10px] font-bold text-[#B96E42] uppercase tracking-wider">Committed Spending</p>
          <h4 className="text-2xl sm:text-3xl font-editorial font-bold text-[#29231F] mt-1 tabular-nums">{formatCurrency(totalContractCost)}</h4>
          <p className="text-xs text-[#483329]/70 mt-0.5 font-medium">Total quote volume</p>
        </div>

        <div className="paper-card bg-[#FCF8F1] p-5 rounded-3xl border border-[#E6D5C1] shadow-xs">
          <p className="text-[10px] font-bold text-[#555635] uppercase tracking-wider">Signed Contracts</p>
          <h4 className="text-2xl sm:text-3xl font-editorial font-bold text-[#A6A77A] mt-1 tabular-nums">{formatCurrency(confirmedContractCost)}</h4>
          <p className="text-xs text-[#483329]/70 mt-0.5 font-medium">Approved partners</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-4 paper-card p-5 sm:p-6 rounded-3xl border border-[#E6D5C1] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative min-w-[220px] flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#B96E42]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search vendors, contacts, category..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-[#F7F0E5] focus:bg-white text-[#29231F] placeholder-[#483329]/50 border border-[#E6D5C1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D98261]/30 focus:border-[#D98261] transition-all shadow-2xs"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => setLocalSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#483329]/50 hover:text-[#29231F] p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-[#F7F0E5] border border-[#E6D5C1] rounded-xl text-[#483329] focus:outline-none focus:ring-2 focus:ring-[#D98261]/30 focus:border-[#D98261] transition-colors"
            >
              <option value="ALL">All Service Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-[#F7F0E5] border border-[#E6D5C1] rounded-xl text-[#483329] focus:outline-none focus:ring-2 focus:ring-[#D98261]/30 focus:border-[#D98261] transition-colors"
            >
              <option value="ALL">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending Negotiation</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {activeEventId === 'ALL' && (
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="px-3 py-2 text-xs font-semibold bg-[#F7F0E5] border border-[#E6D5C1] rounded-xl text-[#483329] focus:outline-none focus:ring-2 focus:ring-[#D98261]/30 focus:border-[#D98261] transition-colors max-w-[180px] truncate"
              >
                <option value="ALL">All Associated Events</option>
                {events.map(evt => (
                  <option key={evt.id} value={evt.id}>{evt.name}</option>
                ))}
              </select>
            )}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-[#B96E42] bg-[#D98261]/15 hover:bg-[#D98261]/25 rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#D98261] hover:bg-[#B96E42] active:bg-[#9E5730] rounded-xl transition-all shadow-[0_4px_12px_rgba(217,130,97,0.3)] hover:-translate-y-0.5 self-end sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vendor</span>
          </button>
        </div>

        {/* Result Count Bar */}
        <div className="flex items-center justify-between text-xs text-[#483329]/70 pt-3 border-t border-[#E6D5C1]">
          <span>
            Showing <strong className="text-[#29231F] font-bold">{displayedVendors.length}</strong> of{' '}
            <strong className="text-[#29231F] font-bold">{filteredVendors.length}</strong> partners
          </span>
          {hasActiveFilters && (
            <span className="text-[#D98261] font-bold">Filters applied</span>
          )}
        </div>
      </div>

      {/* Vendor Cards Grid */}
      {filteredVendors.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No vendors added yet"
          description="Add your caterers, photographers, florists, and stylists to organize partner contracts."
          actionLabel="Add Vendor"
          onAction={onOpenCreateModal}
        />
      ) : displayedVendors.length === 0 ? (
        <div className="p-12 text-center bg-[#FCF8F1] rounded-3xl border border-[#E6D5C1]">
          <Building2 className="w-10 h-10 text-[#D98261]/50 mx-auto mb-3" />
          <h4 className="text-lg font-editorial font-bold text-[#29231F]">No matching vendors found</h4>
          <p className="text-xs text-[#483329]/70 max-w-sm mx-auto mt-1 mb-4 font-serif">
            Try adjusting your search criteria or resetting filters.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-bold text-[#B96E42] bg-[#D98261]/15 hover:bg-[#D98261]/25 rounded-xl transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedVendors.map((vendor) => {
            const eventName = events.find(e => e.id === vendor.eventId)?.name;

            return (
              <div
                key={vendor.id}
                className="paper-card rounded-3xl border border-[#E6D5C1] shadow-xs hover:border-[#D98261] hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Category & Status Dropdown */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B96E42] bg-[#F7F0E5] px-2.5 py-0.5 rounded-full border border-[#E6D5C1]">
                      {vendor.category}
                    </span>
                    <select
                      value={vendor.status}
                      onChange={(e) => updateVendorStatus(vendor.id, e.target.value as VendorStatus)}
                      className={`text-xs font-bold py-0.5 px-2.5 rounded-full border cursor-pointer focus:outline-none transition-colors shadow-2xs ${
                        vendor.status === 'Confirmed'
                          ? 'bg-[#A6A77A]/20 text-[#555635] border-[#A6A77A]/60'
                          : vendor.status === 'Pending'
                          ? 'bg-[#D98261]/20 text-[#B96E42] border-[#D98261]/50'
                          : 'bg-[#E6D5C1]/40 text-[#483329] border-[#E6D5C1]'
                      }`}
                    >
                      <option value="Confirmed">✓ Confirmed</option>
                      <option value="Pending">⟳ Pending</option>
                      <option value="Cancelled">✕ Cancelled</option>
                    </select>
                  </div>

                  <h3 className="text-lg font-editorial font-bold text-[#29231F] tracking-tight line-clamp-1">
                    {vendor.name}
                  </h3>

                  {eventName && (
                    <p className="text-xs text-[#483329]/70 font-semibold truncate mt-0.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D98261] shrink-0" />
                      {eventName}
                    </p>
                  )}

                  {vendor.notes && (
                    <p className="text-xs text-[#483329]/80 mt-2.5 line-clamp-2 leading-relaxed bg-[#F7F0E5] p-3 rounded-2xl border border-[#E6D5C1] font-serif italic">
                      "{vendor.notes}"
                    </p>
                  )}

                  {/* Contact Info List */}
                  <div className="mt-4 pt-3.5 border-t border-[#E6D5C1] space-y-2 text-xs text-[#483329]">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#B96E42] shrink-0" />
                      <span className="font-semibold text-[#29231F]">{vendor.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#B96E42] shrink-0" />
                      <span className="font-mono text-[#29231F]">{vendor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-[#A6A77A] shrink-0" />
                      <span className="truncate">{vendor.email}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Cost & Actions */}
                <div className="mt-5 pt-3.5 border-t border-[#E6D5C1] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#B96E42] font-bold uppercase tracking-wider block">Agreed Fee</span>
                    <p className="text-lg font-editorial font-bold text-[#29231F] font-mono tabular-nums">{formatCurrency(vendor.cost)}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenEditModal(vendor)}
                      className="p-1.5 text-[#483329]/60 hover:text-[#D98261] hover:bg-[#F7F0E5] rounded-xl transition-colors"
                      title="Edit Vendor"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setVendorToDelete(vendor)}
                      className="p-1.5 text-[#483329]/60 hover:text-[#B96E42] hover:bg-[#D98261]/15 rounded-xl transition-colors"
                      title="Delete Vendor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!vendorToDelete}
        onClose={() => setVendorToDelete(null)}
        onConfirm={() => {
          if (vendorToDelete) deleteVendor(vendorToDelete.id);
        }}
        title="Remove Vendor"
        message={`Are you sure you want to remove vendor "${vendorToDelete?.name}"?`}
        confirmLabel="Remove Vendor"
        isDestructive={true}
      />
    </div>
  );
};
