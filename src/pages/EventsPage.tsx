import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Wallet, 
  Edit2, 
  Trash2, 
  Eye, 
  LayoutGrid, 
  Table as TableIcon,
  X, 
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  ListTodo
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { EventItem, EventType, EventStatus } from '../types';
import { EventStatusBadge, RSVPBadge, TaskStatusBadge } from '../components/common/Badge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { 
  calculateEventCountdown, 
  calculateEventHealth, 
  generatePriorityAlerts, 
  generateNextActions 
} from '../utils/commandCenter';

interface EventsPageProps {
  onOpenCreateModal: () => void;
  onOpenEditModal: (event: EventItem) => void;
  onOpenAddForEvent?: (type: 'guest' | 'expense' | 'vendor' | 'task', eventId: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  onOpenCreateModal,
  onOpenEditModal,
}) => {
  const { 
    events, 
    deleteEvent, 
    formatCurrency, 
    activeEventId, 
    setActiveEventId, 
    globalSearch,
    guests,
    expenses,
    vendors,
    tasks,
    tables
  } = useEventContext();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Detailed Event View
  const [viewingEvent, setViewingEvent] = useState<EventItem | null>(null);
  const [detailTab, setDetailTab] = useState<'overview' | 'guests' | 'expenses' | 'vendors' | 'tasks' | 'seating'>('overview');

  // Delete confirmation dialog state
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);

  const searchQuery = (localSearch || globalSearch).toLowerCase().trim();

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      const matchesSearch = 
        !searchQuery ||
        evt.name.toLowerCase().includes(searchQuery) ||
        evt.venue.toLowerCase().includes(searchQuery) ||
        evt.type.toLowerCase().includes(searchQuery) ||
        evt.description.toLowerCase().includes(searchQuery);

      const matchesType = selectedType === 'ALL' || evt.type === selectedType;
      const matchesStatus = selectedStatus === 'ALL' || evt.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [events, searchQuery, selectedType, selectedStatus]);

  const hasActiveFilters = searchQuery !== '' || selectedType !== 'ALL' || selectedStatus !== 'ALL';

  const handleResetFilters = () => {
    setLocalSearch('');
    setSelectedType('ALL');
    setSelectedStatus('ALL');
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

  // Data helpers for the selected viewing event
  const currentEventGuests = useMemo(() => {
    if (!viewingEvent) return [];
    return guests.filter(g => g.eventId === viewingEvent.id);
  }, [guests, viewingEvent]);

  const currentEventExpenses = useMemo(() => {
    if (!viewingEvent) return [];
    return expenses.filter(e => e.eventId === viewingEvent.id);
  }, [expenses, viewingEvent]);

  const currentEventVendors = useMemo(() => {
    if (!viewingEvent) return [];
    return vendors.filter(v => v.eventId === viewingEvent.id);
  }, [vendors, viewingEvent]);

  const currentEventTasks = useMemo(() => {
    if (!viewingEvent) return [];
    return tasks.filter(t => t.eventId === viewingEvent.id);
  }, [tasks, viewingEvent]);

  const currentEventTables = useMemo(() => {
    if (!viewingEvent) return [];
    return tables.filter(t => t.eventId === viewingEvent.id);
  }, [tables, viewingEvent]);

  const currentEventSpent = currentEventExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const currentEventConfirmedRSVP = currentEventGuests.filter(g => g.rsvpStatus === 'Confirmed').length;
  const currentEventPendingRSVP = currentEventGuests.filter(g => g.rsvpStatus === 'Pending').length;
  const currentEventDeclinedRSVP = currentEventGuests.filter(g => g.rsvpStatus === 'Declined').length;

  const viewingCountdown = useMemo(() => {
    if (!viewingEvent) return null;
    return calculateEventCountdown(viewingEvent.date, viewingEvent.status);
  }, [viewingEvent]);

  const viewingHealth = useMemo(() => {
    if (!viewingEvent) return null;
    return calculateEventHealth(
      viewingEvent.budget,
      currentEventExpenses,
      currentEventGuests,
      currentEventTasks,
      currentEventVendors
    );
  }, [viewingEvent, currentEventExpenses, currentEventGuests, currentEventTasks, currentEventVendors]);

  const viewingAlerts = useMemo(() => {
    if (!viewingEvent) return [];
    return generatePriorityAlerts(
      viewingEvent.id,
      [viewingEvent],
      currentEventGuests,
      currentEventExpenses,
      currentEventTasks,
      currentEventVendors,
      currentEventTables,
      formatCurrency
    );
  }, [viewingEvent, currentEventGuests, currentEventExpenses, currentEventTasks, currentEventVendors, currentEventTables, formatCurrency]);

  const viewingActions = useMemo(() => {
    if (!viewingEvent) return [];
    return generateNextActions(
      viewingEvent.id,
      [viewingEvent],
      currentEventGuests,
      currentEventExpenses,
      currentEventTasks,
      currentEventVendors,
      currentEventTables
    );
  }, [viewingEvent, currentEventGuests, currentEventExpenses, currentEventTasks, currentEventVendors, currentEventTables]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar with Action & Filters */}
      <div className="flex flex-col gap-4 paper-card p-5 sm:p-6 rounded-3xl border border-[#E6D5C1] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Box */}
            <div className="relative min-w-[220px] flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#B96E42]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search celebrations by name, venue..."
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

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-[#F7F0E5] border border-[#E6D5C1] rounded-xl text-[#483329] focus:outline-none focus:ring-2 focus:ring-[#D98261]/30 focus:border-[#D98261] transition-colors"
            >
              <option value="ALL">All Event Types</option>
              {eventTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-[#F7F0E5] border border-[#E6D5C1] rounded-xl text-[#483329] focus:outline-none focus:ring-2 focus:ring-[#D98261]/30 focus:border-[#D98261] transition-colors"
            >
              <option value="ALL">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

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

          {/* View Toggle & Add Button */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <div className="flex items-center p-1 bg-[#F7F0E5] rounded-xl border border-[#E6D5C1]">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'cards' ? 'bg-[#FCF8F1] text-[#D98261] shadow-xs' : 'text-[#483329]/60 hover:text-[#29231F]'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-[#FCF8F1] text-[#D98261] shadow-xs' : 'text-[#483329]/60 hover:text-[#29231F]'
                }`}
                title="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#D98261] hover:bg-[#B96E42] active:bg-[#9E5730] rounded-xl transition-all shadow-[0_4px_12px_rgba(217,130,97,0.3)] hover:-translate-y-0.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          </div>
        </div>

        {/* Result Count Status Bar */}
        <div className="flex items-center justify-between text-xs text-[#483329]/70 pt-3 border-t border-[#E6D5C1]">
          <span>
            Showing <strong className="text-[#29231F] font-bold">{filteredEvents.length}</strong> of{' '}
            <strong className="text-[#29231F] font-bold">{events.length}</strong> celebrations
          </span>
          {activeEventId !== 'ALL' && (
            <span className="text-[#D98261] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D98261]" />
              Scope Focused on 1 Event
            </span>
          )}
        </div>
      </div>

      {/* Main Events Listing */}
      {events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events scheduled yet"
          description="Create your first event to begin coordinating guests, vendors, and seating."
          actionLabel="Create Event"
          onAction={onOpenCreateModal}
        />
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-[#FCF8F1] rounded-3xl border border-[#E6D5C1]">
          <Calendar className="w-10 h-10 text-[#D98261]/50 mx-auto mb-3" />
          <h4 className="text-lg font-editorial font-bold text-[#29231F]">No matching celebrations found</h4>
          <p className="text-xs text-[#483329]/70 max-w-sm mx-auto mt-1 mb-4 font-serif">
            Try adjusting your search query or reset the type and status filters.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-bold text-[#B96E42] bg-[#D98261]/15 hover:bg-[#D98261]/25 rounded-xl transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((evt) => {
            const isCurrentlyActive = activeEventId === evt.id;
            const eventGuests = guests.filter(g => g.eventId === evt.id);
            const eventExpenses = expenses.filter(e => e.eventId === evt.id);
            const eventTasks = tasks.filter(t => t.eventId === evt.id);
            const eventVendors = vendors.filter(v => v.eventId === evt.id);

            const cardHealth = calculateEventHealth(evt.budget, eventExpenses, eventGuests, eventTasks, eventVendors);
            const cardCountdown = calculateEventCountdown(evt.date, evt.status);

            return (
              <div
                key={evt.id}
                className={`paper-card rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                  isCurrentlyActive 
                    ? 'border-[#D98261] shadow-lg ring-2 ring-[#D98261]/20' 
                    : 'border-[#E6D5C1] hover:border-[#D98261] shadow-xs hover:shadow-md'
                }`}
              >
                {/* Card Top Banner */}
                <div className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B96E42] bg-[#F7F0E5] px-2.5 py-0.5 rounded-full border border-[#E6D5C1]">
                        {evt.type}
                      </span>
                      <span className="text-[10px] font-semibold text-[#483329] bg-[#E6D5C1]/40 px-2 py-0.5 rounded-full border border-[#E6D5C1]">
                        {cardCountdown.text}
                      </span>
                    </div>
                    <EventStatusBadge status={evt.status} />
                  </div>

                  <h3 
                    onClick={() => {
                      setViewingEvent(evt);
                      setDetailTab('overview');
                    }}
                    className="text-lg font-editorial font-bold text-[#29231F] tracking-tight line-clamp-1 hover:text-[#D98261] transition-colors cursor-pointer"
                  >
                    {evt.name}
                  </h3>

                  <p className="text-xs text-[#483329]/75 mt-1 line-clamp-2 leading-relaxed font-serif">
                    {evt.description || 'No specific description provided for this scheduled event.'}
                  </p>
                </div>

                {/* Card Specs */}
                <div className="px-5 py-3 bg-[#F7F0E5]/80 border-y border-[#E6D5C1] space-y-2 text-xs text-[#483329]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#B96E42] shrink-0" />
                    <span>{evt.date}</span>
                    <span className="text-[#E6D5C1]">·</span>
                    <Clock className="w-3.5 h-3.5 text-[#B96E42] shrink-0" />
                    <span>{evt.time}</span>
                  </div>

                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#A6A77A] shrink-0" />
                    <span className="truncate">{evt.venue}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Users className="w-3.5 h-3.5 text-[#483329]/70" />
                      <span>{evt.expectedGuests} Guests</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-[#29231F] font-mono">
                      <Wallet className="w-3.5 h-3.5 text-[#B96E42]" />
                      <span>{formatCurrency(evt.budget)}</span>
                    </div>
                  </div>
                </div>

                {/* Event Health & Progress Indicator */}
                <div className="px-5 py-3 bg-[#FCF8F1] border-b border-[#E6D5C1] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#B96E42]">Planning Health</span>
                    <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-[#F7F0E5] text-[#29231F] border border-[#E6D5C1]">
                      {cardHealth.score}/100 • {cardHealth.level}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-0.5">
                    {/* Tasks Progress */}
                    <div>
                      <div className="flex justify-between text-[10px] text-[#483329]/70 mb-0.5">
                        <span>Checklist Execution</span>
                        <span className="font-bold text-[#29231F]">{cardHealth.taskRate}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#E6D5C1]/50 rounded-full overflow-hidden">
                        <div className="h-full bg-[#A6A77A] rounded-full transition-all" style={{ width: `${cardHealth.taskRate}%` }} />
                      </div>
                    </div>

                    {/* RSVP Progress */}
                    <div>
                      <div className="flex justify-between text-[10px] text-[#483329]/70 mb-0.5">
                        <span>RSVP Confirmed</span>
                        <span className="font-bold text-[#29231F]">{cardHealth.rsvpRate}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#E6D5C1]/50 rounded-full overflow-hidden">
                        <div className="h-full bg-[#D98261] rounded-full transition-all" style={{ width: `${cardHealth.rsvpRate}%` }} />
                      </div>
                    </div>

                    {/* Budget Usage */}
                    <div>
                      <div className="flex justify-between text-[10px] text-[#483329]/70 mb-0.5">
                        <span>Budget Utilized</span>
                        <span className={`font-bold ${cardHealth.budgetPercent >= 100 ? 'text-[#B96E42]' : 'text-[#29231F]'}`}>
                          {cardHealth.budgetPercent}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#E6D5C1]/50 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            cardHealth.budgetPercent >= 100 ? 'bg-[#B96E42]' : 'bg-[#D98261]'
                          }`} 
                          style={{ width: `${Math.min(cardHealth.budgetPercent, 100)}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 flex items-center justify-between gap-2 bg-[#FCF8F1]">
                  <button
                    type="button"
                    onClick={() => setActiveEventId(isCurrentlyActive ? 'ALL' : evt.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                      isCurrentlyActive
                        ? 'bg-[#D98261] text-white shadow-xs'
                        : 'bg-[#F7F0E5] text-[#483329] hover:bg-[#E6D5C1] border border-[#E6D5C1]'
                    }`}
                  >
                    {isCurrentlyActive ? '✓ In Scope' : 'Set Scope'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setViewingEvent(evt);
                        setDetailTab('overview');
                      }}
                      className="px-2.5 py-1.5 text-xs font-semibold text-[#B96E42] bg-[#D98261]/15 hover:bg-[#D98261]/25 rounded-xl transition-colors flex items-center gap-1"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenEditModal(evt)}
                      className="p-1.5 text-[#483329]/60 hover:text-[#D98261] hover:bg-[#F7F0E5] rounded-xl transition-colors"
                      title="Edit Event"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEventToDelete(evt)}
                      className="p-1.5 text-[#483329]/60 hover:text-[#B96E42] hover:bg-[#D98261]/15 rounded-xl transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="paper-card rounded-3xl border border-[#E6D5C1] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#483329]">
              <thead className="bg-[#F7F0E5] text-[11px] font-bold text-[#B96E42] uppercase tracking-wider border-b border-[#E6D5C1]">
                <tr>
                  <th className="py-3.5 px-4">Event Details</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Venue</th>
                  <th className="py-3.5 px-4">Guests</th>
                  <th className="py-3.5 px-4">Budget</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6D5C1]/60 font-normal">
                {filteredEvents.map((evt) => {
                  const isCurrentlyActive = activeEventId === evt.id;
                  return (
                    <tr key={evt.id} className="hover:bg-[#F7F0E5]/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#29231F] max-w-[200px]">
                        <div className="flex items-center gap-2">
                          {isCurrentlyActive && (
                            <span className="w-2 h-2 rounded-full bg-[#D98261]" title="Active Focus" />
                          )}
                          <span 
                            onClick={() => {
                              setViewingEvent(evt);
                              setDetailTab('overview');
                            }}
                            className="truncate cursor-pointer hover:text-[#D98261]"
                          >
                            {evt.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F7F0E5] text-[#483329] border border-[#E6D5C1] font-semibold">
                          {evt.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                        {evt.date} <span className="text-[#483329]/60 font-mono">({evt.time})</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs max-w-[180px] truncate">
                        {evt.venue}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold">
                        {evt.expectedGuests}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-bold text-[#29231F] whitespace-nowrap font-mono">
                        {formatCurrency(evt.budget)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <EventStatusBadge status={evt.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setViewingEvent(evt);
                              setDetailTab('overview');
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-[#B96E42] bg-[#D98261]/15 hover:bg-[#D98261]/25 rounded-xl transition-colors flex items-center gap-1"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenEditModal(evt)}
                            className="p-1.5 text-[#483329]/60 hover:text-[#D98261] hover:bg-[#F7F0E5] rounded-xl transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEventToDelete(evt)}
                            className="p-1.5 text-[#483329]/60 hover:text-[#B96E42] hover:bg-[#D98261]/15 rounded-xl transition-colors"
                            title="Delete"
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

      {/* COMPREHENSIVE EVENT DETAILS MODAL */}
      {viewingEvent && (
        <Modal
          isOpen={!!viewingEvent}
          onClose={() => setViewingEvent(null)}
          title={viewingEvent.name}
          subtitle={`${viewingEvent.type} • ${viewingEvent.date} at ${viewingEvent.time}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Event Command Center: Health, Countdown & Info Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#29231F] text-[#FCF8F1] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <EventStatusBadge status={viewingEvent.status} />
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#483329] border border-[#E6D5C1]/20 text-[#E6D5C1] font-medium">
                    Type: {viewingEvent.type}
                  </span>
                  {viewingCountdown && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#D98261]/25 text-[#FCF8F1] border border-[#D98261]/40 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#D98261]" />
                      {viewingCountdown.text}
                    </span>
                  )}
                </div>

                {viewingHealth && (
                  <div className="px-2.5 py-0.5 rounded-full text-xs font-bold border border-[#A6A77A]/40 bg-[#A6A77A]/20 text-[#FCF8F1] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#A6A77A]" />
                    <span>{viewingHealth.score} / 100 • {viewingHealth.level}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#E6D5C1]/80 pt-2 border-t border-[#483329]">
                <div>
                  <span className="text-[#D98261] uppercase font-bold text-[10px] block">Scheduled Date & Time</span>
                  <p className="font-semibold text-white mt-0.5">{viewingEvent.date} at {viewingEvent.time}</p>
                </div>
                <div>
                  <span className="text-[#D98261] uppercase font-bold text-[10px] block">Venue Location</span>
                  <p className="font-semibold text-white mt-0.5 truncate">{viewingEvent.venue}</p>
                </div>
              </div>

              {viewingHealth && (
                <div className="pt-2 border-t border-[#483329] text-xs text-[#E6D5C1]/80 font-serif italic">
                  <span className="text-[#D98261] font-sans font-bold block text-[11px] not-italic">Health Assessment:</span>
                  <p className="mt-0.5 leading-relaxed">{viewingHealth.explanation}</p>
                </div>
              )}
            </div>

            {/* 4 Compact Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-[#F7F0E5] border border-[#E6D5C1] text-center shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-[#B96E42] block">Guests</span>
                <p className="text-base font-editorial font-bold text-[#29231F] mt-0.5 tabular-nums">
                  {currentEventGuests.length} <span className="text-xs text-[#483329]/60 font-normal font-sans">/ {viewingEvent.expectedGuests}</span>
                </p>
                <span className="text-[10px] text-[#483329]/70 block mt-0.5">Roster / Target</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F7F0E5] border border-[#E6D5C1] text-center shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-[#B96E42] block">RSVP Health</span>
                <p className="text-base font-editorial font-bold text-[#29231F] mt-0.5 tabular-nums">
                  {currentEventConfirmedRSVP} <span className="text-xs text-[#A6A77A] font-normal font-sans">confirmed</span>
                </p>
                <span className="text-[10px] text-[#A6A77A] font-semibold block mt-0.5">
                  {viewingHealth?.rsvpRate || 0}% confirmed
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F7F0E5] border border-[#E6D5C1] text-center shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-[#B96E42] block">Expenses</span>
                <p className="text-base font-editorial font-bold text-[#29231F] mt-0.5 tabular-nums">{formatCurrency(currentEventSpent)}</p>
                <span className="text-[10px] text-[#483329]/70 font-medium block mt-0.5">
                  {viewingHealth?.budgetPercent || 0}% of {formatCurrency(viewingEvent.budget)}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F7F0E5] border border-[#E6D5C1] text-center shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-[#B96E42] block">Checklist</span>
                <p className="text-base font-editorial font-bold text-[#29231F] mt-0.5 tabular-nums">
                  {currentEventTasks.filter(t => t.status === 'Completed').length} <span className="text-xs text-[#483329]/60 font-normal font-sans">/ {currentEventTasks.length}</span>
                </p>
                <span className="text-[10px] text-[#D98261] font-semibold block mt-0.5">
                  {viewingHealth?.taskRate || 0}% tasks complete
                </span>
              </div>
            </div>

            {/* Needs Attention & Next Actions Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F7F0E5] border border-[#E6D5C1]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#29231F]">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#D98261]" />
                    <span>Needs Attention</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#B96E42]">
                    {viewingAlerts.length} issues
                  </span>
                </div>
                {viewingAlerts.length === 0 ? (
                  <div className="py-3 text-center text-xs text-[#483329]/70 font-serif italic">
                    Planning is running smoothly ✨
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {viewingAlerts.map(a => (
                      <div key={a.id} className="p-2 rounded-xl bg-[#FCF8F1] border border-[#E6D5C1] text-[11px] flex items-start gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                          a.severity === 'critical' ? 'bg-[#B96E42]' : 'bg-[#D98261]'
                        }`} />
                        <span className="text-[#29231F] leading-snug">{a.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F0E5] border border-[#E6D5C1]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#29231F]">
                    <ListTodo className="w-3.5 h-3.5 text-[#A6A77A]" />
                    <span>Next Actions</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#A6A77A]">
                    {viewingActions.length} planned
                  </span>
                </div>
                {viewingActions.length === 0 ? (
                  <div className="py-3 text-center text-xs text-[#483329]/70 font-serif italic">
                    No pending checklist items.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {viewingActions.map(act => (
                      <div key={act.id} className="p-2 rounded-xl bg-[#FCF8F1] border border-[#E6D5C1] text-[11px] flex items-center justify-between gap-1">
                        <span className="text-[#29231F] font-semibold truncate">{act.action}</span>
                        <span className="text-[10px] font-bold text-[#D98261] shrink-0">{act.statusText}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Event Planning Sub-Tabs */}
            <div className="border border-[#E6D5C1] rounded-2xl overflow-hidden bg-[#FCF8F1]">
              <div className="flex border-b border-[#E6D5C1] bg-[#F7F0E5] text-xs font-bold overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setDetailTab('overview')}
                  className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
                    detailTab === 'overview' ? 'border-[#D98261] text-[#D98261] bg-[#FCF8F1]' : 'border-transparent text-[#483329]/70 hover:text-[#29231F]'
                  }`}
                >
                  RSVP & Headcount
                </button>
                <button
                  type="button"
                  onClick={() => setDetailTab('guests')}
                  className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
                    detailTab === 'guests' ? 'border-[#D98261] text-[#D98261] bg-[#FCF8F1]' : 'border-transparent text-[#483329]/70 hover:text-[#29231F]'
                  }`}
                >
                  Guests ({currentEventGuests.length})
                </button>
                <button
                  type="button"
                  onClick={() => setDetailTab('expenses')}
                  className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
                    detailTab === 'expenses' ? 'border-[#D98261] text-[#D98261] bg-[#FCF8F1]' : 'border-transparent text-[#483329]/70 hover:text-[#29231F]'
                  }`}
                >
                  Expenses ({currentEventExpenses.length})
                </button>
                <button
                  type="button"
                  onClick={() => setDetailTab('vendors')}
                  className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
                    detailTab === 'vendors' ? 'border-[#D98261] text-[#D98261] bg-[#FCF8F1]' : 'border-transparent text-[#483329]/70 hover:text-[#29231F]'
                  }`}
                >
                  Vendors ({currentEventVendors.length})
                </button>
                <button
                  type="button"
                  onClick={() => setDetailTab('tasks')}
                  className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
                    detailTab === 'tasks' ? 'border-[#D98261] text-[#D98261] bg-[#FCF8F1]' : 'border-transparent text-[#483329]/70 hover:text-[#29231F]'
                  }`}
                >
                  Tasks ({currentEventTasks.length})
                </button>
                <button
                  type="button"
                  onClick={() => setDetailTab('seating')}
                  className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
                    detailTab === 'seating' ? 'border-[#D98261] text-[#D98261] bg-[#FCF8F1]' : 'border-transparent text-[#483329]/70 hover:text-[#29231F]'
                  }`}
                >
                  Tables ({currentEventTables.length})
                </button>
              </div>

              {/* Sub-tab Content Area */}
              <div className="p-4 max-h-60 overflow-y-auto">
                {detailTab === 'overview' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div className="p-3 bg-[#A6A77A]/15 rounded-2xl border border-[#A6A77A]/30">
                        <span className="text-[#555635] font-bold block">Confirmed</span>
                        <span className="text-xl font-editorial font-bold text-[#29231F] mt-1 tabular-nums">{currentEventConfirmedRSVP}</span>
                      </div>
                      <div className="p-3 bg-[#D98261]/15 rounded-2xl border border-[#D98261]/30">
                        <span className="text-[#B96E42] font-bold block">Pending</span>
                        <span className="text-xl font-editorial font-bold text-[#29231F] mt-1 tabular-nums">{currentEventPendingRSVP}</span>
                      </div>
                      <div className="p-3 bg-[#F7F0E5] rounded-2xl border border-[#E6D5C1]">
                        <span className="text-[#483329] font-bold block">Declined</span>
                        <span className="text-xl font-editorial font-bold text-[#483329] mt-1 tabular-nums">{currentEventDeclinedRSVP}</span>
                      </div>
                    </div>
                  </div>
                )}

                {detailTab === 'guests' && (
                  currentEventGuests.length === 0 ? (
                    <p className="text-xs text-[#483329]/60 py-4 text-center font-serif italic">No guests added to this event yet.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {currentEventGuests.map(g => (
                        <div key={g.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F0E5] text-xs">
                          <div>
                            <span className="font-bold text-[#29231F]">{g.name}</span>
                            <span className="text-[11px] text-[#483329]/60 ml-2">({g.category})</span>
                          </div>
                          <RSVPBadge status={g.rsvpStatus} />
                        </div>
                      ))}
                    </div>
                  )
                )}

                {detailTab === 'expenses' && (
                  currentEventExpenses.length === 0 ? (
                    <p className="text-xs text-[#483329]/60 py-4 text-center font-serif italic">No expenses recorded for this event yet.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {currentEventExpenses.map(e => (
                        <div key={e.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F0E5] text-xs">
                          <div>
                            <span className="font-bold text-[#29231F]">{e.name}</span>
                            <span className="text-[11px] text-[#483329]/60 ml-2">({e.category})</span>
                          </div>
                          <span className="font-bold text-[#29231F] font-mono">{formatCurrency(e.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {detailTab === 'vendors' && (
                  currentEventVendors.length === 0 ? (
                    <p className="text-xs text-[#483329]/60 py-4 text-center font-serif italic">No vendors assigned to this event yet.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {currentEventVendors.map(v => (
                        <div key={v.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F0E5] text-xs">
                          <div>
                            <span className="font-bold text-[#29231F]">{v.name}</span>
                            <span className="text-[11px] text-[#483329]/60 ml-2">({v.category})</span>
                          </div>
                          <span className="font-bold text-[#29231F] font-mono">{formatCurrency(v.cost)}</span>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {detailTab === 'tasks' && (
                  currentEventTasks.length === 0 ? (
                    <p className="text-xs text-[#483329]/60 py-4 text-center font-serif italic">No tasks scheduled for this event yet.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {currentEventTasks.map(t => (
                        <div key={t.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F0E5] text-xs">
                          <span className="font-bold text-[#29231F]">{t.name}</span>
                          <TaskStatusBadge status={t.status} />
                        </div>
                      ))}
                    </div>
                  )
                )}

                {detailTab === 'seating' && (
                  currentEventTables.length === 0 ? (
                    <p className="text-xs text-[#483329]/60 py-4 text-center font-serif italic">No tables defined for this event yet.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {currentEventTables.map(tbl => {
                        const seated = currentEventGuests.filter(g => g.tableId === tbl.id).length;
                        return (
                          <div key={tbl.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F0E5] text-xs">
                            <span className="font-bold text-[#29231F]">{tbl.name} ({tbl.shape})</span>
                            <span className="font-semibold text-[#B96E42]">{seated} / {tbl.capacity} Seats</span>
                          </div>
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!eventToDelete}
        onClose={() => setEventToDelete(null)}
        onConfirm={() => {
          if (eventToDelete) deleteEvent(eventToDelete.id);
        }}
        title="Delete Celebration"
        message={`Are you sure you want to delete "${eventToDelete?.name}"? All associated attendees, expense records, and table assignments will also be deleted.`}
        confirmLabel="Delete Event"
        isDestructive={true}
      />
    </div>
  );
};
