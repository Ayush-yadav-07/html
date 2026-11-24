import { EventItem, Guest, Expense, Vendor, Task, SeatingTable } from '../types';

export interface PriorityAlert {
  id: string;
  type: 'budget' | 'rsvp' | 'task' | 'vendor' | 'seating';
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  actionTab: 'budget' | 'guests' | 'timeline' | 'vendors' | 'seating';
  actionLabel: string;
  eventId?: string;
  eventName?: string;
}

export interface NextActionItem {
  id: string;
  action: string;
  eventName: string;
  dueDate?: string;
  priority?: 'High' | 'Medium' | 'Low';
  statusText: string;
  actionTab: 'guests' | 'budget' | 'vendors' | 'timeline' | 'seating';
  actionLabel: string;
}

export interface EventHealthResult {
  score: number;
  level: 'Excellent' | 'Good' | 'Needs Attention' | 'Critical';
  explanation: string;
  budgetPercent: number;
  rsvpRate: number;
  taskRate: number;
  vendorRate: number;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  badgeVariant: 'success' | 'indigo' | 'warning' | 'danger';
}

export interface EventCountdownResult {
  days: number;
  text: string;
  isPast: boolean;
}

/**
 * Calculates countdown from target event date to today
 */
export function calculateEventCountdown(dateStr: string, status?: string): EventCountdownResult {
  if (status === 'Completed') {
    return { days: 0, text: 'Event completed', isPast: true };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDate = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
  eventDate.setHours(0, 0, 0, 0);

  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { days: 0, text: 'Event completed', isPast: true };
  } else if (diffDays === 0) {
    return { days: 0, text: 'Today', isPast: false };
  } else if (diffDays === 1) {
    return { days: 1, text: 'Tomorrow', isPast: false };
  } else {
    return { days: diffDays, text: `${diffDays} days to go`, isPast: false };
  }
}

/**
 * Calculates a transparent 0-100 Event Health Score based on real data
 * Weights:
 * - Budget Health: 25%
 * - RSVP Progress: 25%
 * - Task Completion: 25%
 * - Vendor Confirmation: 25%
 */
