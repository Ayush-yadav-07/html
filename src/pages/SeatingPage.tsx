import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Armchair, 
  Users, 
  UserPlus, 
  X, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Layers,
  LayoutGrid,
  Filter,
  Search,
  Check
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { SeatingTable, Guest } from '../types';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';

interface SeatingPageProps {
  onOpenCreateTableModal: () => void;
  onOpenEditTableModal: (table: SeatingTable) => void;
}

export const SeatingPage: React.FC<SeatingPageProps> = ({
  onOpenCreateTableModal,
  onOpenEditTableModal,
}) => {
  const { 
    filteredTables, 
    filteredGuests, 
    deleteTable, 
    assignGuestToTable, 
    events, 
    activeEventId,
    activeEvent,
    setActiveEventId,
    showToast 
  } = useEventContext();

  const [tableFilter, setTableFilter] = useState<'ALL' | 'OPEN' | 'FULL'>('ALL');
  const [tableSearch, setTableSearch] = useState<string>('');
  const [tableToDelete, setTableToDelete] = useState<SeatingTable | null>(null);

  // Assign Guest Modal State
  const [assigningToTable, setAssigningToTable] = useState<SeatingTable | null>(null);
  const [selectedGuestId, setSelectedGuestId] = useState<string>('');

  // Unassigned Guests for the active scope
  const unassignedGuests = filteredGuests.filter(g => !g.tableId);
  const totalSeatsCapacity = filteredTables.reduce((sum, t) => sum + t.capacity, 0);
  const totalAssignedGuests = filteredGuests.filter(g => !!g.tableId).length;
  const overallOccupancyPct = totalSeatsCapacity > 0 ? Math.round((totalAssignedGuests / totalSeatsCapacity) * 100) : 0;

  // Filtered tables based on tabs and search query
  const displayedTables = useMemo(() => {
    return filteredTables.filter(t => {
      const currentSeated = filteredGuests.filter(g => g.tableId === t.id).length;
      const isFull = currentSeated >= t.capacity;

      if (tableFilter === 'OPEN' && isFull) return false;
      if (tableFilter === 'FULL' && !isFull) return false;

      if (tableSearch.trim()) {
        const query = tableSearch.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(query);
        const matchesZone = (t.zone || '').toLowerCase().includes(query);
        const matchesShape = t.shape.toLowerCase().includes(query);
        if (!matchesName && !matchesZone && !matchesShape) return false;
      }

      return true;
    });
  }, [filteredTables, filteredGuests, tableFilter, tableSearch]);

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningToTable || !selectedGuestId) {
      showToast('Please select a guest to assign.', 'error');
      return;
    }

    const currentTableGuests = filteredGuests.filter(g => g.tableId === assigningToTable.id);
    if (currentTableGuests.length >= assigningToTable.capacity) {
      showToast(`Table "${assigningToTable.name}" is already at full capacity (${assigningToTable.capacity} seats).`, 'warning');
      return;
    }

    assignGuestToTable(selectedGuestId, assigningToTable.id);
    setSelectedGuestId('');
    setAssigningToTable(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Scope banner if focused on single event */}
      {activeEvent && (
        <div className="p-3.5 px-4.5 rounded-2xl bg-[#FCF8F1] border border-[#E6D5C1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#D98261]/15 text-[#D98261] flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-[#483329]">
              Seating floor plan for:{' '}
              <strong className="text-[#29231F] font-bold font-editorial text-sm tracking-wide">
                {activeEvent.name}
              </strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveEventId('ALL')}
            className="font-semibold text-[#D98261] hover:text-[#B96E42] underline text-left sm:text-right transition-colors cursor-pointer"
          >
            Show All Events Tables
          </button>
        </div>
      )}

      {/* Top Seating Metrics - Tactile Warm Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Tables */}
        <div className="paper-card p-5 rounded-2xl border border-[#E6D5C1] shadow-xs relative overflow-hidden group hover:border-[#D98261]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A6A77A]">Venue Layout</span>
            <div className="w-8 h-8 rounded-xl bg-[#E6D5C1]/40 text-[#483329] flex items-center justify-center">
              <Armchair className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-3xl font-bold font-editorial text-[#29231F] mt-2">
            {filteredTables.length} <span className="text-base font-normal font-sans text-[#483329]/70">Tables</span>
          </h4>
          <p className="text-xs text-[#483329]/70 mt-1">
            {totalSeatsCapacity} banquet chairs arranged across venue
          </p>
        </div>

        {/* Assigned Attendees */}
        <div className="paper-card p-5 rounded-2xl border border-[#A6A77A]/40 shadow-xs relative overflow-hidden group hover:border-[#A6A77A] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A6A77A]">Occupancy Rate</span>
            <div className="w-8 h-8 rounded-xl bg-[#A6A77A]/20 text-[#A6A77A] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-3xl font-bold font-editorial text-[#29231F] mt-2">
            {totalAssignedGuests} <span className="text-base font-normal font-sans text-[#483329]/70">Guests Seated</span>
          </h4>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-1.5 bg-[#E6D5C1]/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#A6A77A] rounded-full transition-all duration-500" 
                style={{ width: `${overallOccupancyPct}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-[#A6A77A]">{overallOccupancyPct}%</span>
          </div>
        </div>

        {/* Unassigned Guests */}
        <div className="paper-card p-5 rounded-2xl border border-[#D98261]/30 shadow-xs relative overflow-hidden group hover:border-[#D98261] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D98261]">Awaiting Placement</span>
            <div className="w-8 h-8 rounded-xl bg-[#D98261]/15 text-[#D98261] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-3xl font-bold font-editorial text-[#29231F] mt-2">
            {unassignedGuests.length} <span className="text-base font-normal font-sans text-[#483329]/70">Attendees</span>
          </h4>
          <p className="text-xs text-[#483329]/70 mt-1">
            {unassignedGuests.length > 0 ? 'Need designated table placement' : 'All confirmed attendees seated'}
          </p>
        </div>
      </div>

      {/* Control Header & Filters */}
      <div className="paper-card p-5 sm:p-6 rounded-2xl border border-[#E6D5C1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-bold font-editorial text-[#29231F] tracking-tight">
              Table Layout & Seating Chart
            </h3>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E6D5C1]/40 text-[#483329] border border-[#E6D5C1]">
              Floor Plan
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#483329]/75 mt-1">
            Organize round, rectangular, and VIP tables with clear visual seat capacity and guest assignments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#483329]/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tables or zones..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-[#F7F0E5] border border-[#E6D5C1] rounded-xl text-[#29231F] focus:outline-none focus:border-[#D98261] transition-colors"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#F7F0E5] border border-[#E6D5C1] rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setTableFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                tableFilter === 'ALL'
                  ? 'bg-[#FCF8F1] text-[#29231F] font-bold shadow-xs border border-[#E6D5C1]'
                  : 'text-[#483329]/70 hover:text-[#29231F]'
              }`}
            >
              All Tables ({filteredTables.length})
            </button>
            <button
              type="button"
              onClick={() => setTableFilter('OPEN')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                tableFilter === 'OPEN'
                  ? 'bg-[#FCF8F1] text-[#29231F] font-bold shadow-xs border border-[#E6D5C1]'
                  : 'text-[#483329]/70 hover:text-[#29231F]'
              }`}
            >
              Available Seats
            </button>
            <button
              type="button"
              onClick={() => setTableFilter('FULL')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                tableFilter === 'FULL'
                  ? 'bg-[#FCF8F1] text-[#29231F] font-bold shadow-xs border border-[#E6D5C1]'
                  : 'text-[#483329]/70 hover:text-[#29231F]'
              }`}
            >
              Full
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenCreateTableModal}
            className="tactile-button inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#D98261] hover:bg-[#B96E42] active:scale-98 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Table</span>
          </button>
        </div>
      </div>

      {/* Tables Grid */}
      {displayedTables.length === 0 ? (
        <EmptyState
          icon={Armchair}
          title="No seating tables found"
          description={filteredTables.length === 0 
            ? "Create your first table (Round, Rectangular, or Banquet) to organize where your guests will sit during the celebration."
            : "No tables match your active search or occupancy filter criteria."
          }
          actionLabel="Add Table"
          onAction={onOpenCreateTableModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTables.map((table) => {
            const tableGuests = filteredGuests.filter(g => g.tableId === table.id);
            const isFull = tableGuests.length >= table.capacity;
            const occupancyPercent = Math.min(Math.round((tableGuests.length / table.capacity) * 100), 100);
            const eventName = events.find(e => e.id === table.eventId)?.name;
            const vacantSeats = Math.max(0, table.capacity - tableGuests.length);

            return (
              <div
                key={table.id}
                className="paper-card rounded-2xl border border-[#E6D5C1] shadow-xs hover:shadow-md hover:border-[#D98261]/50 transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Table Header with Visual Geometry Badge */}
                <div className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#483329] bg-[#E6D5C1]/40 px-2.5 py-0.5 rounded-full border border-[#E6D5C1]">
                      {table.shape} • {table.zone || 'Main Banquet'}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                        isFull
                          ? 'bg-[#B96E42]/15 text-[#B96E42] border-[#B96E42]/30'
                          : 'bg-[#A6A77A]/15 text-[#A6A77A] border-[#A6A77A]/30'
                      }`}
                    >
                      {tableGuests.length} / {table.capacity} Seats
                    </span>
                  </div>

                  {/* 3D Visual Table Geometry Representation */}
                  <div className="my-3 p-3.5 bg-[#F7F0E5] rounded-xl border border-[#E6D5C1]/80 flex items-center justify-between shadow-inner">
                    <div className="flex items-center gap-3.5">
                      {/* Geometric Table Miniature */}
                      <div className={`relative flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${
                        table.shape === 'Round' 
                          ? 'w-14 h-14 rounded-full bg-[#FCF8F1] border-2 border-[#D98261]' 
                          : 'w-18 h-12 rounded-xl bg-[#FCF8F1] border-2 border-[#D98261]'
                      }`}>
                        <span className="text-xs font-bold font-editorial text-[#29231F]">
                          {table.capacity}p
                        </span>
                        {/* Table Linens Line */}
                        <div className="absolute inset-x-2 h-[1px] bg-[#D98261]/30 top-1/2 -translate-y-1/2" />
                      </div>

                      {/* Seat Status & Notches */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A6A77A] block">
                            Chairs Layout
                          </span>
                          <span className="text-[10px] font-mono font-semibold text-[#483329]/70">
                            ({vacantSeats > 0 ? `${vacantSeats} open` : 'Full'})
                          </span>
                        </div>

                        {/* Interactive Chair Dots */}
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap max-w-[160px]">
                          {Array.from({ length: table.capacity }).map((_, seatIdx) => {
                            const seatedGuest = tableGuests[seatIdx];
                            const isOccupied = !!seatedGuest;

                            return (
                              <span
                                key={seatIdx}
                                title={seatedGuest 
                                  ? `Seat ${seatIdx + 1}: ${seatedGuest.name} (${seatedGuest.category})`
                                  : `Seat ${seatIdx + 1}: Available`
                                }
                                className={`w-2.5 h-2.5 rounded-full transition-all ${
                                  isOccupied
                                    ? 'bg-[#A6A77A] border border-[#555635] shadow-2xs'
                                    : 'bg-[#E6D5C1] border border-[#E6D5C1]/80 hover:bg-[#D98261]/40'
                                }`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-[#29231F]">
                        {occupancyPercent}%
                      </span>
                      <span className="text-[10px] text-[#483329]/60 block font-medium">Occupancy</span>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold font-editorial text-[#29231F] tracking-tight">
                    {table.name}
                  </h4>

                  {eventName && (
                    <p className="text-[11px] text-[#483329]/60 truncate mt-0.5">
                      {eventName}
                    </p>
                  )}

                  {/* Occupancy Mini Bar */}
                  <div className="w-full h-1.5 bg-[#E6D5C1]/40 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFull ? 'bg-[#B96E42]' : 'bg-[#D98261]'
                      }`}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                </div>

                {/* Assigned Guest List */}
                <div className="px-5 py-3.5 bg-[#F7F0E5]/70 border-y border-[#E6D5C1] flex-1 min-h-[160px]">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#483329]/70 uppercase tracking-wider mb-2.5">
                    <span>Seated Guests</span>
                    <span className="font-mono">{tableGuests.length} Persons</span>
                  </div>

                  {tableGuests.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#483329]/60 italic font-editorial text-sm">
                      No guests assigned yet. Click "Assign Guest" below.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {tableGuests.map((guest) => (
                        <div
                          key={guest.id}
                          className="flex items-center justify-between gap-2 p-2 px-3 bg-[#FCF8F1] rounded-xl border border-[#E6D5C1] text-xs shadow-2xs hover:border-[#D98261]/40 transition-colors"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-[#29231F] truncate block">
                                {guest.name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#A6A77A]/15 text-[#555635] font-semibold">
                                {guest.category}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#483329]/70">
                              Diet: {guest.dietaryPreference || 'Standard'} • Party of {guest.plusGuests || 1}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => assignGuestToTable(guest.id, undefined)}
                            className="p-1 text-[#483329]/50 hover:text-[#B96E42] hover:bg-[#B96E42]/10 rounded-lg transition-colors cursor-pointer"
                            title="Remove guest from table"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Table Footer Actions */}
                <div className="p-4 bg-[#FCF8F1] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={isFull || unassignedGuests.length === 0}
                    onClick={() => setAssigningToTable(table)}
                    className={`tactile-button inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                      isFull || unassignedGuests.length === 0
                        ? 'bg-[#E6D5C1]/40 text-[#483329]/40 cursor-not-allowed'
                        : 'bg-[#D98261]/15 text-[#D98261] hover:bg-[#D98261] hover:text-white active:scale-98 cursor-pointer'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{isFull ? 'Table Full' : '+ Assign Guest'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onOpenEditTableModal(table)}
                      className="p-1.5 text-[#483329]/60 hover:text-[#D98261] hover:bg-[#E6D5C1]/40 rounded-lg transition-colors cursor-pointer"
                      title="Edit Table"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setTableToDelete(table)}
                      className="p-1.5 text-[#483329]/60 hover:text-[#B96E42] hover:bg-[#B96E42]/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Table"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assign Guest Modal */}
      {assigningToTable && (
        <Modal
          isOpen={!!assigningToTable}
          onClose={() => setAssigningToTable(null)}
          title={`Assign Guest to ${assigningToTable.name}`}
          subtitle={`Capacity: ${filteredGuests.filter(g => g.tableId === assigningToTable.id).length} / ${assigningToTable.capacity} Seats Filled`}
          maxWidth="md"
        >
          <form onSubmit={handleAssignSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#483329] mb-1.5">
                Select Unassigned Guest <span className="text-[#D98261]">*</span>
              </label>
              <select
                value={selectedGuestId}
                onChange={(e) => setSelectedGuestId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-xl focus:outline-none focus:border-[#D98261] transition-colors"
              >
                <option value="">-- Choose an attendee --</option>
                {unassignedGuests.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.category} • Party of {g.plusGuests || 1} • {g.rsvpStatus})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6D5C1]">
              <button
                type="button"
                onClick={() => setAssigningToTable(null)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#483329] bg-[#F7F0E5] border border-[#E6D5C1] rounded-xl hover:bg-[#E6D5C1]/50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedGuestId}
                className="tactile-button px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#D98261] hover:bg-[#B96E42] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Confirm Assignment
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Table Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!tableToDelete}
        onClose={() => setTableToDelete(null)}
        onConfirm={() => {
          if (tableToDelete) deleteTable(tableToDelete.id);
        }}
        title="Delete Seating Table"
        message={`Are you sure you want to remove "${tableToDelete?.name}"? Any guests currently seated at this table will be unassigned and returned to the waiting pool.`}
        confirmLabel="Delete Table"
        isDestructive={true}
      />
    </div>
  );
};
