import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  ListTodo
} from 'lucide-react';
import { useEventContext } from '../../context/EventContext';
import { NavTab } from '../layout/Sidebar';
import { 
  calculateEventCountdown, 
  calculateEventHealth, 
  generatePriorityAlerts, 
  generateNextActions 
} from '../../utils/commandCenter';

interface EventCommandCenterProps {
  onNavigate: (tab: NavTab) => void;
}

export const EventCommandCenter: React.FC<EventCommandCenterProps> = ({ onNavigate }) => {
  const { 
    events, 
    guests, 
    expenses, 
    tasks, 
    vendors, 
    tables, 
    activeEventId, 
    activeEvent, 
    formatCurrency 
  } = useEventContext();

  const currentScopeGuests = activeEventId === 'ALL' ? guests : guests.filter(g => g.eventId === activeEventId);
  const currentScopeExpenses = activeEventId === 'ALL' ? expenses : expenses.filter(e => e.eventId === activeEventId);
  const currentScopeTasks = activeEventId === 'ALL' ? tasks : tasks.filter(t => t.eventId === activeEventId);
  const currentScopeVendors = activeEventId === 'ALL' ? vendors : vendors.filter(v => v.eventId === activeEventId);

  const scopeBudget = activeEvent 
    ? activeEvent.budget 
    : events.reduce((sum, e) => sum + e.budget, 0);

  const healthResult = calculateEventHealth(
    scopeBudget,
    currentScopeExpenses,
    currentScopeGuests,
    currentScopeTasks,
    currentScopeVendors
  );

  let countdownText = 'No events scheduled';
  if (activeEvent) {
    const cd = calculateEventCountdown(activeEvent.date, activeEvent.status);
    countdownText = cd.text;
  } else if (events.length > 0) {
    const upcoming = events
      .filter(e => e.status !== 'Completed')
      .sort((a, b) => a.date.localeCompare(b.date));
    if (upcoming.length > 0) {
      const cd = calculateEventCountdown(upcoming[0].date, upcoming[0].status);
      countdownText = `Next: ${upcoming[0].name.substring(0, 24)} (${cd.text})`;
    } else {
      countdownText = 'All events completed';
    }
  }

  const priorityAlerts = generatePriorityAlerts(
    activeEventId,
    events,
    guests,
    expenses,
    tasks,
    vendors,
    tables,
    formatCurrency
  );

  const nextActions = generateNextActions(
    activeEventId,
    events,
    guests,
    expenses,
    tasks,
    vendors,
    tables
  );

  const confirmedGuestsCount = currentScopeGuests.filter(g => g.rsvpStatus === 'Confirmed').length;
  const totalGuestsCount = currentScopeGuests.length;
  const spentAmount = currentScopeExpenses.reduce((sum, e) => sum + e.amount, 0);
  const completedTasksCount = currentScopeTasks.filter(t => t.status === 'Completed').length;
  const totalTasksCount = currentScopeTasks.length;
  const pendingVendorsCount = currentScopeVendors.filter(v => v.status === 'Pending').length;

  return (
    <div className="paper-card rounded-3xl border border-[#E6D5C1] shadow-md overflow-hidden">
      {/* 1. HEADER (Warm Espresso, Cream, Terracotta Accent) */}
      <div className="p-6 sm:p-7 bg-[#29231F] text-[#FCF8F1]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#D98261] border border-[#B96E42] flex items-center justify-center text-white shrink-0 shadow-md">
              <Sparkles className="w-5 h-5 text-[#FCF8F1]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-editorial font-bold tracking-tight text-[#FCF8F1]">
                  Event Command Center
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#A6A77A]/25 text-[#E6D5C1] border border-[#A6A77A]/40 uppercase tracking-wider">
                  Live Scope
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#E6D5C1]/75 mt-0.5 font-medium">
                Unified operations dashboard for deadlines, alerts, and execution.
              </p>
            </div>
          </div>

          {/* Countdown & Health Tag */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="px-3.5 py-1.5 rounded-xl bg-[#483329] border border-[#E6D5C1]/20 text-xs font-medium text-[#E6D5C1] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D98261] shrink-0" />
              <span>{countdownText}</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-[#A6A77A]/20 border border-[#A6A77A]/40 text-xs font-bold text-[#FCF8F1] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A6A77A] shrink-0" />
              <span>{healthResult.level} ({healthResult.score}/100)</span>
            </div>
          </div>
        </div>

        {/* 2. SMART EVENT SUMMARY */}
        <div className="mt-5 p-4 rounded-2xl bg-[#392921] border border-[#483329]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3 text-xs">
            <span className="font-bold text-[#D98261] tracking-wide uppercase text-[11px]">
              {activeEvent ? activeEvent.name : 'All Events Workspace Portfolio'}
            </span>
            <span className="text-[#E6D5C1]/80 text-[11px] font-serif italic">
              {healthResult.explanation}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-[#483329]">
            <div>
              <span className="text-[10px] font-bold text-[#E6D5C1]/60 uppercase tracking-wider block">RSVP Confirmed</span>
              <p className="text-lg font-editorial font-bold text-[#FCF8F1] mt-0.5 tabular-nums">
                {confirmedGuestsCount} <span className="text-xs font-normal text-[#E6D5C1]/60 font-sans">/ {totalGuestsCount}</span>
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#E6D5C1]/60 uppercase tracking-wider block">Budget Spent</span>
              <p className="text-lg font-editorial font-bold text-[#FCF8F1] mt-0.5 tabular-nums">
                {formatCurrency(spentAmount)}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#E6D5C1]/60 uppercase tracking-wider block">Tasks Completed</span>
              <p className="text-lg font-editorial font-bold text-[#FCF8F1] mt-0.5 tabular-nums">
                {completedTasksCount} <span className="text-xs font-normal text-[#E6D5C1]/60 font-sans">/ {totalTasksCount}</span>
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#E6D5C1]/60 uppercase tracking-wider block">Suppliers</span>
              <p className="text-lg font-editorial font-bold text-[#FCF8F1] mt-0.5">
                {pendingVendorsCount > 0 ? `${pendingVendorsCount} Pending` : 'All Confirmed'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SIMPLIFIED TWO-COLUMN TRACKER: NEEDS ATTENTION vs NEXT ACTIONS */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#FCF8F1]">
        {/* COLUMN 1: NEEDS ATTENTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D98261]" />
              <h3 className="text-sm font-editorial font-bold text-[#29231F]">
                Needs Attention
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F7F0E5] text-[#B96E42] border border-[#E6D5C1]">
              {priorityAlerts.length} {priorityAlerts.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {priorityAlerts.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#F7F0E5] border border-[#E6D5C1] text-center space-y-1.5">
              <div className="w-10 h-10 rounded-full bg-[#A6A77A]/20 text-[#A6A77A] flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-5 h-5 text-[#555635]" />
              </div>
              <h4 className="text-sm font-serif font-bold text-[#29231F]">Everything looks pristine ✨</h4>
              <p className="text-xs text-[#483329]/70">
                No urgent bottlenecks require immediate action in your scope.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {priorityAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="p-3.5 bg-[#F7F0E5] rounded-2xl border border-[#E6D5C1] hover:border-[#D98261] transition-all flex items-start justify-between gap-3 shadow-2xs hover:shadow-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FCF8F1] text-[#B96E42] border border-[#E6D5C1]">
                        {alert.type}
                      </span>
                      <h4 className="text-xs font-bold text-[#29231F] truncate">
                        {alert.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[#483329]/80 mt-1 leading-snug">
                      {alert.message}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate(alert.actionTab)}
                    className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#FCF8F1] hover:bg-[#D98261] text-[#483329] hover:text-white border border-[#E6D5C1] hover:border-[#D98261] transition-colors shadow-2xs"
                  >
                    <span>{alert.actionLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLUMN 2: NEXT ACTIONS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-[#A6A77A]" />
              <h3 className="text-sm font-editorial font-bold text-[#29231F]">
                Recommended Actions
              </h3>
            </div>
            <span className="text-xs font-serif italic text-[#483329]/70">
              Curated Milestones
            </span>
          </div>

          {nextActions.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#F7F0E5] border border-[#E6D5C1] text-center space-y-1.5">
              <div className="w-10 h-10 rounded-full bg-[#A6A77A]/20 text-[#A6A77A] flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-5 h-5 text-[#555635]" />
              </div>
              <h4 className="text-sm font-serif font-bold text-[#29231F]">Checklist Up to Date</h4>
              <p className="text-xs text-[#483329]/70">
                All scheduled tasks and vendor agreements are currently completed.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {nextActions.map(action => (
                <div
                  key={action.id}
                  onClick={() => onNavigate(action.actionTab)}
                  className="p-3.5 bg-[#F7F0E5] rounded-2xl border border-[#E6D5C1] hover:border-[#D98261] hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FCF8F1] text-[#A6A77A] border border-[#E6D5C1]">
                        {action.statusText}
                      </span>
                      {action.dueDate && (
                        <span className="text-[11px] text-[#483329]/60 font-mono">
                          Due: {action.dueDate}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-semibold text-[#29231F] group-hover:text-[#D98261] transition-colors mt-1 truncate">
                      {action.action}
                    </h4>
                    <p className="text-[11px] text-[#483329]/60 truncate mt-0.5">
                      {action.eventName}
                    </p>
                  </div>

                  <div className="shrink-0 p-1.5 text-[#483329]/60 group-hover:text-[#D98261] group-hover:bg-[#FCF8F1] rounded-lg transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
