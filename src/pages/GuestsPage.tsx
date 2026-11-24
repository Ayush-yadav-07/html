import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  Edit2, 
  Trash2, 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Armchair,
  X, 
  RotateCcw,
  Layers
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { Guest, GuestCategory, RSVPStatus } from '../types';
import { RSVPBadge } from '../components/common/Badge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';

interface GuestsPageProps {
  onOpenCreateModal: () => void;
  onOpenEditModal: (guest: Guest) => void;
}

export const GuestsPage: React.FC<GuestsPageProps> = ({
  onOpenCreateModal,
  onOpenEditModal,
}) => {
  const { 
    filteredGuests, 
    deleteGuest, 
    updateGuestRSVP, 
    events, 
    tables, 
    globalSearch, 
    activeEventId,
    activeEvent,
    setActiveEventId,
    showToast 
  } = useEventContext();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedRSVP, setSelectedRSVP] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedEventId, setSelectedEventId] = useState<string>('ALL');
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);

  const searchQuery = (localSearch || globalSearch).toLowerCase().trim();

  // Filtered Guests
  const displayedGuests = useMemo(() => {
    return filteredGuests.filter((g) => {
      const matchesSearch = 
        !searchQuery ||
        g.name.toLowerCase().includes(searchQuery) ||
        g.email.toLowerCase().includes(searchQuery) ||
        g.phone.toLowerCase().includes(searchQuery) ||
        (g.notes && g.notes.toLowerCase().includes(searchQuery));

      const matchesRSVP = selectedRSVP === 'ALL' || g.rsvpStatus === selectedRSVP;
      const matchesCategory = selectedCategory === 'ALL' || g.category === selectedCategory;
      const matchesEvent = activeEventId !== 'ALL' || selectedEventId === 'ALL' || g.eventId === selectedEventId;

      return matchesSearch && matchesRSVP && matchesCategory && matchesEvent;
    });
  }, [filteredGuests, searchQuery, selectedRSVP, selectedCategory, selectedEventId, activeEventId]);

  const hasActiveFilters = searchQuery !== '' || selectedRSVP !== 'ALL' || selectedCategory !== 'ALL' || (activeEventId === 'ALL' && selectedEventId !== 'ALL');

  const handleResetFilters = () => {
    setLocalSearch('');
    setSelectedRSVP('ALL');
    setSelectedCategory('ALL');
    setSelectedEventId('ALL');
  };

  const totalGuests = filteredGuests.length;
  const totalHeadcount = filteredGuests.reduce((sum, g) => sum + (Number(g.plusGuests) || 1), 0);
  const confirmedCount = filteredGuests.filter(g => g.rsvpStatus === 'Confirmed').length;
  const pendingCount = filteredGuests.filter(g => g.rsvpStatus === 'Pending').length;
  const declinedCount = filteredGuests.filter(g => g.rsvpStatus === 'Declined').length;

  // Export CSV
  const handleExportCSV = () => {
    if (displayedGuests.length === 0) {
      showToast('No guests available to export.', 'info');
      return;
    }

    const headers = ['Name', 'Event', 'Phone', 'Email', 'Category', 'Party Size', 'RSVP Status', 'Assigned Table', 'Dietary Preference', 'Notes'];
    const rows = displayedGuests.map(g => {
      const eventName = events.find(e => e.id === g.eventId)?.name || 'General';
      const tableName = tables.find(t => t.id === g.tableId)?.name || 'Unassigned';
      return [
        `"${g.name}"`,
        `"${eventName}"`,
        `"${g.phone}"`,
        `"${g.email}"`,
        `"${g.category}"`,
        g.plusGuests || 1,
        `"${g.rsvpStatus}"`,
        `"${tableName}"`,
        `"${g.dietaryPreference || 'None'}"`,
        `"${g.notes || ''}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EventEase_Guest_List_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Guest roster exported successfully as CSV.', 'success');
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

  return (
    <div className="space-y-6 pb-12">
      {/* Active Scope Notification Banner if focused on single event */}
      {activeEvent && (
        <div className="p-3.5 px-5 rounded-2xl bg-[#FCF8F1] border border-[#D98261]/40 flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D98261] shrink-0" />
            <span className="text-[#483329]">
              Showing guests for: <strong className="text-[#29231F] font-bold">{activeEvent.name}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveEventId('ALL')}
            className="font-bold text-[#D98261] hover:text-[#B96E42] underline"
          >
            Show All Events Guests
          </button>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="paper-card bg-[#FCF8F1] p-5 rounded-3xl border border-[#E6D5C1] shadow-xs">
          <p className="text-[10px] font-bold text-[#B96E42] uppercase tracking-wider">Total Invitations</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h4 className="text-2xl sm:text-3xl font-editorial font-bold text-[#29231F] tabular-nums">{totalGuests}</h4>
            <span className="text-xs text-[#483329]/70 font-medium">({totalHeadcount} heads)</span>
          </div>
        </div>

        <div className="paper-card bg-[#FCF8F1] p-5 rounded-3xl border border-[#E6D5C1] shadow-xs">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#555635] uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#A6A77A]" />
            <span>Confirmed</span>
          </div>
          <h4 className="text-2xl sm:text-3xl font-editorial font-bold text-[#29231F] mt-1 tabular-nums">{confirmedCount}</h4>
        </div>

        <div className="paper-card bg-[#FCF8F1] p-5 rounded-3xl border border-[#E6D5C1] shadow-xs">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#B96E42] uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-[#D98261]" />
            <span>Pending</span>
          </div>
          <h4 className="text-2xl sm:text-3xl font-editorial font-bold text-[#29231F] mt-1 tabular-nums">{pendingCount}</h4>
        </div>

        <div className="paper-card bg-[#FCF8F1] p-5 rounded-3xl border border-[#E6D5C1] shadow-xs">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#483329]/70 uppercase tracking-wider">
            <XCircle className="w-3.5 h-3.5 text-[#8A7969]" />
            <span>Declined</span>
          </div>
          <h4 className="text-2xl sm:text-3xl font-editorial font-bold text-[#483329] mt-1 tabular-nums">{declinedCount}</h4>
        </div>
      </div>

      {/* Control Bar: Search, Filters, CSV Export, Add Guest */}
      <div className="flex flex-col gap-4 paper-card p-5 sm:p-6 rounded-3xl border border-[#E6D5C1] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Box */}
            <div className="relative min-w-[220px] flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#B96E42]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
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

            {/* RSVP Status Filter */}
            <select
              value={selectedRSVP}
              onChange={(e) => setSelectedRSVP(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-[#F7F0E5] border border-[#E6D5C1] rounded-xl text-[#483329] focus:outline-none focus:ring-2 focus:ring-[#D98261]/30 focus:border-[#D98261] transition-colors"
            >
              <option value="ALL">All RSVP Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Declined">Declined</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-[#F7F0E5] border border-[#E6D5C1] rounded-xl text-[#483329] focus:outline-none focus:ring-2 focus:ring-[#D98261]/30 focus:border-[#D98261] transition-colors"
            >
              <option value="ALL">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Event Filter if not in single event scope */}
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

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#483329] bg-[#F7F0E5] hover:bg-[#E6D5C1] border border-[#E6D5C1] rounded-xl transition-colors"
              title="Download CSV for studio records"
            >
              <Download className="w-4 h-4 text-[#B96E42]" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              type="button"
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#D98261] hover:bg-[#B96E42] active:bg-[#9E5730] rounded-xl transition-all shadow-[0_4px_12px_rgba(217,130,97,0.3)] hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Guest</span>
            </button>
          </div>
        </div>

        {/* Filter Count Result Bar */}
        <div className="flex items-center justify-between text-xs text-[#483329]/70 pt-3 border-t border-[#E6D5C1]">
          <span>
            Showing <strong className="text-[#29231F] font-bold">{displayedGuests.length}</strong> of{' '}
            <strong className="text-[#29231F] font-bold">{totalGuests}</strong> guests
          </span>
          {hasActiveFilters && (
            <span className="text-[#D98261] font-bold">Active filters applied</span>
          )}
        </div>
      </div>

      {/* Guest Table */}
      {filteredGuests.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No guests on roster yet"
          description="Add your first guest to begin tracking RSVPs, companion headcounts, and table allocations."
          actionLabel="Add Guest"
          onAction={onOpenCreateModal}
        />
      ) : displayedGuests.length === 0 ? (
        <div className="p-12 text-center bg-[#FCF8F1] rounded-3xl border border-[#E6D5C1]">
          <Users className="w-10 h-10 text-[#D98261]/50 mx-auto mb-3" />
          <h4 className="text-lg font-editorial font-bold text-[#29231F]">No matching guests found</h4>
          <p className="text-xs text-[#483329]/70 max-w-sm mx-auto mt-1 mb-4 font-serif">
            Try adjusting your search criteria or resetting the active filters.
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
        <div className="paper-card rounded-3xl border border-[#E6D5C1] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#483329]">
              <thead className="bg-[#F7F0E5] text-[11px] font-bold text-[#B96E42] uppercase tracking-wider border-b border-[#E6D5C1]">
                <tr>
                  <th className="py-3.5 px-4">Guest Name</th>
                  <th className="py-3.5 px-4">Associated Event</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-center">Party</th>
                  <th className="py-3.5 px-4">RSVP Status</th>
                  <th className="py-3.5 px-4">Assigned Table</th>
                  <th className="py-3.5 px-4">Dietary</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6D5C1]/60 font-normal">
                {displayedGuests.map((guest) => {
                  const eventName = events.find(e => e.id === guest.eventId)?.name;
                  const assignedTable = tables.find(t => t.id === guest.tableId);

                  return (
                    <tr key={guest.id} className="hover:bg-[#F7F0E5]/60 transition-colors">
                      {/* Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#29231F]">{guest.name}</div>
                        {guest.notes && (
                          <div className="text-[11px] text-[#483329]/60 truncate max-w-[200px] font-serif italic">
                            {guest.notes}
                          </div>
                        )}
                      </td>

                      {/* Associated Event */}
                      <td className="py-3.5 px-4 text-xs">
                        <span className="font-semibold text-[#483329] truncate block max-w-[160px]">
                          {eventName || 'General Event'}
                        </span>
                      </td>

                      {/* Phone & Email */}
                      <td className="py-3.5 px-4 text-xs">
                        <div className="text-[#29231F] font-mono">{guest.phone}</div>
                        <div className="text-[#483329]/60 truncate max-w-[160px]">{guest.email}</div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F7F0E5] text-[#483329] border border-[#E6D5C1] font-semibold">
                          {guest.category}
                        </span>
                      </td>

                      {/* Party Size */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#D98261]/15 text-[#B96E42] border border-[#D98261]/30 font-bold text-xs font-mono">
                          {guest.plusGuests || 1}
                        </span>
                      </td>

                      {/* RSVP Status (Interactive Quick Toggle) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={guest.rsvpStatus}
                          onChange={(e) => updateGuestRSVP(guest.id, e.target.value as RSVPStatus)}
                          className={`text-xs font-bold py-1 px-3 rounded-full border cursor-pointer focus:outline-none transition-all shadow-2xs ${
                            guest.rsvpStatus === 'Confirmed'
                              ? 'bg-[#A6A77A]/20 text-[#555635] border-[#A6A77A]/60'
                              : guest.rsvpStatus === 'Pending'
                              ? 'bg-[#D98261]/20 text-[#B96E42] border-[#D98261]/50'
                              : 'bg-[#E6D5C1]/40 text-[#483329] border-[#E6D5C1]'
                          }`}
                        >
                          <option value="Confirmed">✓ Confirmed</option>
                          <option value="Pending">⟳ Pending</option>
                          <option value="Declined">✕ Declined</option>
                        </select>
                      </td>

                      {/* Table */}
                      <td className="py-3.5 px-4 text-xs">
                        {assignedTable ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-[#29231F] bg-[#F7F0E5] px-2.5 py-0.5 rounded-xl border border-[#E6D5C1]">
                            <Armchair className="w-3 h-3 text-[#D98261]" />
                            {assignedTable.name}
                          </span>
                        ) : (
                          <span className="text-[#483329]/50 font-serif italic">Unassigned</span>
                        )}
                      </td>

                      {/* Dietary */}
                      <td className="py-3.5 px-4 text-xs text-[#483329]">
                        {guest.dietaryPreference || 'None'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenEditModal(guest)}
                            className="p-1.5 text-[#483329]/60 hover:text-[#D98261] hover:bg-[#F7F0E5] rounded-xl transition-colors"
                            title="Edit Guest"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setGuestToDelete(guest)}
                            className="p-1.5 text-[#483329]/60 hover:text-[#B96E42] hover:bg-[#D98261]/15 rounded-xl transition-colors"
                            title="Delete Guest"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!guestToDelete}
        onClose={() => setGuestToDelete(null)}
        onConfirm={() => {
          if (guestToDelete) deleteGuest(guestToDelete.id);
        }}
        title="Remove Guest"
        message={`Are you sure you want to remove "${guestToDelete?.name}" from the attendee roster?`}
        confirmLabel="Remove Guest"
        isDestructive={true}
      />
    </div>
  );
};
