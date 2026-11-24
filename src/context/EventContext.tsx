import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  EventItem, 
  Guest, 
  Expense, 
  Vendor, 
  Task, 
  SeatingTable, 
  ToastMessage, 
  AppNotification, 
  ActivityItem,
  RSVPStatus, 
  TaskStatus, 
  VendorStatus 
} from '../types';
import { 
  INITIAL_EVENTS, 
  INITIAL_GUESTS, 
  INITIAL_EXPENSES, 
  INITIAL_VENDORS, 
  INITIAL_TASKS, 
  INITIAL_TABLES,
  INITIAL_ACTIVITIES
} from '../data/initialData';

const STORAGE_KEYS = {
  EVENTS: 'eventease_events_v1',
  GUESTS: 'eventease_guests_v1',
  EXPENSES: 'eventease_expenses_v1',
  VENDORS: 'eventease_vendors_v1',
  TASKS: 'eventease_tasks_v1',
  TABLES: 'eventease_tables_v1',
  ACTIVE_EVENT: 'eventease_active_event_id_v1',
  NOTIFICATIONS: 'eventease_notifications_v1',
  ACTIVITIES: 'eventease_activities_v1',
};

interface EventContextType {
  // Data
  events: EventItem[];
  guests: Guest[];
  expenses: Expense[];
  vendors: Vendor[];
  tasks: Task[];
  tables: SeatingTable[];
  activeEventId: string; // 'ALL' or specific event ID
  setActiveEventId: (id: string) => void;
  currency: string;
  formatCurrency: (amount: number) => string;

  // Search & Global state
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Notifications & Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Real-time Activity Feed
  activities: ActivityItem[];
  logActivity: (action: string, type: ActivityItem['type'], eventId?: string) => void;

