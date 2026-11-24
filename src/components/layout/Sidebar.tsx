import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Wallet, 
  Building2, 
  ListTodo, 
  Armchair, 
  BarChart3, 
  Settings,
  Sparkles,
  X,
  Layers
} from 'lucide-react';
import { useEventContext } from '../../context/EventContext';

export type NavTab = 
  | 'dashboard'
  | 'events'
  | 'guests'
  | 'budget'
  | 'vendors'
  | 'timeline'
  | 'seating'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
}) => {
  const { stats, activeEventId, events, setActiveEventId } = useEventContext();

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events' as NavTab, label: 'Events', icon: Calendar, badge: stats.totalEvents },
    { id: 'guests' as NavTab, label: 'Guests & RSVP', icon: Users, badge: stats.totalGuests },
    { id: 'budget' as NavTab, label: 'Budget', icon: Wallet, alert: stats.isBudgetHighAlert },
    { id: 'vendors' as NavTab, label: 'Vendors', icon: Building2, badge: stats.totalVendors },
    { id: 'timeline' as NavTab, label: 'Timeline', icon: ListTodo, badge: stats.pendingTasks },
    { id: 'seating' as NavTab, label: 'Seating', icon: Armchair },
    { id: 'reports' as NavTab, label: 'Reports', icon: BarChart3 },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#29231F]/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container: Deep Ink with Espresso & Warm Sand borders */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#29231F] text-[#E6D5C1] flex flex-col transition-transform duration-300 ease-in-out border-r border-[#483329] lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo Area */}
        <div className="p-5 border-b border-[#483329] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D98261] border border-[#B96E42] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-[#FCF8F1]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-editorial font-bold text-[#FCF8F1] tracking-tight">EventEase</span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#483329] text-[#D98261] border border-[#B96E42]/40">
                  Studio
                </span>
              </div>
              <p className="text-[11px] text-[#A6A77A] font-medium tracking-wide">Warm Editorial 3D</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-[#E6D5C1]/70 hover:text-white hover:bg-[#483329] transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Context Selector inside Sidebar */}
        <div className="px-4 py-3.5 border-b border-[#483329]/80 bg-[#1E1714]">
          <div className="flex items-center justify-between text-xs text-[#E6D5C1]/80 mb-1.5">
            <span className="flex items-center gap-1.5 font-semibold text-[#FCF8F1] text-[11px] uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-[#D98261]" />
              Event Scope
            </span>
            <span className="text-[10px] text-[#A6A77A] font-mono">
              {activeEventId === 'ALL' ? 'All Workspace' : 'Focused'}
            </span>
          </div>
          <select
            value={activeEventId}
            onChange={(e) => setActiveEventId(e.target.value)}
            className="w-full bg-[#29231F] text-[#FCF8F1] border border-[#483329] rounded-xl text-xs py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#D98261] focus:border-[#D98261] transition-colors shadow-inner"
          >
            <option value="ALL">🌿 All Events Portfolio</option>
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.name.length > 22 ? evt.name.substring(0, 22) + '...' : evt.name}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-[#D98261] text-[#FCF8F1] font-bold shadow-md shadow-[#D98261]/20 border border-[#B96E42]'
                    : 'text-[#E6D5C1] hover:text-white hover:bg-[#483329]/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-[#D98261]/80 group-hover:text-[#D98261]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.alert && (
                    <span className="w-2 h-2 rounded-full bg-[#D98261] ring-2 ring-[#B96E42]" title="Budget Threshold Alert" />
                  )}
                  {item.badge !== undefined && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        isActive
                          ? 'bg-[#B96E42] text-[#FCF8F1]'
                          : 'bg-[#483329] text-[#E6D5C1] group-hover:text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Viva Project Footer Info Card */}
        <div className="p-4 border-t border-[#483329] bg-[#1E1714]/80">
          <div className="rounded-xl bg-[#29231F] border border-[#483329] p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-[#FCF8F1]">Event Planning Studio</span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#A6A77A]" title="Local Persistent Active" />
            </div>
            <p className="text-[11px] text-[#E6D5C1]/70 mt-1 leading-snug">
              Local persistence online. Offline ready.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