export function calculateEventHealth(
  eventBudget: number,
  eventExpenses: Expense[],
  eventGuests: Guest[],
  eventTasks: Task[],
  eventVendors: Vendor[]
): EventHealthResult {
  // 1. Budget Score (25%)
  const totalSpent = eventExpenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetPercent = eventBudget > 0 ? Math.round((totalSpent / eventBudget) * 100) : 0;
  
  let budgetScore = 25;
  if (eventBudget > 0) {
    if (totalSpent > eventBudget) {
      const overRatio = (totalSpent - eventBudget) / eventBudget;
      budgetScore = Math.max(0, Math.round(25 - overRatio * 50));
    } else if (budgetPercent >= 90) {
      budgetScore = 15;
    } else if (budgetPercent >= 75) {
      budgetScore = 20;
    } else {
      budgetScore = 25;
    }
  }

  // 2. RSVP Score (25%)
  const totalGuests = eventGuests.length;
  const confirmedGuests = eventGuests.filter(g => g.rsvpStatus === 'Confirmed').length;
  const declinedGuests = eventGuests.filter(g => g.rsvpStatus === 'Declined').length;
  const respondedGuests = confirmedGuests + declinedGuests;
  const rsvpRate = totalGuests > 0 ? Math.round((confirmedGuests / totalGuests) * 100) : 100;
  const responseRate = totalGuests > 0 ? Math.round((respondedGuests / totalGuests) * 100) : 100;

  let rsvpScore = 25;
  if (totalGuests > 0) {
    rsvpScore = Math.round((responseRate / 100) * 25);
  }

  // 3. Task Completion (25%)
  const totalTasks = eventTasks.length;
  const completedTasks = eventTasks.filter(t => t.status === 'Completed').length;
  const taskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;
  let taskScore = 25;
  if (totalTasks > 0) {
    taskScore = Math.round((taskRate / 100) * 25);
  }

  // 4. Vendor Confirmation (25%)
  const totalVendors = eventVendors.length;
  const confirmedVendors = eventVendors.filter(v => v.status === 'Confirmed').length;
  const vendorRate = totalVendors > 0 ? Math.round((confirmedVendors / totalVendors) * 100) : 100;
  let vendorScore = 25;
  if (totalVendors > 0) {
    vendorScore = Math.round((vendorRate / 100) * 25);
  }

  // Total Score (0-100)
  const score = Math.min(100, Math.max(0, Math.round(budgetScore + rsvpScore + taskScore + vendorScore)));

  let level: 'Excellent' | 'Good' | 'Needs Attention' | 'Critical';
  let colorClass = 'text-emerald-700';
  let bgClass = 'bg-emerald-50';
  let borderClass = 'border-emerald-200';
  let badgeVariant: 'success' | 'indigo' | 'warning' | 'danger' = 'success';
  let explanation = 'Excellent — planning is on track across finances, tasks, and attendees.';

  if (score >= 90) {
    level = 'Excellent';
    colorClass = 'text-emerald-700';
    bgClass = 'bg-emerald-50';
    borderClass = 'border-emerald-200';
    badgeVariant = 'success';
    explanation = 'Excellent — planning is on track with healthy budgets and strong milestones.';
  } else if (score >= 70) {
    level = 'Good';
    colorClass = 'text-indigo-700';
    bgClass = 'bg-indigo-50';
    borderClass = 'border-indigo-200';
    badgeVariant = 'indigo';
    explanation = totalGuests > 0 && rsvpRate < 70
      ? 'Good — most planning tasks are complete, but some guest RSVPs remain pending.'
      : 'Good — event preparation is proceeding smoothly within parameters.';
  } else if (score >= 50) {
    level = 'Needs Attention';
    colorClass = 'text-amber-800';
    bgClass = 'bg-amber-50';
    borderClass = 'border-amber-200';
    badgeVariant = 'warning';
    explanation = budgetPercent >= 70
      ? 'Needs Attention — budget utilization is high and several planning tasks remain.'
      : 'Needs Attention — multiple checklist tasks or attendee confirmations require follow-up.';
  } else {
    level = 'Critical';
    colorClass = 'text-rose-700';
    bgClass = 'bg-rose-50';
    borderClass = 'border-rose-200';
    badgeVariant = 'danger';
    explanation = totalSpent > eventBudget
      ? 'Critical — expenses have surpassed budget allocation, requiring immediate review.'
      : 'Critical — event is approaching with major planning items incomplete.';
  }

  return {
    score,
    level,
    explanation,
    budgetPercent,
    rsvpRate,
    taskRate,
    vendorRate,
    colorClass,
    bgClass,
    borderClass,
    badgeVariant,
  };
}

/**
 * Generates dynamic Priority Alerts ("Needs Attention") based on actual application data
 */