  // Event CRUD
  addEvent: (event: Omit<EventItem, 'id' | 'createdAt'>) => EventItem;
  updateEvent: (id: string, updates: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;

  // Guest CRUD
  addGuest: (guest: Omit<Guest, 'id' | 'createdAt'>) => Guest;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  updateGuestRSVP: (id: string, status: RSVPStatus) => void;
  assignGuestToTable: (guestId: string, tableId: string | undefined) => void;

  // Expense CRUD
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Expense;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  // Vendor CRUD
  addVendor: (vendor: Omit<Vendor, 'id' | 'createdAt'>) => Vendor;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  updateVendorStatus: (id: string, status: VendorStatus) => void;

  // Task CRUD
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;

  // Seating Table CRUD
  addTable: (table: Omit<SeatingTable, 'id' | 'createdAt'>) => SeatingTable;
  updateTable: (id: string, updates: Partial<SeatingTable>) => void;
  deleteTable: (id: string) => void;

  // System actions
  resetToDemoData: () => void;
  clearAllData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;

  // Filtered views based on activeEventId
  activeEvent: EventItem | undefined;
  filteredGuests: Guest[];
  filteredExpenses: Expense[];
  filteredVendors: Vendor[];
  filteredTasks: Task[];
  filteredTables: SeatingTable[];

  // Dynamic Metrics
  stats: {
    totalEvents: number;
    upcomingEvents: number;
    totalGuests: number;
    headcountWithPlusOnes: number;
    rsvpConfirmed: number;
    rsvpPending: number;
    rsvpDeclined: number;
    totalBudget: number;
    totalSpent: number;
    remainingBudget: number;
    budgetUsagePercent: number;
    totalVendors: number;
    totalTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    taskCompletionPercent: number;
    isBudgetHighAlert: boolean;
    budgetHealth: {
      level: 'normal' | 'warning' | 'critical' | 'over_budget';
      label: string;
      message: string;
      colorScheme: 'emerald' | 'amber' | 'orange' | 'rose';
      percentage: number;
      remainingPercentage: number;
      overAmount: number;
    };
  };
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial data from localStorage or fallback to defaults
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [guests, setGuests] = useState<Guest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GUESTS);
      return saved ? JSON.parse(saved) : INITIAL_GUESTS;
    } catch {
      return INITIAL_GUESTS;
    }
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  const [vendors, setVendors] = useState<Vendor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VENDORS);
      return saved ? JSON.parse(saved) : INITIAL_VENDORS;
    } catch {
      return INITIAL_VENDORS;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [tables, setTables] = useState<SeatingTable[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TABLES);
      return saved ? JSON.parse(saved) : INITIAL_TABLES;
    } catch {
      return INITIAL_TABLES;
    }
  });

  const [activeEventId, setActiveEventId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_EVENT);
      return saved || 'ALL';
    } catch {
      return 'ALL';
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'High Budget Alert',
      message: 'Royal Heritage Wedding expenses have reached over 80% of allocated budget.',
      timestamp: '10 mins ago',
      type: 'warning',
      read: false,
      linkTab: 'budget',
    },
    {
      id: 'notif-2',
      title: 'New RSVP Received',
      message: 'Sunita & Ramesh Agrawal confirmed attendance for Royal Heritage Wedding.',
      timestamp: '2 hours ago',
      type: 'success',
      read: false,
      linkTab: 'guests',
    },
    {
      id: 'notif-3',
      title: 'Upcoming Task Deadline',
      message: '"Approve Sangeet Stage & Floral Moodboard" is due soon.',
      timestamp: 'Yesterday',
      type: 'info',
      read: true,
      linkTab: 'timeline',
    }
  ]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const currency = '₹';

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch (e) {
      console.error('Storage error for activities', e);
    }
  }, [activities]);

  const logActivity = (action: string, type: ActivityItem['type'], eventId?: string) => {
    const newAct: ActivityItem = {
      id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      action,
      type,
      timestamp: 'Just now',
      eventId
    };
    setActivities(prev => [newAct, ...prev.slice(0, 19)]);
  };

  // Format currency in Indian standard numbering
  const formatCurrency = (amount: number): string => {
    if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
    return '₹' + Number(amount).toLocaleString('en-IN');
  };

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error('Storage error for events', e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(guests));
    } catch (e) {
      console.error('Storage error for guests', e);
    }
  }, [guests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (e) {
      console.error('Storage error for expenses', e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
    } catch (e) {
      console.error('Storage error for vendors', e);
    }
  }, [vendors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Storage error for tasks', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
    } catch (e) {
      console.error('Storage error for tables', e);
    }
  }, [tables]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_EVENT, activeEventId);
    } catch (e) {
      console.error('Storage error for active event', e);
    }
  }, [activeEventId]);

  // Toast notification system
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Active event resolution
  const activeEvent = useMemo(() => {
    if (activeEventId === 'ALL') return undefined;
    return events.find(e => e.id === activeEventId);
  }, [events, activeEventId]);

  // Filtered lists depending on active event
  const filteredGuests = useMemo(() => {
    if (activeEventId === 'ALL') return guests;
    return guests.filter(g => g.eventId === activeEventId);
  }, [guests, activeEventId]);

  const filteredExpenses = useMemo(() => {
    if (activeEventId === 'ALL') return expenses;
    return expenses.filter(e => e.eventId === activeEventId);
  }, [expenses, activeEventId]);

  const filteredVendors = useMemo(() => {
    if (activeEventId === 'ALL') return vendors;
    return vendors.filter(v => v.eventId === activeEventId);
  }, [vendors, activeEventId]);

  const filteredTasks = useMemo(() => {
    if (activeEventId === 'ALL') return tasks;
    return tasks.filter(t => t.eventId === activeEventId);
  }, [tasks, activeEventId]);

  const filteredTables = useMemo(() => {
    if (activeEventId === 'ALL') return tables;
    return tables.filter(t => t.eventId === activeEventId);
  }, [tables, activeEventId]);

  // Dynamic statistics calculations
  const stats = useMemo(() => {
    // Events stats
    const totalEvents = activeEventId === 'ALL' ? events.length : (activeEvent ? 1 : 0);
    const upcomingEvents = activeEventId === 'ALL'
      ? events.filter(e => e.status === 'Upcoming' || e.status === 'In Progress').length
      : ((activeEvent?.status === 'Upcoming' || activeEvent?.status === 'In Progress') ? 1 : 0);

    // Applicable datasets based on context
    const currentEvents = activeEventId === 'ALL' ? events : events.filter(e => e.id === activeEventId);
    const currentGuests = filteredGuests;
    const currentExpenses = filteredExpenses;
    const currentVendors = filteredVendors;
    const currentTasks = filteredTasks;

    // Guests stats
    const totalGuests = currentGuests.length;
    const headcountWithPlusOnes = currentGuests.reduce((sum, g) => sum + (Number(g.plusGuests) || 1), 0);
    const rsvpConfirmed = currentGuests.filter(g => g.rsvpStatus === 'Confirmed').length;
    const rsvpPending = currentGuests.filter(g => g.rsvpStatus === 'Pending').length;
    const rsvpDeclined = currentGuests.filter(g => g.rsvpStatus === 'Declined').length;

    // Budget stats
    const totalBudget = currentEvents.reduce((sum, e) => sum + (Number(e.budget) || 0), 0);
    const totalSpent = currentExpenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
    const remainingBudget = totalBudget - totalSpent;
    const budgetUsagePercent = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 999) : 0;
    const isBudgetHighAlert = budgetUsagePercent >= 70;

    // Vendors stats
    const totalVendors = currentVendors.length;

    // Tasks stats
    const totalTasks = currentTasks.length;
    const pendingTasks = currentTasks.filter(t => t.status === 'To Do').length;
    const inProgressTasks = currentTasks.filter(t => t.status === 'In Progress').length;
    const completedTasks = currentTasks.filter(t => t.status === 'Completed').length;
    const taskCompletionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Intelligent 4-Tier Budget Warning System
    const remainingPercentage = Math.max(0, 100 - budgetUsagePercent);
    const overAmount = Math.max(0, totalSpent - totalBudget);

    let budgetHealth: {
      level: 'normal' | 'warning' | 'critical' | 'over_budget';
      label: string;
      message: string;
      colorScheme: 'emerald' | 'amber' | 'orange' | 'rose';
      percentage: number;
      remainingPercentage: number;
      overAmount: number;
    };

    if (budgetUsagePercent < 70) {
      budgetHealth = {
        level: 'normal',
        label: 'Budget health: Healthy',
        message: `${budgetUsagePercent}% of allocated budget used. Expenses are well controlled.`,
        colorScheme: 'emerald',
        percentage: budgetUsagePercent,
        remainingPercentage,
        overAmount: 0,
      };
    } else if (budgetUsagePercent >= 70 && budgetUsagePercent < 90) {
      budgetHealth = {
        level: 'warning',
        label: 'Budget Warning',
        message: `Budget warning: ${budgetUsagePercent}% of allocated budget used.`,
        colorScheme: 'amber',
        percentage: budgetUsagePercent,
        remainingPercentage,
        overAmount: 0,
      };
    } else if (budgetUsagePercent >= 90 && budgetUsagePercent < 100) {
      budgetHealth = {
        level: 'critical',
        label: 'Critical Alert',
        message: `Critical: Only ${remainingPercentage}% budget remaining.`,
        colorScheme: 'orange',
        percentage: budgetUsagePercent,
        remainingPercentage,
        overAmount: 0,
      };
    } else {
      budgetHealth = {
        level: 'over_budget',
        label: 'Over Budget',
        message: overAmount > 0 
          ? `Over budget by ${formatCurrency(overAmount)}.` 
          : `Budget limit reached (100% used).`,
        colorScheme: 'rose',
        percentage: budgetUsagePercent,
        remainingPercentage: 0,
        overAmount,
      };
    }

    return {
      totalEvents,
      upcomingEvents,
      totalGuests,
      headcountWithPlusOnes,
      rsvpConfirmed,
      rsvpPending,
      rsvpDeclined,
      totalBudget,
      totalSpent,
      remainingBudget,
      budgetUsagePercent,
      totalVendors,
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      taskCompletionPercent,
      isBudgetHighAlert,
      budgetHealth,
    };
  }, [events, activeEvent, activeEventId, filteredGuests, filteredExpenses, filteredVendors, filteredTasks]);

  // CRUD Implementations
  // Events
  const addEvent = (eventData: Omit<EventItem, 'id' | 'createdAt'>): EventItem => {
    const newEvent: EventItem = {
      ...eventData,
      id: 'evt-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setEvents(prev => [newEvent, ...prev]);
    logActivity(`Created new event "${newEvent.name}"`, 'event', newEvent.id);
    showToast('Event created successfully.', 'success');
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<EventItem>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    logActivity(`Updated event "${updates.name || 'details'}"`, 'event', id);
    showToast('Event updated successfully.', 'success');
  };

  const deleteEvent = (id: string) => {
    const toDelete = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    // Cascade cleanup or decouple
    setGuests(prev => prev.filter(g => g.eventId !== id));
    setExpenses(prev => prev.filter(exp => exp.eventId !== id));
    setVendors(prev => prev.filter(v => v.eventId !== id));
    setTasks(prev => prev.filter(t => t.eventId !== id));
    setTables(prev => prev.filter(tbl => tbl.eventId !== id));

    if (activeEventId === id) {
      setActiveEventId('ALL');
    }
    logActivity(`Deleted event "${toDelete?.name || 'Item'}"`, 'event', id);
    showToast(`Event "${toDelete?.name || 'Item'}" deleted.`, 'info');
  };

  // Guests
  const addGuest = (guestData: Omit<Guest, 'id' | 'createdAt'>): Guest => {
    const newGuest: Guest = {
      ...guestData,
      id: 'gst-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setGuests(prev => [newGuest, ...prev]);
    logActivity(`Added guest ${newGuest.name} (${newGuest.category})`, 'guest', newGuest.eventId);
    showToast('Guest added successfully.', 'success');
    return newGuest;
  };

  const updateGuest = (id: string, updates: Partial<Guest>) => {
    setGuests(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    showToast('Guest updated successfully.', 'success');
  };

  const deleteGuest = (id: string) => {
    const toDelete = guests.find(g => g.id === id);
    setGuests(prev => prev.filter(g => g.id !== id));
    logActivity(`Removed guest ${toDelete?.name || 'Item'}`, 'guest', toDelete?.eventId);
    showToast(`Guest "${toDelete?.name || 'Item'}" removed.`, 'info');
  };

  const updateGuestRSVP = (id: string, status: RSVPStatus) => {
    const target = guests.find(g => g.id === id);
    setGuests(prev => prev.map(g => g.id === id ? { ...g, rsvpStatus: status } : g));
    logActivity(`${target?.name || 'Guest'} RSVP changed to ${status}`, 'guest', target?.eventId);
    showToast('RSVP status updated.', 'success');
  };

  const assignGuestToTable = (guestId: string, tableId: string | undefined) => {
    setGuests(prev => prev.map(g => g.id === guestId ? { ...g, tableId } : g));
    showToast(tableId ? 'Guest assigned to table.' : 'Guest unassigned from table.', 'success');
  };

  // Expenses
  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>): Expense => {
    const newExpense: Expense = {
      ...expenseData,
      id: 'exp-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setExpenses(prev => [newExpense, ...prev]);
    logActivity(`Recorded expense "${newExpense.name}" of ${formatCurrency(newExpense.amount)}`, 'expense', newExpense.eventId);
    showToast('Expense added successfully.', 'success');
    return newExpense;
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    showToast('Expense updated successfully.', 'success');
  };

  const deleteExpense = (id: string) => {
    const toDelete = expenses.find(e => e.id === id);
    setExpenses(prev => prev.filter(e => e.id !== id));
    logActivity(`Removed expense "${toDelete?.name || 'Item'}"`, 'expense', toDelete?.eventId);
    showToast(`Expense "${toDelete?.name || 'Item'}" deleted.`, 'info');
  };

  // Vendors
  const addVendor = (vendorData: Omit<Vendor, 'id' | 'createdAt'>): Vendor => {
    const newVendor: Vendor = {
      ...vendorData,
      id: 'vnd-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setVendors(prev => [newVendor, ...prev]);
    logActivity(`Added vendor "${newVendor.name}" for ${newVendor.category}`, 'vendor', newVendor.eventId);
    showToast('Vendor added successfully.', 'success');
    return newVendor;
  };

  const updateVendor = (id: string, updates: Partial<Vendor>) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
    showToast('Vendor updated successfully.', 'success');
  };

  const deleteVendor = (id: string) => {
    const toDelete = vendors.find(v => v.id === id);
    setVendors(prev => prev.filter(v => v.id !== id));
    logActivity(`Removed vendor "${toDelete?.name || 'Partner'}"`, 'vendor', toDelete?.eventId);
    showToast(`Vendor "${toDelete?.name || 'Item'}" removed.`, 'info');
  };

  const updateVendorStatus = (id: string, status: VendorStatus) => {
    const target = vendors.find(v => v.id === id);
    setVendors(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    logActivity(`Vendor "${target?.name || 'Partner'}" status updated to ${status}`, 'vendor', target?.eventId);
    showToast(`Vendor status updated to ${status}.`, 'info');
  };

  // Tasks
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: 'tsk-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    logActivity(`Added task "${newTask.name}"`, 'task', newTask.eventId);
    showToast('Task added successfully.', 'success');
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    showToast('Task updated successfully.', 'success');
  };

  const deleteTask = (id: string) => {
    const toDelete = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    logActivity(`Deleted task "${toDelete?.name || 'Item'}"`, 'task', toDelete?.eventId);
    showToast(`Task "${toDelete?.name || 'Item'}" deleted.`, 'info');
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    const target = tasks.find(t => t.id === id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    logActivity(`Task "${target?.name || 'Milestone'}" marked as ${status}`, 'task', target?.eventId);
    if (status === 'Completed') {
      showToast('Task completed successfully.', 'success');
    } else {
      showToast(`Task status updated to ${status}.`, 'info');
    }
  };

  // Tables
  const addTable = (tableData: Omit<SeatingTable, 'id' | 'createdAt'>): SeatingTable => {
    const newTable: SeatingTable = {
      ...tableData,
      id: 'tbl-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setTables(prev => [...prev, newTable]);
    logActivity(`Configured seating table "${newTable.name}"`, 'seating', newTable.eventId);
    showToast(`Table "${newTable.name}" created successfully.`, 'success');
    return newTable;
  };

  const updateTable = (id: string, updates: Partial<SeatingTable>) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    showToast('Table updated successfully.', 'success');
  };

  const deleteTable = (id: string) => {
    const toDelete = tables.find(t => t.id === id);
    // Unassign guests sitting at this table
    setGuests(prev => prev.map(g => g.tableId === id ? { ...g, tableId: undefined } : g));
    setTables(prev => prev.filter(t => t.id !== id));
    logActivity(`Deleted table "${toDelete?.name || 'Item'}"`, 'seating', toDelete?.eventId);
    showToast(`Table "${toDelete?.name || 'Item'}" deleted. Guests unassigned.`, 'info');
  };

  // Demo Data Reset & Data Management
  const resetToDemoData = () => {
    setEvents(INITIAL_EVENTS);
    setGuests(INITIAL_GUESTS);
    setExpenses(INITIAL_EXPENSES);
    setVendors(INITIAL_VENDORS);
    setTasks(INITIAL_TASKS);
    setTables(INITIAL_TABLES);
    setActivities(INITIAL_ACTIVITIES);
    setActiveEventId('ALL');
    showToast('Demo data reloaded successfully!', 'success');
  };

  const clearAllData = () => {
    setEvents([]);
    setGuests([]);
    setExpenses([]);
    setVendors([]);
    setTasks([]);
    setTables([]);
    setActivities([]);
    setActiveEventId('ALL');
    showToast('All data cleared. Application is in empty state.', 'info');
  };

  const exportDataJSON = (): string => {
    const state = {
      events,
      guests,
      expenses,
      vendors,
      tasks,
      tables,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(state, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.events)) setEvents(data.events);
      if (Array.isArray(data.guests)) setGuests(data.guests);
      if (Array.isArray(data.expenses)) setExpenses(data.expenses);
      if (Array.isArray(data.vendors)) setVendors(data.vendors);
      if (Array.isArray(data.tasks)) setTasks(data.tasks);
      if (Array.isArray(data.tables)) setTables(data.tables);
      showToast('Data imported successfully!', 'success');
      return true;
    } catch {
      showToast('Failed to import JSON data. Invalid format.', 'error');
      return false;
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        guests,
        expenses,
        vendors,
        tasks,
        tables,
        activeEventId,
        setActiveEventId,
        currency,
        formatCurrency,

        globalSearch,
        setGlobalSearch,

        toasts,
        showToast,
        removeToast,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,

        addEvent,
        updateEvent,
        deleteEvent,

        addGuest,
        updateGuest,
        deleteGuest,
        updateGuestRSVP,
        assignGuestToTable,

        addExpense,
        updateExpense,
        deleteExpense,

        addVendor,
        updateVendor,
        deleteVendor,
        updateVendorStatus,

        addTask,
        updateTask,
        deleteTask,
        updateTaskStatus,

        addTable,
        updateTable,
        deleteTable,

        resetToDemoData,
        clearAllData,
        exportDataJSON,
        importDataJSON,

        activeEvent,
        filteredGuests,
        filteredExpenses,
        filteredVendors,
        filteredTasks,
        filteredTables,

        activities,
        logActivity,

        stats,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};
