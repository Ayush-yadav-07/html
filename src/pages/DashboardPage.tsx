import React, { useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Wallet, 
  Building2, 
  ListTodo, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight,
  Plus,
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  AlertOctagon, 
  Activity, 
  Armchair,
  Layers,
  ChevronRight,
  Compass
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { StatCard } from '../components/common/StatCard';
import { EventStatusBadge } from '../components/common/Badge';
import { NavTab } from '../components/layout/Sidebar';
import { ExpenseCategory } from '../types';
import { EventCommandCenter } from '../components/dashboard/EventCommandCenter';
import { PartnerMarquee } from '../components/common/PartnerMarquee';
import { IsometricVenueScene } from '../components/dashboard/IsometricVenueScene';
import { calculateEventCountdown } from '../utils/commandCenter';

interface DashboardPageProps {
  onNavigate: (tab: NavTab) => void;
  onOpenAddModal: (type: 'event' | 'guest' | 'expense' | 'vendor' | 'task') => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenAddModal,
}) => {
  const { 
    events, 
    stats, 
    formatCurrency, 
    activeEvent, 
    activeEventId,
    setActiveEventId,
    filteredExpenses,
    tables
  } = useEventContext();

  // Upcoming events
  const upcomingEventsList = useMemo(() => {
    let list = [...events].filter(e => e.status === 'Upcoming' || e.status === 'In Progress');
    if (activeEventId !== 'ALL') {
      const active = list.find(e => e.id === activeEventId);
      const rest = list.filter(e => e.id !== activeEventId);
      list = active ? [active, ...rest] : list;
    }
    return list.slice(0, 5);
  }, [events, activeEventId]);

  // Featured Event Resolution
  const featuredEvent = useMemo(() => {
    if (activeEvent) return activeEvent;
    const upcoming = events.filter(e => e.status !== 'Completed');
    return upcoming.length > 0 ? upcoming[0] : events[0];
  }, [activeEvent, events]);

  const featuredCountdown = useMemo(() => {
    if (!featuredEvent) return null;
    return calculateEventCountdown(featuredEvent.date, featuredEvent.status);
  }, [featuredEvent]);

  // RSVP metrics
  const totalRsvps = (stats.rsvpConfirmed + stats.rsvpPending + stats.rsvpDeclined) || 1;
  const confirmedPercent = Math.round((stats.rsvpConfirmed / totalRsvps) * 100);
  const pendingPercent = Math.round((stats.rsvpPending / totalRsvps) * 100);
  const declinedPercent = Math.round((stats.rsvpDeclined / totalRsvps) * 100);

  // Budget category breakdown calculation from filteredExpenses
  const expenseCategories: ExpenseCategory[] = [
    'Venue',
    'Catering',
    'Decoration',
    'Photography',
    'Transport',
    'Entertainment',
    'Other',
  ];

  const categorySpending = useMemo(() => {
    const map: Record<string, number> = {};
    expenseCategories.forEach(cat => { map[cat] = 0; });
    filteredExpenses.forEach(exp => {
      map[exp.category] = (map[exp.category] || 0) + exp.amount;
    });
    return map;
  }, [filteredExpenses]);

  const maxCategorySpend = Math.max(...Object.values(categorySpending), 1);

  // Budget health system alert
  const { isBudgetHighAlert, budgetUsagePercent } = stats;

  return (
    <div className="space-y-8 pb-14">
      {/* 1. EDITORIAL COVER & FEATURED EVENT HERO WITH 3D VENUE SCENE */}
      <div className="paper-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E6D5C1] shadow-lg relative overflow-hidden space-y-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Editorial Invitation Cover & Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Atelier Crest / Stamp */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B96E42] bg-[#F7F0E5] px-3 py-1 rounded-full border border-[#E6D5C1] shadow-2xs">
                {activeEvent ? 'Featured Event Atelier' : 'EventEase Unified Planning Studio'}
              </span>
              <span className="text-[#E6D5C1]">·</span>
              <span className="text-xs font-serif italic text-[#483329]/80">
                {events.length} Curated Celebrations in Portfolio
              </span>
            </div>

            {/* Editorial Title & Meta */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-[#29231F] tracking-tight leading-[1.12]">
                {featuredEvent ? featuredEvent.name : 'Event Planning & Management Studio'}
              </h1>

              {/* Invitation Metadata Chips */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#483329] mt-4 font-medium">
                {featuredEvent && (
                  <>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1] shadow-2xs">
                      <Calendar className="w-3.5 h-3.5 text-[#D98261]" />
                      <span className="font-semibold">{featuredEvent.date}</span>
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1] shadow-2xs">
                      <Clock className="w-3.5 h-3.5 text-[#D98261]" />
                      <span>{featuredEvent.time}</span>
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1] shadow-2xs truncate max-w-[220px]">
                      <MapPin className="w-3.5 h-3.5 text-[#A6A77A]" />
                      <span className="truncate">{featuredEvent.venue}</span>
                    </span>
                    {featuredCountdown && (
                      <span className="px-3 py-1.5 rounded-xl bg-[#D98261]/15 text-[#B96E42] border border-[#D98261]/40 font-bold shadow-2xs">
                        {featuredCountdown.text}
                      </span>
                    )}
                  </>
                )}
              </div>

              <p className="text-sm text-[#483329]/85 mt-3.5 leading-relaxed max-w-2xl font-serif text-base sm:text-lg">
                {featuredEvent 
                  ? (featuredEvent.description || 'Welcome to the dedicated planning studio for this event. Monitor real-time RSVP attendance, banquet placements, budget disbursements, and vendor deliverables.')
                  : 'Design memorable moments with structured guest RSVPs, budget tracking, vendor coordination, timelines, and architectural seating plans.'}
              </p>
            </div>

            {/* Scope Selector Control Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F7F0E5] border border-[#E6D5C1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
              <div className="min-w-0">
                <label htmlFor="dashboard-scope-select" className="text-[10px] font-bold text-[#B96E42] uppercase tracking-wider block">
                  Active Event Focus Scope
                </label>
                <p className="text-xs text-[#483329]/75 mt-0.5 truncate font-medium">
                  {activeEvent ? `Focusing exclusively on "${activeEvent.name}"` : 'Aggregating all events across portfolio'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  id="dashboard-scope-select"
                  value={activeEventId}
                  onChange={(e) => setActiveEventId(e.target.value)}
                  className="bg-[#FCF8F1] text-[#29231F] border border-[#E6D5C1] text-xs font-semibold rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#D98261] transition-colors shadow-2xs cursor-pointer"
                >
                  <option value="ALL">🌿 All Events Portfolio</option>
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.name}
                    </option>
                  ))}
                </select>
                {activeEventId !== 'ALL' && (
                  <button
                    type="button"
                    onClick={() => setActiveEventId('ALL')}
                    className="text-xs font-semibold text-[#D98261] hover:text-[#B96E42] underline whitespace-nowrap cursor-pointer"
                  >
                    All
                  </button>
                )}
              </div>
            </div>

            {/* Quick Actions Row */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B96E42] block mb-2.5">
                Quick Studio Actions
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenAddModal('event')}
                  className="tactile-button flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#D98261] hover:bg-[#B96E42] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Event</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAddModal('guest')}
                  className="tactile-button flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#FCF8F1] hover:bg-[#F7F0E5] text-[#29231F] border border-[#E6D5C1] text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#A6A77A]" />
                  <span>Add Guest</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAddModal('expense')}
                  className="tactile-button flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#FCF8F1] hover:bg-[#F7F0E5] text-[#29231F] border border-[#E6D5C1] text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#B96E42]" />
                  <span>Add Expense</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAddModal('vendor')}
                  className="tactile-button flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#FCF8F1] hover:bg-[#F7F0E5] text-[#29231F] border border-[#E6D5C1] text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#D98261]" />
                  <span>Add Vendor</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAddModal('task')}
                  className="tactile-button col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#FCF8F1] hover:bg-[#F7F0E5] text-[#29231F] border border-[#E6D5C1] text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#483329]" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Signature 3D Isometric Event Venue Mini (5 cols) */}
          <div className="lg:col-span-5">
            <IsometricVenueScene
              activeEvent={featuredEvent}
              tables={tables}
              totalGuests={featuredEvent ? featuredEvent.expectedGuests : stats.totalGuests}
            />
          </div>
        </div>

        {/* Vendor Partner Strip */}
        <div className="pt-3 border-t border-[#E6D5C1]">
          <PartnerMarquee />
        </div>
      </div>

      {/* 2. EVENT COMMAND CENTER (Live Countdown, Health Score, Needs Attention, Next Actions) */}
      <EventCommandCenter onNavigate={onNavigate} />

      {/* 3. ASYMMETRICAL STATISTIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon={<Calendar className="w-5 h-5" />}
          subtitle={activeEvent ? 'Focused Event Active' : 'Total events in portfolio'}
          colorScheme="terracotta"
          featured={true}
          onClick={() => onNavigate('events')}
        />

        <StatCard
          title="Upcoming Schedule"
          value={stats.upcomingEvents}
          icon={<Clock className="w-5 h-5" />}
          subtitle={activeEvent ? `${activeEvent.status} event` : 'Scheduled celebrations'}
          colorScheme="clay"
          onClick={() => onNavigate('events')}
        />

        <StatCard
          title="Guest Attendance"
          value={stats.totalGuests}
          icon={<Users className="w-5 h-5" />}
          subtitle={`Total party headcount: ${stats.headcountWithPlusOnes}`}
          colorScheme="olive"
          onClick={() => onNavigate('guests')}
        />

        <StatCard
          title="Allocated Budget"
          value={formatCurrency(stats.totalBudget)}
          icon={<Wallet className="w-5 h-5" />}
          subtitle={activeEvent ? 'Allocated for this event' : 'Sum of active budgets'}
          colorScheme="sand"
          onClick={() => onNavigate('budget')}
        />

        <StatCard
          title="Disbursed Expenses"
          value={formatCurrency(stats.totalSpent)}
          icon={<TrendingUp className="w-5 h-5" />}
          subtitle={`${stats.budgetUsagePercent}% of budget disbursed`}
          colorScheme="terracotta"
          onClick={() => onNavigate('budget')}
        />

        <StatCard
          title="Remaining Cushion"
          value={formatCurrency(stats.remainingBudget)}
          icon={<Wallet className="w-5 h-5" />}
          subtitle={stats.remainingBudget < 0 ? 'Deficit warning!' : 'Available spending reserve'}
          colorScheme="olive"
          onClick={() => onNavigate('budget')}
        />

        <StatCard
          title="Contracted Vendors"
          value={stats.totalVendors}
          icon={<Building2 className="w-5 h-5" />}
          subtitle={activeEvent ? 'Vendors for this event' : 'All partnered agencies'}
          colorScheme="sand"
          onClick={() => onNavigate('vendors')}
        />

        <StatCard
          title="Pending Checklist"
          value={stats.pendingTasks}
          icon={<ListTodo className="w-5 h-5" />}
          subtitle={`${stats.inProgressTasks} in progress • ${stats.completedTasks} completed`}
          colorScheme="clay"
          onClick={() => onNavigate('timeline')}
        />
      </div>

      {/* 4. BUDGET HEALTH ALERT */}
      {isBudgetHighAlert && (
        <div className="paper-card rounded-2xl p-4 sm:p-5 border border-[#D98261] bg-[#FCF8F1] shadow-xs flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-[#D98261]/20 text-[#B96E42] shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-[#29231F]">
                High Budget Utilization Alert
              </h4>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#D98261]/20 text-[#B96E42] border border-[#D98261]/40 font-mono">
                {budgetUsagePercent}% Utilized
              </span>
            </div>
            <p className="text-xs text-[#483329]/80 mt-1 leading-relaxed font-medium">
              Expenses have surpassed the 80% allocation threshold for {activeEvent ? activeEvent.name : 'the current active event scope'}. Review itemized invoices and contracts.
            </p>
          </div>
        </div>
      )}

      {/* 5. ROW 2: BUDGET ALLOCATION & RSVP HEALTH SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Overview (2 cols) */}
        <div className="lg:col-span-2 paper-card rounded-3xl p-6 sm:p-7 border border-[#E6D5C1] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-editorial font-bold text-[#29231F] tracking-tight">
                  Budget & Fiscal Disbursement
                </h3>
                <p className="text-xs text-[#483329]/70 mt-0.5 font-medium">
                  {activeEvent ? `Financial breakdown for ${activeEvent.name}` : 'Real-time allocation vs expenditure'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('budget')}
                className="text-xs font-bold text-[#D98261] hover:text-[#B96E42] flex items-center gap-1 transition-colors cursor-pointer"
              >
                Detailed Ledger <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Inset Metrics Strip */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F7F0E5] border border-[#E6D5C1] mb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#B96E42]">Total Allocation</p>
                <p className="text-base sm:text-lg font-editorial font-bold text-[#29231F] mt-0.5 tabular-nums">
                  {formatCurrency(stats.totalBudget)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#B96E42]">Disbursed</p>
                <p className="text-base sm:text-lg font-editorial font-bold text-[#29231F] mt-0.5 tabular-nums">
                  {formatCurrency(stats.totalSpent)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#B96E42]">Reserve Cushion</p>
                <p className={`text-base sm:text-lg font-editorial font-bold mt-0.5 tabular-nums ${
                  stats.remainingBudget < 0 ? 'text-[#B96E42]' : 'text-[#483329]'
                }`}>
                  {formatCurrency(stats.remainingBudget)}
                </p>
              </div>
            </div>

            {/* Budget Usage Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#29231F]">Disbursement Progress</span>
                <span className="font-bold text-[#D98261] font-mono">{stats.budgetUsagePercent}%</span>
              </div>
              <div className="w-full h-3 bg-[#E6D5C1]/50 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    stats.budgetUsagePercent >= 100
                      ? 'bg-[#B96E42]'
                      : 'bg-[#D98261]'
                  }`}
                  style={{ width: `${Math.min(stats.budgetUsagePercent, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#483329]/70 font-medium">
                <span>0% Disbursed</span>
                <span>{stats.remainingBudget >= 0 ? `${formatCurrency(stats.remainingBudget)} Available` : 'Deficit Exceeded'}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#E6D5C1] flex items-center justify-between text-xs text-[#483329]/80">
            <span>Status: <strong>{stats.remainingBudget >= 0 ? 'Within Allocation' : 'Deficit Exceeded'}</strong></span>
            <button
              type="button"
              onClick={() => onOpenAddModal('expense')}
              className="inline-flex items-center gap-1 font-bold text-[#D98261] hover:text-[#B96E42] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Record Expense Voucher
            </button>
          </div>
        </div>

        {/* RSVP Summary Widget (1 col) */}
        <div className="paper-card rounded-3xl p-6 sm:p-7 border border-[#E6D5C1] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-editorial font-bold text-[#29231F] tracking-tight">
                  RSVP Response Health
                </h3>
                <p className="text-xs text-[#483329]/70 mt-0.5 font-medium">Live attendee confirmations</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('guests')}
                className="text-xs font-bold text-[#D98261] hover:text-[#B96E42] flex items-center gap-1 cursor-pointer"
              >
                Guest List <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Confirmed */}
              <div className="p-3 rounded-2xl bg-[#A6A77A]/15 border border-[#A6A77A]/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#555635]" />
                  <div>
                    <span className="text-xs font-bold text-[#29231F]">Confirmed Attendees</span>
                    <p className="text-[11px] text-[#555635]">{confirmedPercent}% of guest list</p>
                  </div>
                </div>
                <span className="text-lg font-editorial font-bold text-[#29231F] tabular-nums">{stats.rsvpConfirmed}</span>
              </div>

              {/* Pending */}
              <div className="p-3 rounded-2xl bg-[#D98261]/15 border border-[#D98261]/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-5 h-5 text-[#D98261]" />
                  <div>
                    <span className="text-xs font-bold text-[#29231F]">Awaiting Response</span>
                    <p className="text-[11px] text-[#B96E42]">{pendingPercent}% pending follow-up</p>
                  </div>
                </div>
                <span className="text-lg font-editorial font-bold text-[#29231F] tabular-nums">{stats.rsvpPending}</span>
              </div>

              {/* Declined */}
              <div className="p-3 rounded-2xl bg-[#F7F0E5] border border-[#E6D5C1] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <XCircle className="w-5 h-5 text-[#8A7969]" />
                  <div>
                    <span className="text-xs font-bold text-[#483329]">Declined Invitations</span>
                    <p className="text-[11px] text-[#483329]/60">{declinedPercent}% unable to attend</p>
                  </div>
                </div>
                <span className="text-lg font-editorial font-bold text-[#483329] tabular-nums">{stats.rsvpDeclined}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#E6D5C1] flex items-center justify-between text-xs text-[#483329]/70">
            <span>Roster Total: <strong>{stats.totalGuests} Guests</strong></span>
            <button
              type="button"
              onClick={() => onOpenAddModal('guest')}
              className="inline-flex items-center gap-1 font-bold text-[#D98261] hover:text-[#B96E42] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Guest
            </button>
          </div>
        </div>
      </div>

      {/* 6. VISUAL SUMMARIES: RSVP Distribution, Budget Categories, Task Completion */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* A. RSVP Distribution */}
        <div className="paper-card rounded-3xl p-6 border border-[#E6D5C1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-editorial font-bold text-[#29231F] tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-[#D98261]" />
                RSVP Distribution
              </h4>
              <span className="text-xs font-bold text-[#483329] font-mono">
                {stats.totalGuests} Total
              </span>
            </div>
            <p className="text-xs text-[#483329]/70 mb-4 font-serif">
              Real-time response breakdown across all invited attendees
            </p>

            {/* Multi-segment bar */}
            <div className="w-full h-3 bg-[#E6D5C1]/50 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="h-full bg-[#A6A77A] transition-all duration-300"
                style={{ width: `${confirmedPercent}%` }}
                title={`Confirmed: ${confirmedPercent}%`}
              />
              <div
                className="h-full bg-[#D98261] transition-all duration-300"
                style={{ width: `${pendingPercent}%` }}
                title={`Pending: ${pendingPercent}%`}
              />
              <div
                className="h-full bg-[#E6D5C1] transition-all duration-300"
                style={{ width: `${declinedPercent}%` }}
                title={`Declined: ${declinedPercent}%`}
              />
            </div>

            {/* Legend pills */}
            <div className="space-y-2 mt-4 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#A6A77A]/15 border border-[#A6A77A]/30">
                <span className="flex items-center gap-1.5 text-[#555635] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#A6A77A]" />
                  Confirmed
                </span>
                <span className="font-bold text-[#29231F] font-mono">
                  {stats.rsvpConfirmed} ({confirmedPercent}%)
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[#D98261]/15 border border-[#D98261]/30">
                <span className="flex items-center gap-1.5 text-[#B96E42] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#D98261]" />
                  Pending
                </span>
                <span className="font-bold text-[#29231F] font-mono">
                  {stats.rsvpPending} ({pendingPercent}%)
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1]">
                <span className="flex items-center gap-1.5 text-[#483329]/80 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#E6D5C1]" />
                  Declined
                </span>
                <span className="font-bold text-[#483329] font-mono">
                  {stats.rsvpDeclined} ({declinedPercent}%)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E6D5C1] text-center">
            <span className="text-[11px] text-[#483329]/70 font-medium">
              Headcount with companions: <strong className="text-[#29231F]">{stats.headcountWithPlusOnes} persons</strong>
            </span>
          </div>
        </div>

        {/* B. Budget Category Breakdown */}
        <div className="paper-card rounded-3xl p-6 border border-[#E6D5C1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-editorial font-bold text-[#29231F] tracking-tight flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#D98261]" />
                Budget Category Breakdown
              </h4>
              <span className="text-xs font-bold text-[#29231F] font-mono">
                {formatCurrency(stats.totalSpent)}
              </span>
            </div>
            <p className="text-xs text-[#483329]/70 mb-4 font-serif">
              Expenses grouped by artisan service category
            </p>

            <div className="space-y-2.5">
              {expenseCategories.slice(0, 5).map(cat => {
                const amount = categorySpending[cat] || 0;
                const percentOfTotal = stats.totalSpent > 0 ? Math.round((amount / stats.totalSpent) * 100) : 0;
                const barWidth = Math.round((amount / maxCategorySpend) * 100);

                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#483329]">{cat}</span>
                      <span className="font-bold text-[#29231F]">
                        {formatCurrency(amount)}{' '}
                        <span className="text-[10px] text-[#483329]/60 font-normal">({percentOfTotal}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#E6D5C1]/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D98261] rounded-full transition-all duration-300"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E6D5C1] flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#483329]/70">{filteredExpenses.length} expense items</span>
            <button
              type="button"
              onClick={() => onNavigate('budget')}
              className="text-xs font-bold text-[#D98261] hover:text-[#B96E42] cursor-pointer"
            >
              All Categories →
            </button>
          </div>
        </div>

        {/* C. Task Completion */}
        <div className="paper-card rounded-3xl p-6 border border-[#E6D5C1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-editorial font-bold text-[#29231F] tracking-tight flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-[#A6A77A]" />
                Task Velocity & Execution
              </h4>
              <span className="text-xs font-bold text-[#A6A77A] bg-[#A6A77A]/15 px-2.5 py-0.5 rounded-full border border-[#A6A77A]/30">
                {stats.completedTasks} / {stats.totalTasks}
              </span>
            </div>
            <p className="text-xs text-[#483329]/70 mb-4 font-serif">
              Planning checklist items and milestones
            </p>

            {/* Task completion progress bar */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between text-xs font-semibold text-[#29231F]">
                <span>Overall Execution</span>
                <span>{stats.completedTasks} Completed</span>
              </div>
              <div className="w-full h-2.5 bg-[#E6D5C1]/50 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-[#A6A77A] rounded-full transition-all duration-300"
                  style={{ width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Status Breakdown Pills */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#A6A77A]/15 border border-[#A6A77A]/30">
                <span className="flex items-center gap-1.5 text-[#555635] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#A6A77A]" />
                  Completed
                </span>
                <span className="font-bold text-[#29231F] font-mono">{stats.completedTasks} Tasks</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[#D98261]/15 border border-[#D98261]/30">
                <span className="flex items-center gap-1.5 text-[#B96E42] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#D98261]" />
                  In Progress
                </span>
                <span className="font-bold text-[#29231F] font-mono">{stats.inProgressTasks} Tasks</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1]">
                <span className="flex items-center gap-1.5 text-[#483329]/80 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#E6D5C1]" />
                  To Do (Pending)
                </span>
                <span className="font-bold text-[#483329] font-mono">{stats.pendingTasks} Tasks</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E6D5C1] flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#483329]/70">Total {stats.totalTasks} Milestones</span>
            <button
              type="button"
              onClick={() => onNavigate('timeline')}
              className="text-xs font-bold text-[#D98261] hover:text-[#B96E42] cursor-pointer"
            >
              Task Board →
            </button>
          </div>
        </div>
      </div>

      {/* 7. UPCOMING EVENTS SCHEDULE */}
      <div className="paper-card rounded-3xl p-6 sm:p-7 border border-[#E6D5C1] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-editorial font-bold text-[#29231F] tracking-tight">
              Upcoming Celebration Calendar
            </h3>
            <p className="text-xs text-[#483329]/70 mt-0.5 font-medium">
              {activeEvent ? `Focusing on ${activeEvent.name}` : 'Chronologically arranged upcoming celebrations'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('events')}
            className="text-xs font-bold text-[#D98261] hover:text-[#B96E42] flex items-center gap-1 cursor-pointer"
          >
            All Events ({events.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {upcomingEventsList.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#483329]/60 font-serif italic">
            No upcoming events scheduled. Create your first event to get started.
          </div>
        ) : (
          <div className="divide-y divide-[#E6D5C1]/70">
            {upcomingEventsList.map((evt) => {
              const isSelected = activeEventId === evt.id;

              return (
                <div
                  key={evt.id}
                  className={`py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3 rounded-2xl transition-all ${
                    isSelected ? 'bg-[#D98261]/10 border border-[#D98261]/30' : 'hover:bg-[#F7F0E5]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#D98261] animate-pulse" title="Active Focus Scope" />
                      )}
                      <h4 className="text-sm font-bold text-[#29231F] truncate max-w-[240px] font-editorial text-base">{evt.name}</h4>
                      <EventStatusBadge status={evt.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#483329]/70 mt-1 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#B96E42]" />
                        {evt.date}
                      </span>
                      <span className="flex items-center gap-1 truncate max-w-[160px]">
                        <MapPin className="w-3.5 h-3.5 text-[#A6A77A]" />
                        {evt.venue}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-[#483329]">
                        <Users className="w-3.5 h-3.5 text-[#483329]" />
                        {evt.expectedGuests} Guests
                      </span>
                      <span className="font-bold text-[#29231F] font-mono">
                        {formatCurrency(evt.budget)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveEventId(isSelected ? 'ALL' : evt.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#D98261] text-white shadow-xs'
                          : 'text-[#B96E42] bg-[#F7F0E5] hover:bg-[#E6D5C1] border border-[#E6D5C1]'
                      }`}
                    >
                      {isSelected ? '✓ In Scope' : 'Set Scope'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('events')}
                      className="px-3 py-1.5 text-xs font-medium text-[#483329] bg-[#FCF8F1] hover:bg-[#F7F0E5] border border-[#E6D5C1] rounded-xl transition-colors cursor-pointer"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
