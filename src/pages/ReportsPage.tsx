import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Printer, 
  Download, 
  Calendar, 
  Users, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Building2, 
  PieChart as PieIcon, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  Layers, 
  ArrowUpDown, 
  ShieldCheck, 
  RotateCcw, 
  AlertOctagon,
  ArrowRight,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { EventItem, Guest, Expense, Vendor, Task, ExpenseCategory, TaskPriority, TaskStatus, VendorStatus, RSVPStatus } from '../types';
import { EventStatusBadge, RSVPBadge, TaskPriorityBadge, TaskStatusBadge } from '../components/common/Badge';

export const ReportsPage: React.FC = () => {
  const { 
    events, 
    guests, 
    expenses, 
    vendors, 
    tasks, 
    activeEventId, 
    setActiveEventId, 
    formatCurrency 
  } = useEventContext();

  // Filters State
  const [selectedEventId, setSelectedEventId] = useState<string>(activeEventId);
  const [dateRangeFilter, setDateRangeFilter] = useState<'ALL' | 'UPCOMING' | 'NEXT_30_DAYS' | 'PAST'>('ALL');
  const [selectedRSVPFilter, setSelectedRSVPFilter] = useState<string>('ALL');
  const [selectedTaskStatusFilter, setSelectedTaskStatusFilter] = useState<string>('ALL');
  const [selectedVendorStatusFilter, setSelectedVendorStatusFilter] = useState<string>('ALL');

  // Sorting for Event Comparison Table
  const [sortField, setSortField] = useState<'name' | 'date' | 'budget' | 'spent' | 'remaining' | 'rsvpRate' | 'taskRate'>('date');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Sync selectedEventId with activeEventId if activeEventId changes
  React.useEffect(() => {
    setSelectedEventId(activeEventId);
  }, [activeEventId]);

  const handleScopeChange = (id: string) => {
    setSelectedEventId(id);
    setActiveEventId(id);
  };

  const handleResetFilters = () => {
    setSelectedRSVPFilter('ALL');
    setSelectedTaskStatusFilter('ALL');
    setSelectedVendorStatusFilter('ALL');
    setDateRangeFilter('ALL');
  };

  const hasActiveCustomFilters = 
    selectedRSVPFilter !== 'ALL' || 
    selectedTaskStatusFilter !== 'ALL' || 
    selectedVendorStatusFilter !== 'ALL' || 
    dateRangeFilter !== 'ALL';

  // Base dataset scoped by event
  const scopedEvents = useMemo(() => {
    if (selectedEventId === 'ALL') return events;
    return events.filter(e => e.id === selectedEventId);
  }, [events, selectedEventId]);

  const currentEvent = useMemo(() => {
    if (selectedEventId === 'ALL') return null;
    return events.find(e => e.id === selectedEventId) || null;
  }, [events, selectedEventId]);

  // Today reference date: 2026-10-03
  const todayStr = '2026-10-03';
  const todayTimestamp = new Date(todayStr).getTime();

  // Filtered raw datasets based on event scope
  const rawScopedGuests = useMemo(() => {
    if (selectedEventId === 'ALL') return guests;
    return guests.filter(g => g.eventId === selectedEventId);
  }, [guests, selectedEventId]);

  const rawScopedExpenses = useMemo(() => {
    if (selectedEventId === 'ALL') return expenses;
    return expenses.filter(e => e.eventId === selectedEventId);
  }, [expenses, selectedEventId]);

  const rawScopedVendors = useMemo(() => {
    if (selectedEventId === 'ALL') return vendors;
    return vendors.filter(v => v.eventId === selectedEventId);
  }, [vendors, selectedEventId]);

  const rawScopedTasks = useMemo(() => {
    if (selectedEventId === 'ALL') return tasks;
    return tasks.filter(t => t.eventId === selectedEventId);
  }, [tasks, selectedEventId]);

  // Applied Custom Filters
  const analyzedGuests = useMemo(() => {
    return rawScopedGuests.filter(g => {
      if (selectedRSVPFilter !== 'ALL' && g.rsvpStatus !== selectedRSVPFilter) return false;
      return true;
    });
  }, [rawScopedGuests, selectedRSVPFilter]);

  const analyzedExpenses = useMemo(() => {
    return rawScopedExpenses;
  }, [rawScopedExpenses]);

  const analyzedVendors = useMemo(() => {
    return rawScopedVendors.filter(v => {
      if (selectedVendorStatusFilter !== 'ALL' && v.status !== selectedVendorStatusFilter) return false;
      return true;
    });
  }, [rawScopedVendors, selectedVendorStatusFilter]);

  const analyzedTasks = useMemo(() => {
    return rawScopedTasks.filter(t => {
      if (selectedTaskStatusFilter !== 'ALL' && t.status !== selectedTaskStatusFilter) return false;
      return true;
    });
  }, [rawScopedTasks, selectedTaskStatusFilter]);

  // Performance Overview Calculations
  const totalEventsCount = scopedEvents.length;
  const totalGuestsCount = rawScopedGuests.length;
  const confirmedGuestsCount = rawScopedGuests.filter(g => g.rsvpStatus === 'Confirmed').length;
  const pendingGuestsCount = rawScopedGuests.filter(g => g.rsvpStatus === 'Pending').length;
  const declinedGuestsCount = rawScopedGuests.filter(g => g.rsvpStatus === 'Declined').length;
  const rsvpConfirmationRate = totalGuestsCount > 0 ? Math.round((confirmedGuestsCount / totalGuestsCount) * 100) : 0;

  const totalBudget = scopedEvents.reduce((sum, e) => sum + (Number(e.budget) || 0), 0);
  const totalSpent = rawScopedExpenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetUsagePercent = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 999) : 0;

  const totalVendorsCount = rawScopedVendors.length;
  const confirmedVendorsCount = rawScopedVendors.filter(v => v.status === 'Confirmed').length;
  const pendingVendorsCount = rawScopedVendors.filter(v => v.status === 'Pending').length;
  const cancelledVendorsCount = rawScopedVendors.filter(v => v.status === 'Cancelled').length;
  const totalVendorCost = rawScopedVendors.reduce((sum, v) => sum + (Number(v.cost) || 0), 0);

  const totalTasksCount = rawScopedTasks.length;
  const completedTasksCount = rawScopedTasks.filter(t => t.status === 'Completed').length;
  const inProgressTasksCount = rawScopedTasks.filter(t => t.status === 'In Progress').length;
  const todoTasksCount = rawScopedTasks.filter(t => t.status === 'To Do').length;
  const taskCompletionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Task deadlines and urgency metrics
  const overdueTasks = useMemo(() => {
    return rawScopedTasks.filter(t => {
      if (t.status === 'Completed') return false;
      const dueTime = new Date(t.dueDate).getTime();
      return dueTime < todayTimestamp;
    });
  }, [rawScopedTasks, todayTimestamp]);

  const highPriorityPendingTasks = useMemo(() => {
    return rawScopedTasks.filter(t => t.priority === 'High' && t.status !== 'Completed');
  }, [rawScopedTasks]);

  const upcomingDeadlines = useMemo(() => {
    return [...rawScopedTasks]
      .filter(t => t.status !== 'Completed')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [rawScopedTasks]);

  // RSVP Percentages for chart
  const rsvpTotal = (confirmedGuestsCount + pendingGuestsCount + declinedGuestsCount) || 1;
  const confirmedPct = Math.round((confirmedGuestsCount / rsvpTotal) * 100);
  const pendingPct = Math.round((pendingGuestsCount / rsvpTotal) * 100);
  const declinedPct = Math.round((declinedGuestsCount / rsvpTotal) * 100);

  // Budget Category Breakdown & Largest Category
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
    rawScopedExpenses.forEach(exp => {
      map[exp.category] = (map[exp.category] || 0) + exp.amount;
    });
    return map;
  }, [rawScopedExpenses]);

  const maxCategorySpend = Math.max(...Object.values(categorySpending), 1);

  const largestCategory = useMemo(() => {
    let topCat = 'None';
    let topAmount = 0;
    Object.entries(categorySpending).forEach(([cat, amount]) => {
      if (amount > topAmount) {
        topAmount = amount;
        topCat = cat;
      }
    });
    return { name: topCat, amount: topAmount };
  }, [categorySpending]);

  // Health Score Calculation
  const healthScoreData = useMemo(() => {
    let budgetScore = 25;
    if (budgetUsagePercent > 100) budgetScore = 5;
    else if (budgetUsagePercent > 90) budgetScore = 15;
    else if (budgetUsagePercent >= 70) budgetScore = 20;

    let rsvpScore = totalGuestsCount > 0 ? (confirmedGuestsCount / totalGuestsCount) * 25 : 20;
    let taskScore = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 25 : 20;
    let vendorScore = totalVendorsCount > 0 ? (confirmedVendorsCount / totalVendorsCount) * 25 : 20;

    if (overdueTasks.length > 0) {
      taskScore = Math.max(0, taskScore - (overdueTasks.length * 3));
    }

    const totalScore = Math.round(budgetScore + rsvpScore + taskScore + vendorScore);

    let level: 'Excellent' | 'Good' | 'Needs Attention' | 'Critical';
    let explanation: string;
    let colorClass: string;
    let bgClass: string;

    if (totalScore >= 80) {
      level = 'Excellent';
      explanation = 'Operations are running on schedule, budget is well within bounds, and vendor agreements are solid.';
      colorClass = 'text-[#A6A77A] border-[#A6A77A]/40';
      bgClass = 'bg-[#A6A77A]/15';
    } else if (totalScore >= 60) {
      level = 'Good';
      explanation = 'Budget is under control and most planning tasks and confirmations are progressing reliably.';
      colorClass = 'text-[#D98261] border-[#D98261]/40';
      bgClass = 'bg-[#D98261]/15';
    } else if (totalScore >= 40) {
      level = 'Needs Attention';
      explanation = 'Pending vendor contracts or overdue planning milestones require administrative follow-up.';
      colorClass = 'text-[#B96E42] border-[#B96E42]/40';
      bgClass = 'bg-[#B96E42]/15';
    } else {
      level = 'Critical';
      explanation = 'Expenditure is approaching or exceeding budget limit, or critical tasks are overdue.';
      colorClass = 'text-rose-700 border-rose-300';
      bgClass = 'bg-rose-50';
    }

    return { totalScore, level, explanation, colorClass, bgClass };
  }, [
    budgetUsagePercent,
    totalGuestsCount,
    confirmedGuestsCount,
    totalTasksCount,
    completedTasksCount,
    totalVendorsCount,
    confirmedVendorsCount,
    overdueTasks.length
  ]);

  // Event Comparison Data
  const eventComparisonList = useMemo(() => {
    return events.map(evt => {
      const evtGuests = guests.filter(g => g.eventId === evt.id);
      const evtExpenses = expenses.filter(e => e.eventId === evt.id);
      const evtTasks = tasks.filter(t => t.eventId === evt.id);

      const evtSpent = evtExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const evtRemaining = evt.budget - evtSpent;
      const evtConfirmedGuests = evtGuests.filter(g => g.rsvpStatus === 'Confirmed').length;
      const evtRsvpRate = evtGuests.length > 0 ? Math.round((evtConfirmedGuests / evtGuests.length) * 100) : 0;
      const evtDoneTasks = evtTasks.filter(t => t.status === 'Completed').length;
      const evtTaskRate = evtTasks.length > 0 ? Math.round((evtDoneTasks / evtTasks.length) * 100) : 0;

      return {
        ...evt,
        guestCount: evtGuests.length,
        spent: evtSpent,
        remaining: evtRemaining,
        rsvpRate: evtRsvpRate,
        taskRate: evtTaskRate,
        tasksTotal: evtTasks.length,
        tasksDone: evtDoneTasks,
      };
    }).sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? (Number(valA) - Number(valB)) : (Number(valB) - Number(valA));
    });
  }, [events, guests, expenses, tasks, sortField, sortAsc]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const scopeTitle = currentEvent ? currentEvent.name : 'All Events Overview';
    const rows = [
      ['EventEase - Management & Analytics Report'],
      ['Generated On', new Date().toLocaleString('en-IN')],
      ['Scope', scopeTitle],
      [''],
      ['--- PERFORMANCE OVERVIEW ---'],
      ['Metric', 'Value'],
      ['Total Events', totalEventsCount],
      ['Total Guests', totalGuestsCount],
      ['Confirmed Attendees', confirmedGuestsCount],
      ['Pending Responses', pendingGuestsCount],
      ['Declined Invitations', declinedGuestsCount],
      ['RSVP Confirmation Rate', `${rsvpConfirmationRate}%`],
      ['Total Budget (INR)', totalBudget],
      ['Total Spent (INR)', totalSpent],
      ['Remaining Budget (INR)', remainingBudget],
      ['Budget Usage', `${budgetUsagePercent}%`],
      ['Total Vendors', totalVendorsCount],
      ['Confirmed Vendors', confirmedVendorsCount],
      ['Total Tasks', totalTasksCount],
      ['Completed Tasks', completedTasksCount],
      ['Task Completion Rate', `${taskCompletionRate}%`],
      [''],
      ['--- BUDGET CATEGORY BREAKDOWN ---'],
      ['Category', 'Amount (INR)', 'Percentage of Total Spent'],
      ...expenseCategories.map(cat => {
        const amt = categorySpending[cat] || 0;
        const pct = totalSpent > 0 ? Math.round((amt / totalSpent) * 100) : 0;
        return [cat, amt, `${pct}%`];
      }),
      ['Largest Expense Category', `${largestCategory.name} (${largestCategory.amount})`],
      [''],
    ];

    if (selectedEventId === 'ALL') {
      rows.push(['--- MULTI-EVENT COMPARISON ---']);
      rows.push(['Event Name', 'Date', 'Guests', 'Budget (INR)', 'Spent (INR)', 'Remaining (INR)', 'RSVP Rate', 'Task Progress']);
      eventComparisonList.forEach(e => {
        rows.push([
          `"${e.name.replace(/"/g, '""')}"`,
          e.date,
          e.guestCount,
          e.budget,
          e.spent,
          e.remaining,
          `${e.rsvpRate}%`,
          `${e.taskRate}%`
        ]);
      });
    }

    const csvContent = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EventEase_Report_${selectedEventId === 'ALL' ? 'All_Events' : (currentEvent?.name.replace(/[^a-zA-Z0-9]/g, '_') || 'Event')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-16 print:p-0 print:space-y-4">
      {/* 1. UPGRADE HEADER WITH SCOPE SELECTOR & ACTIONS */}
      <div className="bg-[#FCF8F1] rounded-2xl p-5 sm:p-6 border border-[#E6D5C1] shadow-xs print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold font-editorial text-[#29231F] tracking-tight">
                Event Reports & Analytics
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D98261]/15 text-[#D98261] border border-[#D98261]/30 uppercase tracking-wide">
                Analytics Center
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#483329]/75 mt-1">
              Understand attendance velocity, budget pacing, vendor contracts, and completion rates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Scope Selector */}
            <div className="flex items-center gap-1.5 bg-[#F7F0E5] p-1.5 rounded-xl border border-[#E6D5C1]">
              <Layers className="w-4 h-4 text-[#D98261] ml-1.5" />
              <select
                value={selectedEventId}
                onChange={(e) => handleScopeChange(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-semibold text-[#29231F] focus:outline-none pr-2 cursor-pointer"
              >
                <option value="ALL">🌟 All Events Overview</option>
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#483329] bg-[#F7F0E5] hover:bg-[#E6D5C1]/50 rounded-xl transition-colors border border-[#E6D5C1] shadow-2xs cursor-pointer"
              title="Download structured analytics CSV file"
            >
              <Download className="w-4 h-4 text-[#D98261]" />
              <span>Export CSV</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#D98261] hover:bg-[#B96E42] rounded-xl transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* REPORT FILTERS BAR */}
        <div className="mt-5 pt-4 border-t border-[#E6D5C1] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-semibold text-[#483329] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#D98261]" />
              Refine Analysis:
            </span>

            {/* RSVP Filter */}
            <select
              value={selectedRSVPFilter}
              onChange={(e) => setSelectedRSVPFilter(e.target.value)}
              className="bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#D98261]"
            >
              <option value="ALL">All RSVP Statuses</option>
              <option value="Confirmed">Confirmed Only</option>
              <option value="Pending">Pending Only</option>
              <option value="Declined">Declined Only</option>
            </select>

            {/* Task Status Filter */}
            <select
              value={selectedTaskStatusFilter}
              onChange={(e) => setSelectedTaskStatusFilter(e.target.value)}
              className="bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#D98261]"
            >
              <option value="ALL">All Task Statuses</option>
              <option value="Completed">Completed Only</option>
              <option value="In Progress">In Progress Only</option>
              <option value="To Do">To Do Only</option>
            </select>

            {/* Vendor Status Filter */}
            <select
              value={selectedVendorStatusFilter}
              onChange={(e) => setSelectedVendorStatusFilter(e.target.value)}
              className="bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#D98261]"
            >
              <option value="ALL">All Vendor Contracts</option>
              <option value="Confirmed">Confirmed Only</option>
              <option value="Pending">Pending Only</option>
              <option value="Cancelled">Cancelled Only</option>
            </select>

            {hasActiveCustomFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#D98261] bg-[#D98261]/15 hover:bg-[#D98261]/25 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="text-[11px] text-[#483329]/60 font-mono">
            Analyzing <strong className="text-[#29231F] font-sans">{totalEventsCount}</strong> events,{' '}
            <strong className="text-[#29231F] font-sans">{analyzedGuests.length}</strong> guests,{' '}
            <strong className="text-[#29231F] font-sans">{analyzedTasks.length}</strong> tasks,{' '}
            <strong className="text-[#29231F] font-sans">{analyzedVendors.length}</strong> vendors
          </div>
        </div>
      </div>

      {/* PRINT-FRIENDLY REPORT HEADER */}
      <div className="hidden print:block p-6 bg-white border border-slate-300 rounded-xl mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold font-editorial text-slate-900">EventEase – Event Management Analytics Report</h1>
            <p className="text-sm text-slate-600 mt-1">
              Scope: {currentEvent ? currentEvent.name : 'All Events Overview'}
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>Generated on: {new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
            <p className="mt-0.5">Status: Operational & Fully Audited</p>
          </div>
        </div>
      </div>

      {/* DYNAMIC REPORT EXECUTIVE SUMMARY BANNER */}
      <div className="bg-[#29231F] rounded-2xl p-5.5 text-[#F7F0E5] border border-[#483329] shadow-md flex items-start gap-4">
        <div className="p-2.5 bg-[#D98261]/20 border border-[#D98261]/40 rounded-xl text-[#D98261] shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#A6A77A]">
            Event Planning Executive Brief
          </h4>
          <p className="text-xs sm:text-sm text-[#F7F0E5]/90 mt-1.5 leading-relaxed font-editorial text-base sm:text-lg">
            {totalEventsCount === 1 && currentEvent
              ? `Currently analyzing "${currentEvent.name}" scheduled for ${currentEvent.date}. ${budgetUsagePercent}% of the ${formatCurrency(totalBudget)} allocated budget has been utilized (${formatCurrency(totalSpent)} disbursed). ${rsvpConfirmationRate}% of invited guests have confirmed attendance (${confirmedGuestsCount} of ${totalGuestsCount}), and ${taskCompletionRate}% of planning checklist milestones are completed.`
              : `${totalEventsCount} events are currently managed in the platform. ${budgetUsagePercent}% of the allocated budget has been utilized (${formatCurrency(totalSpent)} of ${formatCurrency(totalBudget)}). ${rsvpConfirmationRate}% of invited guests have confirmed attendance, and ${taskCompletionRate}% of planning tasks have been completed across all scopes.`
            }
          </p>
        </div>
      </div>

      {/* EVENT HEALTH SCORE SECTION */}
      <div className="paper-card rounded-3xl p-6 sm:p-7 border border-[#E6D5C1] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          {/* Radial Score Gauge */}
          <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#E6D5C1]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={healthScoreData.totalScore >= 70 ? 'text-[#A6A77A]' : healthScoreData.totalScore >= 50 ? 'text-[#D98261]' : 'text-[#B96E42]'}
                strokeDasharray={`${healthScoreData.totalScore}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-sm font-bold font-mono text-[#29231F] leading-none">
                {healthScoreData.totalScore}
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#483329]/60 font-semibold mt-0.5">/100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg font-bold font-editorial text-[#29231F] tracking-tight">
                Overall Event Health Index
              </h3>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${healthScoreData.bgClass} ${healthScoreData.colorClass}`}>
                {healthScoreData.level}
              </span>
            </div>
            <p className="text-xs text-[#483329]/80 mt-1 leading-relaxed max-w-2xl font-serif text-sm">
              {healthScoreData.explanation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0 bg-[#F7F0E5] p-3 rounded-2xl border border-[#E6D5C1] text-xs shadow-inner">
          <div className="text-center px-3.5 border-r border-[#E6D5C1]">
            <span className="text-[#483329]/60 font-medium block text-[10px] uppercase tracking-wider">RSVP Health</span>
            <span className="text-sm font-bold font-mono text-[#29231F]">{rsvpConfirmationRate}%</span>
          </div>
          <div className="text-center px-3.5 border-r border-[#E6D5C1]">
            <span className="text-[#483329]/60 font-medium block text-[10px] uppercase tracking-wider">Task Velocity</span>
            <span className="text-sm font-bold font-mono text-[#29231F]">{taskCompletionRate}%</span>
          </div>
          <div className="text-center px-3.5">
            <span className="text-[#483329]/60 font-medium block text-[10px] uppercase tracking-wider">Budget Pacing</span>
            <span className={`text-sm font-bold font-mono ${budgetUsagePercent >= 100 ? 'text-[#B96E42]' : 'text-[#29231F]'}`}>
              {budgetUsagePercent}%
            </span>
          </div>
        </div>
      </div>

      {/* 8 DYNAMIC SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Events */}
        <div className="bg-[#FCF8F1] p-4 sm:p-5 rounded-2xl border border-[#E6D5C1] shadow-xs">
          <p className="text-[11px] font-bold text-[#A6A77A] uppercase tracking-wider">Total Events</p>
          <h4 className="text-2xl sm:text-3xl font-bold font-editorial text-[#29231F] mt-1">{totalEventsCount}</h4>
          <p className="text-xs text-[#483329]/60 mt-0.5">{selectedEventId === 'ALL' ? 'All scopes' : 'Focused event'}</p>
        </div>

        {/* Total Guests */}
        <div className="bg-[#FCF8F1] p-4 sm:p-5 rounded-2xl border border-[#E6D5C1] shadow-xs">
          <p className="text-[11px] font-bold text-[#A6A77A] uppercase tracking-wider">Total Guests</p>
          <h4 className="text-2xl sm:text-3xl font-bold font-editorial text-[#29231F] mt-1">{totalGuestsCount}</h4>
          <p className="text-xs text-[#483329]/60 mt-0.5">Invited roster count</p>
        </div>

        {/* RSVP Confirmation Rate */}
        <div className="bg-[#FCF8F1] p-4 sm:p-5 rounded-2xl border border-[#E6D5C1] shadow-xs">
          <p className="text-[11px] font-bold text-[#A6A77A] uppercase tracking-wider">RSVP Confirm Rate</p>
          <h4 className="text-2xl sm:text-3xl font-bold font-editorial text-[#A6A77A] mt-1">{rsvpConfirmationRate}%</h4>
          <p className="text-xs text-[#483329]/60 mt-0.5">{confirmedGuestsCount} attendees confirmed</p>
        </div>

        {/* Task Completion Rate */}
        <div className="bg-[#FCF8F1] p-4 sm:p-5 rounded-2xl border border-[#E6D5C1] shadow-xs">
          <p className="text-[11px] font-bold text-[#A6A77A] uppercase tracking-wider">Task Completion Rate</p>
          <h4 className="text-2xl sm:text-3xl font-bold font-editorial text-[#D98261] mt-1">{taskCompletionRate}%</h4>
          <p className="text-xs text-[#483329]/60 mt-0.5">{completedTasksCount} / {totalTasksCount} completed</p>
        </div>

        {/* Total Budget */}
        <div className="bg-[#FCF8F1] p-4 sm:p-5 rounded-2xl border border-[#E6D5C1] shadow-xs">
          <p className="text-[11px] font-bold text-[#A6A77A] uppercase tracking-wider">Total Budget</p>
          <h4 className="text-lg sm:text-2xl font-bold font-editorial text-[#29231F] mt-1">{formatCurrency(totalBudget)}</h4>
          <p className="text-xs text-[#483329]/60 mt-0.5">Allocated funds</p>
        </div>

        {/* Total Spent */}
        <div className="bg-[#FCF8F1] p-4 sm:p-5 rounded-2xl border border-[#E6D5C1] shadow-xs">
          <p className="text-[11px] font-bold text-[#A6A77A] uppercase tracking-wider">Total Spent</p>
          <h4 className="text-lg sm:text-2xl font-bold font-editorial text-[#B96E42] mt-1">{formatCurrency(totalSpent)}</h4>
          <p className="text-xs text-[#483329]/60 mt-0.5">{budgetUsagePercent}% of allocation</p>
        </div>

        {/* Remaining Budget */}
        <div className="bg-[#FCF8F1] p-4 sm:p-5 rounded-2xl border border-[#E6D5C1] shadow-xs">
          <p className="text-[11px] font-bold text-[#A6A77A] uppercase tracking-wider">Remaining Budget</p>
          <h4 className="text-lg sm:text-2xl font-bold font-editorial text-[#29231F] mt-1">
            {formatCurrency(remainingBudget)}
          </h4>
          <p className="text-xs text-[#483329]/60 mt-0.5">{remainingBudget >= 0 ? 'Available cushion' : 'Over allocation'}</p>
        </div>

        {/* Total Vendors */}
        <div className="bg-[#FCF8F1] p-4 sm:p-5 rounded-2xl border border-[#E6D5C1] shadow-xs">
          <p className="text-[11px] font-bold text-[#A6A77A] uppercase tracking-wider">Total Vendors</p>
          <h4 className="text-2xl sm:text-3xl font-bold font-editorial text-[#29231F] mt-1">{totalVendorsCount}</h4>
          <p className="text-xs text-[#483329]/60 mt-0.5">{confirmedVendorsCount} confirmed partners</p>
        </div>
      </div>

      {/* RSVP ANALYTICS + BUDGET ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RSVP ANALYTICS */}
        <div className="bg-[#FCF8F1] rounded-2xl p-6 border border-[#E6D5C1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold font-editorial text-[#29231F] tracking-tight">RSVP Attendance Analytics</h3>
                <p className="text-xs text-[#483329]/70 mt-0.5">Response health based on real attendee records</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#A6A77A]/20 text-[#A6A77A] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>

            {totalGuestsCount === 0 ? (
              <div className="py-12 text-center text-xs text-[#483329]/60 italic">
                No guest data available for this event scope.
              </div>
            ) : (
              <>
                {/* Visual Progress Bar */}
                <div className="my-4">
                  <div className="w-full h-3.5 bg-[#E6D5C1]/40 rounded-full overflow-hidden flex shadow-inner">
                    <div
                      className="h-full bg-[#A6A77A] transition-all duration-500"
                      style={{ width: `${confirmedPct}%` }}
                      title={`Confirmed: ${confirmedPct}%`}
                    />
                    <div
                      className="h-full bg-[#D98261] transition-all duration-500"
                      style={{ width: `${pendingPct}%` }}
                      title={`Pending: ${pendingPct}%`}
                    />
                    <div
                      className="h-full bg-[#483329]/40 transition-all duration-500"
                      style={{ width: `${declinedPct}%` }}
                      title={`Declined: ${declinedPct}%`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#483329] mt-2 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#A6A77A]" />
                      Confirmed: {confirmedPct}%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#D98261]" />
                      Pending: {pendingPct}%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#483329]/40" />
                      Declined: {declinedPct}%
                    </span>
                  </div>
                </div>

                {/* 4 KPI Boxes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                  <div className="p-3 bg-[#F7F0E5] rounded-xl border border-[#E6D5C1] text-center">
                    <p className="text-[10px] font-bold text-[#483329]/70 uppercase">Total Invitations</p>
                    <p className="text-lg font-bold font-editorial text-[#29231F] mt-0.5">{totalGuestsCount}</p>
                  </div>
                  <div className="p-3 bg-[#A6A77A]/15 rounded-xl border border-[#A6A77A]/30 text-center">
                    <p className="text-[10px] font-bold text-[#A6A77A] uppercase">Confirmed</p>
                    <p className="text-lg font-bold font-editorial text-[#29231F] mt-0.5">{confirmedGuestsCount}</p>
                  </div>
                  <div className="p-3 bg-[#D98261]/15 rounded-xl border border-[#D98261]/30 text-center">
                    <p className="text-[10px] font-bold text-[#D98261] uppercase">Pending</p>
                    <p className="text-lg font-bold font-editorial text-[#29231F] mt-0.5">{pendingGuestsCount}</p>
                  </div>
                  <div className="p-3 bg-[#B96E42]/15 rounded-xl border border-[#B96E42]/30 text-center">
                    <p className="text-[10px] font-bold text-[#B96E42] uppercase">Declined</p>
                    <p className="text-lg font-bold font-editorial text-[#29231F] mt-0.5">{declinedGuestsCount}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-[#E6D5C1] text-xs text-[#483329]/70 text-center">
            RSVP Confirmation Rate: <strong className="text-[#29231F] font-mono">{rsvpConfirmationRate}%</strong>
          </div>
        </div>

        {/* BUDGET ANALYTICS */}
        <div className="bg-[#FCF8F1] rounded-2xl p-6 border border-[#E6D5C1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold font-editorial text-[#29231F] tracking-tight">Budget & Expenditure Analytics</h3>
                <p className="text-xs text-[#483329]/70 mt-0.5">Allocation vs. actual disbursed invoices</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#D98261]/15 text-[#D98261] flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>

            {/* 4 Top KPI Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="p-3 bg-[#F7F0E5] rounded-xl border border-[#E6D5C1] text-center">
                <p className="text-[10px] font-bold text-[#483329]/70 uppercase">Allocated Budget</p>
                <p className="text-xs sm:text-sm font-bold font-editorial text-[#29231F] mt-0.5">{formatCurrency(totalBudget)}</p>
              </div>
              <div className="p-3 bg-[#F7F0E5] rounded-xl border border-[#E6D5C1] text-center">
                <p className="text-[10px] font-bold text-[#483329]/70 uppercase">Total Spent</p>
                <p className="text-xs sm:text-sm font-bold font-editorial text-[#B96E42] mt-0.5">{formatCurrency(totalSpent)}</p>
              </div>
              <div className="p-3 bg-[#F7F0E5] rounded-xl border border-[#E6D5C1] text-center">
                <p className="text-[10px] font-bold text-[#483329]/70 uppercase">Remaining</p>
                <p className={`text-xs sm:text-sm font-bold font-editorial mt-0.5 ${remainingBudget < 0 ? 'text-[#B96E42]' : 'text-[#A6A77A]'}`}>
                  {formatCurrency(remainingBudget)}
                </p>
              </div>
              <div className="p-3 bg-[#F7F0E5] rounded-xl border border-[#E6D5C1] text-center">
                <p className="text-[10px] font-bold text-[#483329]/70 uppercase">Usage %</p>
                <p className="text-xs sm:text-sm font-bold font-mono text-[#D98261] mt-0.5">{budgetUsagePercent}%</p>
              </div>
            </div>

            {/* Largest Expense Category Callout */}
            <div className="mb-4 p-3 bg-[#F7F0E5] border border-[#E6D5C1] rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-[#483329]">Largest Expense Category:</span>
              <span className="font-bold text-[#29231F]">
                {largestCategory.name} — {formatCurrency(largestCategory.amount)}
              </span>
            </div>

            {/* Category-wise Expense Visualization */}
            <div className="space-y-2">
              {expenseCategories.map(cat => {
                const amount = categorySpending[cat] || 0;
                const percent = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
                const barWidth = Math.round((amount / maxCategorySpend) * 100);

                return (
                  <div key={cat} className="space-y-0.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#483329]">{cat}</span>
                      <span className="font-bold text-[#29231F]">
                        {formatCurrency(amount)}{' '}
                        <span className="text-[10px] text-[#483329]/60 font-normal">({percent}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#E6D5C1]/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D98261] rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E6D5C1] text-xs text-[#483329]/60 text-center">
            Total {rawScopedExpenses.length} verified invoice transactions
          </div>
        </div>
      </div>

      {/* TASK & PLANNING ANALYTICS + VENDOR ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TASK AND PLANNING ANALYTICS */}
        <div className="bg-[#FCF8F1] rounded-2xl p-6 border border-[#E6D5C1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold font-editorial text-[#29231F] tracking-tight">Planning & Milestone Analytics</h3>
                <p className="text-xs text-[#483329]/70 mt-0.5">Checklist completion velocity and deadlines</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#D98261]/15 text-[#D98261] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            {/* Task KPIs */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3 bg-[#A6A77A]/15 rounded-xl border border-[#A6A77A]/30 text-center">
                <span className="text-[10px] font-bold uppercase text-[#A6A77A]">Completed</span>
                <p className="text-lg font-bold font-editorial text-[#29231F] mt-0.5">{completedTasksCount}</p>
              </div>
              <div className="p-3 bg-[#D98261]/15 rounded-xl border border-[#D98261]/30 text-center">
                <span className="text-[10px] font-bold uppercase text-[#D98261]">In Progress</span>
                <p className="text-lg font-bold font-editorial text-[#29231F] mt-0.5">{inProgressTasksCount}</p>
              </div>
              <div className="p-3 bg-[#F7F0E5] rounded-xl border border-[#E6D5C1] text-center">
                <span className="text-[10px] font-bold uppercase text-[#483329]">To Do</span>
                <p className="text-lg font-bold font-editorial text-[#29231F] mt-0.5">{todoTasksCount}</p>
              </div>
            </div>

            {/* Visual Task Completion Progress Bar */}
            <div className="space-y-1.5 mb-5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#483329]">
                <span>Task Completion Progress</span>
                <span className="font-bold font-mono text-[#D98261]">{taskCompletionRate}%</span>
              </div>
              <div className="w-full h-3 bg-[#E6D5C1]/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#D98261] to-[#A6A77A] rounded-full transition-all duration-500"
                  style={{ width: `${taskCompletionRate}%` }}
                />
              </div>
            </div>

            {/* Overdue Tasks Alert or Celebration */}
            {overdueTasks.length === 0 ? (
              <div className="p-3.5 bg-[#A6A77A]/15 border border-[#A6A77A]/30 rounded-xl flex items-center gap-2 text-xs font-semibold text-[#483329]">
                <CheckCircle className="w-4 h-4 text-[#A6A77A] shrink-0" />
                <span>No overdue tasks 🎉 Everything is progressing on schedule!</span>
              </div>
            ) : (
              <div className="p-3.5 bg-[#B96E42]/15 border border-[#B96E42]/30 rounded-xl flex items-start gap-2.5 text-xs text-[#29231F]">
                <AlertTriangle className="w-4 h-4 text-[#B96E42] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#B96E42]">Overdue Task Alert:</span> {overdueTasks.length} task(s) have passed their scheduled due date.
                  <ul className="mt-1 list-disc list-inside text-[#483329] font-medium">
                    {overdueTasks.slice(0, 2).map(t => (
                      <li key={t.id} className="truncate">"{t.name}" (Due {t.dueDate})</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* High Priority Pending Indicator */}
            {highPriorityPendingTasks.length > 0 && (
              <div className="mt-3 p-3 bg-[#D98261]/15 border border-[#D98261]/30 rounded-xl flex items-center justify-between text-xs text-[#29231F]">
                <span className="font-semibold text-[#483329]">High-Priority Action Items:</span>
                <span className="font-bold font-mono text-[#D98261]">{highPriorityPendingTasks.length} Pending</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#E6D5C1] text-xs text-[#483329]/60 text-center">
            Total {totalTasksCount} milestones defined for this scope
          </div>
        </div>

        {/* VENDOR ANALYTICS */}
        <div className="bg-[#FCF8F1] rounded-2xl p-6 border border-[#E6D5C1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold font-editorial text-[#29231F] tracking-tight">Vendor Partner Overview</h3>
                <p className="text-xs text-[#483329]/70 mt-0.5">Supplier pipeline & contract fulfillment</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#E6D5C1]/40 text-[#483329] flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>

            {/* Vendor KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="p-3 bg-[#F7F0E5] rounded-xl border border-[#E6D5C1] text-center">
                <span className="text-[10px] font-bold uppercase text-[#483329]/70">Total Vendors</span>
                <p className="text-lg font-bold font-editorial text-[#29231F] mt-0.5">{totalVendorsCount}</p>
              </div>
              <div className="p-3 bg-[#A6A77A]/15 rounded-xl border border-[#A6A77A]/30 text-center">
                <span className="text-[10px] font-bold uppercase text-[#A6A77A]">Confirmed</span>
                <p className="text-lg font-bold font-editorial text-[#29231F] mt-0.5">{confirmedVendorsCount}</p>
              </div>
              <div className="p-3 bg-[#D98261]/15 rounded-xl border border-[#D98261]/30 text-center">
                <span className="text-[10px] font-bold uppercase text-[#D98261]">Pending</span>
                <p className="text-lg font-bold font-editorial text-[#29231F] mt-0.5">{pendingVendorsCount}</p>
              </div>
              <div className="p-3 bg-[#B96E42]/15 rounded-xl border border-[#B96E42]/30 text-center">
                <span className="text-[10px] font-bold uppercase text-[#B96E42]">Cancelled</span>
                <p className="text-lg font-bold font-editorial text-[#29231F] mt-0.5">{cancelledVendorsCount}</p>
              </div>
            </div>

            {/* Total Vendor Cost Callout */}
            <div className="p-3.5 bg-[#F7F0E5] border border-[#E6D5C1] rounded-xl flex items-center justify-between text-xs mb-4">
              <span className="font-semibold text-[#483329]">Total Committed Vendor Quotes:</span>
              <span className="font-bold font-editorial text-lg text-[#29231F]">{formatCurrency(totalVendorCost)}</span>
            </div>

            {/* Visual Status Breakdown */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#A6A77A] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#A6A77A]" /> Confirmed Partners
                </span>
                <span className="font-bold font-mono text-[#29231F]">
                  {confirmedVendorsCount} ({totalVendorsCount > 0 ? Math.round((confirmedVendorsCount / totalVendorsCount) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 bg-[#E6D5C1]/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#A6A77A] rounded-full"
                  style={{ width: `${totalVendorsCount > 0 ? (confirmedVendorsCount / totalVendorsCount) * 100 : 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#D98261] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D98261]" /> Pending Negotiations
                </span>
                <span className="font-bold font-mono text-[#29231F]">
                  {pendingVendorsCount} ({totalVendorsCount > 0 ? Math.round((pendingVendorsCount / totalVendorsCount) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 bg-[#E6D5C1]/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D98261] rounded-full"
                  style={{ width: `${totalVendorsCount > 0 ? (pendingVendorsCount / totalVendorsCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E6D5C1] text-xs text-[#483329]/60 text-center">
            {confirmedVendorsCount} of {totalVendorsCount} agencies confirmed under contract
          </div>
        </div>
      </div>

      {/* UPCOMING DEADLINES SECTION */}
      <div className="bg-[#FCF8F1] rounded-2xl p-6 border border-[#E6D5C1] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold font-editorial text-[#29231F] tracking-tight">Upcoming Deadlines & Critical Milestones</h3>
            <p className="text-xs text-[#483329]/70 mt-0.5">Chronologically sorted deliverables requiring near-term completion</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#D98261]/15 text-[#D98261] flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>

        {upcomingDeadlines.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#483329]/60 italic">
            No pending task deadlines for this scope. All tasks are completed!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#483329]">
              <thead className="bg-[#F7F0E5] text-[10px] font-bold text-[#483329]/70 uppercase tracking-wider border-b border-[#E6D5C1]">
                <tr>
                  <th className="py-2.5 px-3">Task Deliverable</th>
                  <th className="py-2.5 px-3">Associated Event</th>
                  <th className="py-2.5 px-3">Target Due Date</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6D5C1]/70">
                {upcomingDeadlines.map((task) => {
                  const eventName = events.find(e => e.id === task.eventId)?.name;
                  const isOverdue = new Date(task.dueDate).getTime() < todayTimestamp;

                  return (
                    <tr key={task.id} className="hover:bg-[#F7F0E5]/60 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-[#29231F]">
                        {task.name}
                      </td>
                      <td className="py-2.5 px-3 text-[#483329] font-medium truncate max-w-[180px]">
                        {eventName || 'General Scope'}
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        <span className={isOverdue ? 'text-[#B96E42] font-bold flex items-center gap-1' : 'text-[#483329]'}>
                          {task.dueDate} {isOverdue && '(Overdue)'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <TaskPriorityBadge priority={task.priority} />
                      </td>
                      <td className="py-2.5 px-3">
                        <TaskStatusBadge status={task.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MULTI-EVENT COMPARISON TABLE */}
      {selectedEventId === 'ALL' && (
        <div className="bg-[#FCF8F1] rounded-2xl p-6 border border-[#E6D5C1] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold font-editorial text-[#29231F] tracking-tight">Multi-Event Comparative Analysis</h3>
              <p className="text-xs text-[#483329]/70 mt-0.5">Side-by-side performance benchmarking across all managed events</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#D98261]/15 text-[#D98261] font-semibold border border-[#D98261]/30 self-start sm:self-auto">
              Comparing {events.length} Events
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#483329]">
              <thead className="bg-[#F7F0E5] text-[10px] font-bold text-[#483329]/70 uppercase tracking-wider border-b border-[#E6D5C1]">
                <tr>
                  <th 
                    className="py-3 px-3 cursor-pointer hover:text-[#29231F]"
                    onClick={() => {
                      if (sortField === 'name') setSortAsc(!sortAsc);
                      else { setSortField('name'); setSortAsc(true); }
                    }}
                  >
                    <span className="flex items-center gap-1">
                      Event Name <ArrowUpDown className="w-3 h-3 text-[#D98261]" />
                    </span>
                  </th>
                  <th 
                    className="py-3 px-3 cursor-pointer hover:text-[#29231F]"
                    onClick={() => {
                      if (sortField === 'date') setSortAsc(!sortAsc);
                      else { setSortField('date'); setSortAsc(true); }
                    }}
                  >
                    <span className="flex items-center gap-1">
                      Date <ArrowUpDown className="w-3 h-3 text-[#D98261]" />
                    </span>
                  </th>
                  <th className="py-3 px-3">Guests</th>
                  <th 
                    className="py-3 px-3 cursor-pointer hover:text-[#29231F]"
                    onClick={() => {
                      if (sortField === 'budget') setSortAsc(!sortAsc);
                      else { setSortField('budget'); setSortAsc(true); }
                    }}
                  >
                    <span className="flex items-center gap-1">
                      Budget <ArrowUpDown className="w-3 h-3 text-[#D98261]" />
                    </span>
                  </th>
                  <th 
                    className="py-3 px-3 cursor-pointer hover:text-[#29231F]"
                    onClick={() => {
                      if (sortField === 'spent') setSortAsc(!sortAsc);
                      else { setSortField('spent'); setSortAsc(true); }
                    }}
                  >
                    <span className="flex items-center gap-1">
                      Spent <ArrowUpDown className="w-3 h-3 text-[#D98261]" />
                    </span>
                  </th>
                  <th 
                    className="py-3 px-3 cursor-pointer hover:text-[#29231F]"
                    onClick={() => {
                      if (sortField === 'remaining') setSortAsc(!sortAsc);
                      else { setSortField('remaining'); setSortAsc(true); }
                    }}
                  >
                    <span className="flex items-center gap-1">
                      Remaining <ArrowUpDown className="w-3 h-3 text-[#D98261]" />
                    </span>
                  </th>
                  <th 
                    className="py-3 px-3 cursor-pointer hover:text-[#29231F]"
                    onClick={() => {
                      if (sortField === 'taskRate') setSortAsc(!sortAsc);
                      else { setSortField('taskRate'); setSortAsc(true); }
                    }}
                  >
                    <span className="flex items-center gap-1">
                      Task Progress <ArrowUpDown className="w-3 h-3 text-[#D98261]" />
                    </span>
                  </th>
                  <th 
                    className="py-3 px-3 cursor-pointer hover:text-[#29231F]"
                    onClick={() => {
                      if (sortField === 'rsvpRate') setSortAsc(!sortAsc);
                      else { setSortField('rsvpRate'); setSortAsc(true); }
                    }}
                  >
                    <span className="flex items-center gap-1">
                      RSVP Rate <ArrowUpDown className="w-3 h-3 text-[#D98261]" />
                    </span>
                  </th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6D5C1]/70">
                {eventComparisonList.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F7F0E5]/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#29231F] max-w-[180px] truncate font-editorial text-sm">
                      {item.name}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap font-mono">{item.date}</td>
                    <td className="py-3 px-3 font-medium">{item.guestCount} Attendees</td>
                    <td className="py-3 px-3 font-bold font-editorial text-sm text-[#29231F] whitespace-nowrap">{formatCurrency(item.budget)}</td>
                    <td className="py-3 px-3 font-semibold text-[#B96E42] whitespace-nowrap">{formatCurrency(item.spent)}</td>
                    <td className={`py-3 px-3 font-semibold whitespace-nowrap ${item.remaining < 0 ? 'text-[#B96E42]' : 'text-[#A6A77A]'}`}>
                      {formatCurrency(item.remaining)}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#E6D5C1]/50 rounded-full overflow-hidden">
                          <div className="h-full bg-[#D98261] rounded-full" style={{ width: `${item.taskRate}%` }} />
                        </div>
                        <span className="font-semibold font-mono text-[#29231F]">{item.taskRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-bold font-mono text-[#A6A77A]">
                      {item.rsvpRate}%
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleScopeChange(item.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#D98261] bg-[#D98261]/15 hover:bg-[#D98261] hover:text-white transition-all cursor-pointer"
                      >
                        Analyze Scope
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