export function generatePriorityAlerts(
  activeEventId: string,
  events: EventItem[],
  guests: Guest[],
  expenses: Expense[],
  tasks: Task[],
  vendors: Vendor[],
  tables: SeatingTable[],
  formatCurrency: (val: number) => string
): PriorityAlert[] {
  const alerts: PriorityAlert[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Scoped datasets
  const targetEvents = activeEventId === 'ALL' ? events : events.filter(e => e.id === activeEventId);

  targetEvents.forEach(evt => {
    const evtGuests = guests.filter(g => g.eventId === evt.id);
    const evtExpenses = expenses.filter(e => e.eventId === evt.id);
    const evtTasks = tasks.filter(t => t.eventId === evt.id);
    const evtVendors = vendors.filter(v => v.eventId === evt.id);
    const evtTables = tables.filter(t => t.eventId === evt.id);

    const spent = evtExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const budgetUsagePercent = evt.budget > 0 ? Math.round((spent / evt.budget) * 100) : 0;

    // 1. Budget Alerts
    if (spent > evt.budget && evt.budget > 0) {
      alerts.push({
        id: `alert-budget-crit-${evt.id}`,
        type: 'budget',
        title: 'Budget Deficit',
        message: `${evt.name} is over budget by ${formatCurrency(spent - evt.budget)} (${budgetUsagePercent}% spent).`,
        severity: 'critical',
        actionTab: 'budget',
        actionLabel: 'Review Budget',
        eventId: evt.id,
        eventName: evt.name,
      });
    } else if (budgetUsagePercent >= 70 && evt.budget > 0) {
      alerts.push({
        id: `alert-budget-warn-${evt.id}`,
        type: 'budget',
        title: 'Budget Warning',
        message: `${evt.name} budget is ${budgetUsagePercent}% utilized (${formatCurrency(spent)} of ${formatCurrency(evt.budget)}).`,
        severity: budgetUsagePercent >= 90 ? 'critical' : 'warning',
        actionTab: 'budget',
        actionLabel: 'Audit Expenses',
        eventId: evt.id,
        eventName: evt.name,
      });
    }

    // 2. RSVP Alerts
    const pendingGuests = evtGuests.filter(g => g.rsvpStatus === 'Pending');
    if (pendingGuests.length > 0) {
      alerts.push({
        id: `alert-rsvp-${evt.id}`,
        type: 'rsvp',
        title: 'Pending RSVPs',
        message: `${pendingGuests.length} guest${pendingGuests.length > 1 ? 's have' : ' has'} not responded for ${evt.name}.`,
        severity: pendingGuests.length >= 10 ? 'warning' : 'info',
        actionTab: 'guests',
        actionLabel: 'Follow Up Guests',
        eventId: evt.id,
        eventName: evt.name,
      });
    }

    // 3. Task Alerts
    const overdueTasks = evtTasks.filter(t => {
      if (t.status === 'Completed') return false;
      const d = new Date(t.dueDate + (t.dueDate.includes('T') ? '' : 'T00:00:00'));
      d.setHours(0, 0, 0, 0);
      return d < today;
    });

    if (overdueTasks.length > 0) {
      alerts.push({
        id: `alert-task-overdue-${evt.id}`,
        type: 'task',
        title: 'Overdue Milestones',
        message: `${overdueTasks.length} task${overdueTasks.length > 1 ? 's are' : ' is'} overdue for ${evt.name}.`,
        severity: 'critical',
        actionTab: 'timeline',
        actionLabel: 'View Timeline',
        eventId: evt.id,
        eventName: evt.name,
      });
    }

    const highPriorityPendingTasks = evtTasks.filter(
      t => t.status !== 'Completed' && t.priority === 'High' && !overdueTasks.some(o => o.id === t.id)
    );

    if (highPriorityPendingTasks.length > 0) {
      alerts.push({
        id: `alert-task-prio-${evt.id}`,
        type: 'task',
        title: 'High Priority Tasks',
        message: `${highPriorityPendingTasks.length} high-priority checklist item${highPriorityPendingTasks.length > 1 ? 's require' : ' requires'} completion for ${evt.name}.`,
        severity: 'warning',
        actionTab: 'timeline',
        actionLabel: 'Review Tasks',
        eventId: evt.id,
        eventName: evt.name,
      });
    }

    // 4. Vendor Alerts
    const pendingVendors = evtVendors.filter(v => v.status === 'Pending');
    if (pendingVendors.length > 0) {
      alerts.push({
        id: `alert-vendor-${evt.id}`,
        type: 'vendor',
        title: 'Vendor Confirmation',
        message: `${pendingVendors.length} supplier agreement${pendingVendors.length > 1 ? 's are' : ''} still pending for ${evt.name}.`,
        severity: 'warning',
        actionTab: 'vendors',
        actionLabel: 'Confirm Vendors',
        eventId: evt.id,
        eventName: evt.name,
      });
    }

    // 5. Seating Arrangement Alert
    if (evtTables.length > 0) {
      const unassignedCount = evtGuests.filter(g => !g.tableId).length;
      if (unassignedCount > 0) {
        alerts.push({
          id: `alert-seating-${evt.id}`,
          type: 'seating',
          title: 'Seating Incomplete',
          message: `${unassignedCount} attendee${unassignedCount > 1 ? 's need' : ' needs'} table placement in ${evt.name}.`,
          severity: 'info',
          actionTab: 'seating',
          actionLabel: 'Assign Seating',
          eventId: evt.id,
          eventName: evt.name,
        });
      }
    }
  });

  // Sort alerts: critical first, then warning, then info
  const severityWeight = { critical: 3, warning: 2, info: 1 };
  alerts.sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity]);

  return alerts;
}

