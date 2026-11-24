import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Plus, 
  Calendar, 
  Users, 
  Wallet, 
  ListTodo, 
  Building2, 
  Sparkles,
  ChevronDown,
  X
} from 'lucide-react';
import { useEventContext } from '../../context/EventContext';
import { NavTab } from './Sidebar';

interface TopBarProps {
  currentTab: NavTab;
  onOpenSidebar: () => void;
  onSelectTab: (tab: NavTab) => void;
  onOpenAddModal: (type: 'event' | 'guest' | 'expense' | 'vendor' | 'task') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onOpenSidebar,
  onSelectTab,
  onOpenAddModal,
}) => {
  const { 
    globalSearch, 
    setGlobalSearch, 
    notifications, 
    markNotificationAsRead, 
    clearAllNotifications,
    activeEventId,
    setActiveEventId,
    events,
    activeEvent
  } = useEventContext();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const tabMeta: Record<NavTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard Overview', subtitle: 'Real-time metrics, RSVP health, and upcoming schedule' },
    events: { title: 'Event Management', subtitle: 'Manage, schedule, and track all planned celebrations' },
    guests: { title: 'Guests & RSVP', subtitle: 'Monitor guest invitations, attendance, and headcounts' },
    budget: { title: 'Budget & Expenses', subtitle: 'Track allocations, invoices, and expense thresholds' },
    vendors: { title: 'Vendor Directory', subtitle: 'Manage partners, service contracts, and status' },
    timeline: { title: 'Planning Timeline & Tasks', subtitle: 'Milestones, operational priorities, and execution status' },
    seating: { title: 'Seating Arrangements', subtitle: 'Table capacities, guest allocation, and zone plans' },
    reports: { title: 'Analytics & Reports', subtitle: 'Data breakdowns, expenditure distributions, and export' },
    settings: { title: 'Settings & Studio Tools', subtitle: 'Demo data resets, schema controls, and system preferences' },
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (quickAddRef.current && !quickAddRef.current.contains(event.target as Node)) {
        setShowQuickAdd(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#FCF8F1]/90 backdrop-blur-md border-b border-[#E6D5C1] px-4 sm:px-6 py-3.5 transition-all shadow-[0_2px_12px_rgba(72,51,41,0.03)]">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-xl text-[#483329] hover:text-[#29231F] hover:bg-[#F7F0E5] transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-editorial font-bold text-[#29231F] tracking-tight truncate">
                {tabMeta[currentTab]?.title || 'EventEase'}
              </h1>
              {activeEvent && (
                <span className="hidden md:inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-[#F7F0E5] text-[#483329] border border-[#E6D5C1] font-medium truncate max-w-[200px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D98261]"></span>
                  {activeEvent.name}
                </span>
              )}
            </div>
            <p className="text-xs text-[#483329]/70 hidden sm:block truncate mt-0.5">
              {tabMeta[currentTab]?.subtitle}
            </p>
          </div>
        </div>

        {/* Center / Right: Search, Quick Add, Notifications, User */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
          {/* Global Search Bar */}
          <div className="relative hidden md:block w-48 lg:w-64">
            <Search className="w-4 h-4 text-[#B96E42]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search anything..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 bg-[#F7F0E5] hover:bg-white focus:bg-white text-xs sm:text-sm text-[#29231F] placeholder-[#483329]/50 border border-[#E6D5C1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D98261]/30 focus:border-[#D98261] transition-all shadow-2xs"
            />
            {globalSearch && (
              <button
                type="button"
                onClick={() => setGlobalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#483329]/50 hover:text-[#29231F] p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Event Scope Selector (Tablet/Desktop) */}
          <div className="hidden xl:flex items-center">
            <select
              value={activeEventId}
              onChange={(e) => setActiveEventId(e.target.value)}
              className="bg-[#F7F0E5] hover:bg-[#FCF8F1] text-[#483329] border border-[#E6D5C1] text-xs rounded-xl py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#D98261] font-medium transition-colors shadow-2xs"
            >
              <option value="ALL">🌿 All Events View</option>
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name.length > 20 ? evt.name.substring(0, 20) + '...' : evt.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Add Dropdown Button */}
          <div className="relative" ref={quickAddRef}>
            <button
              type="button"
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-[#D98261] hover:bg-[#B96E42] active:bg-[#9E5730] rounded-xl shadow-[0_4px_12px_rgba(217,130,97,0.3)] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-90" />
            </button>

            {showQuickAdd && (
              <div className="absolute right-0 mt-2 w-52 bg-[#FCF8F1] rounded-2xl shadow-xl border border-[#E6D5C1] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-1 text-[10px] font-bold text-[#B96E42] uppercase tracking-wider">
                  Quick Create
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuickAdd(false);
                    onOpenAddModal('event');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#483329] hover:bg-[#F7F0E5] hover:text-[#D98261] transition-colors"
                >
                  <Calendar className="w-4 h-4 text-[#D98261]" />
                  <span>New Event</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuickAdd(false);
                    onOpenAddModal('guest');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#483329] hover:bg-[#F7F0E5] hover:text-[#A6A77A] transition-colors"
                >
                  <Users className="w-4 h-4 text-[#A6A77A]" />
                  <span>New Guest</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuickAdd(false);
                    onOpenAddModal('expense');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#483329] hover:bg-[#F7F0E5] hover:text-[#B96E42] transition-colors"
                >
                  <Wallet className="w-4 h-4 text-[#B96E42]" />
                  <span>Record Expense</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuickAdd(false);
                    onOpenAddModal('task');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#483329] hover:bg-[#F7F0E5] hover:text-[#D98261] transition-colors"
                >
                  <ListTodo className="w-4 h-4 text-[#D98261]" />
                  <span>Create Task</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuickAdd(false);
                    onOpenAddModal('vendor');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#483329] hover:bg-[#F7F0E5] hover:text-[#483329] transition-colors"
                >
                  <Building2 className="w-4 h-4 text-[#483329]" />
                  <span>Add Vendor</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-[#483329] hover:text-[#29231F] hover:bg-[#F7F0E5] rounded-xl transition-colors border border-[#E6D5C1]"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D98261] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#FCF8F1]">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-[#FCF8F1] rounded-2xl shadow-2xl border border-[#E6D5C1] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3.5 bg-[#F7F0E5] border-b border-[#E6D5C1] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#483329] uppercase tracking-wide">Studio Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#D98261]/20 text-[#B96E42] text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={clearAllNotifications}
                      className="text-[11px] font-semibold text-[#D98261] hover:text-[#B96E42] transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#E6D5C1]/60">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#483329]/60 font-serif italic">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.linkTab) onSelectTab(notif.linkTab as NavTab);
                          setShowNotifications(false);
                        }}
                        className={`p-3.5 hover:bg-[#F7F0E5] cursor-pointer transition-colors ${
                          !notif.read ? 'bg-[#D98261]/10' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-[#29231F]">{notif.title}</p>
                          <span className="text-[10px] text-[#483329]/60 whitespace-nowrap">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs text-[#483329]/80 mt-0.5 leading-relaxed">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Studio Lead Avatar */}
          <button
            type="button"
            onClick={() => onSelectTab('settings')}
            className="flex items-center gap-2 pl-2 border-l border-[#E6D5C1] hover:opacity-85 transition-opacity cursor-pointer text-left"
            title="Open Studio Profile & Settings"
          >
            <div className="w-8 h-8 rounded-full bg-[#B96E42] text-[#FCF8F1] font-bold text-xs flex items-center justify-center shadow-xs">
              AY
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-[#29231F] leading-tight">Ayush Yadav</p>
              <p className="text-[10px] text-[#B96E42] font-medium leading-tight">Event Director</p>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Global Search Bar */}
      <div className="mt-2.5 block md:hidden">
        <div className="relative">
          <Search className="w-4 h-4 text-[#B96E42]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search events, guests, tasks..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-[#F7F0E5] text-xs text-[#29231F] placeholder-[#483329]/50 border border-[#E6D5C1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D98261]/30 focus:border-[#D98261] transition-all"
          />
          {globalSearch && (
            <button
              type="button"
              onClick={() => setGlobalSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#483329]/50 hover:text-[#29231F] p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