/**
 * Generates prioritized Next Actions based on actual tasks, vendors, and planning progress
 */
export function generateNextActions(
  activeEventId: string,
  events: EventItem[],
  guests: Guest[],
  expenses: Expense[],
  tasks: Task[],
  vendors: Vendor[],
  tables: SeatingTable[]
): NextActionItem[] {
  const actions: NextActionItem[] = [];

  const targetEvents = activeEventId === 'ALL' ? events : events.filter(e => e.id === activeEventId);

  targetEvents.forEach(evt => {
    const evtTasks = tasks.filter(t => t.eventId === evt.id);
    const evtVendors = vendors.filter(v => v.eventId === evt.id);
    const evtGuests = guests.filter(g => g.eventId === evt.id);
    const evtTables = tables.filter(t => t.eventId === evt.id);
    const evtExpenses = expenses.filter(e => e.eventId === evt.id);

    // 1. High priority or in-progress tasks
    const relevantTasks = evtTasks
      .filter(t => t.status !== 'Completed')
      .sort((a, b) => {
        if (a.priority === 'High' && b.priority !== 'High') return -1;
        if (b.priority === 'High' && a.priority !== 'High') return 1;
        return a.dueDate.localeCompare(b.dueDate);
      });

    relevantTasks.slice(0, 2).forEach(t => {
      actions.push({
        id: `act-task-${t.id}`,
        action: `Complete "${t.name}"`,
        eventName: evt.name,
        dueDate: t.dueDate,
        priority: t.priority,
        statusText: t.status === 'In Progress' ? 'In Progress' : 'To Do',
        actionTab: 'timeline',
        actionLabel: 'Open Timeline',
      });
    });

    // 2. Pending vendors
    const pendingVendors = evtVendors.filter(v => v.status === 'Pending');
    if (pendingVendors.length > 0) {
      const v = pendingVendors[0];
      actions.push({
        id: `act-vnd-${v.id}`,
        action: `Confirm contract with ${v.name} (${v.category})`,
        eventName: evt.name,
        priority: 'High',
        statusText: 'Contract Pending',
        actionTab: 'vendors',
        actionLabel: 'Review Vendor',
      });
    }

    // 3. Pending RSVPs
    const pendingGuests = evtGuests.filter(g => g.rsvpStatus === 'Pending');
    if (pendingGuests.length > 0) {
      actions.push({
        id: `act-rsvp-${evt.id}`,
        action: `Follow up with ${pendingGuests.length} unconfirmed guests`,
        eventName: evt.name,
        priority: pendingGuests.length >= 10 ? 'High' : 'Medium',
        statusText: `${pendingGuests.length} Pending`,
        actionTab: 'guests',
        actionLabel: 'View Guest List',
      });
    }

    // 4. Seating table assignment
    if (evtTables.length > 0) {
      const unassigned = evtGuests.filter(g => !g.tableId);
      if (unassigned.length > 0) {
        actions.push({
          id: `act-seat-${evt.id}`,
          action: `Finalize table seating for ${unassigned.length} remaining attendees`,
          eventName: evt.name,
          priority: 'Medium',
          statusText: `${unassigned.length} Unseated`,
          actionTab: 'seating',
          actionLabel: 'Assign Tables',
        });
      }
    }

    // 5. Budget check if high
    const spent = evtExpenses.reduce((sum, e) => sum + e.amount, 0);
    if (evt.budget > 0 && spent / evt.budget >= 0.75) {
      actions.push({
        id: `act-bgt-${evt.id}`,
        action: `Audit expense disbursements (${Math.round((spent / evt.budget) * 100)}% used)`,
        eventName: evt.name,
        priority: spent > evt.budget ? 'High' : 'Medium',
        statusText: 'Budget Check',
        actionTab: 'budget',
        actionLabel: 'Open Budget',
      });
    }
  });

  return actions.slice(0, 6);
}
