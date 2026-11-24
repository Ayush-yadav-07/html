import React, { useState } from 'react';
import { EventProvider } from './context/EventContext';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { EventsPage } from './pages/EventsPage';
import { GuestsPage } from './pages/GuestsPage';
import { BudgetPage } from './pages/BudgetPage';
import { VendorsPage } from './pages/VendorsPage';
import { TimelinePage } from './pages/TimelinePage';
import { SeatingPage } from './pages/SeatingPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

// Modals
import { EventModal } from './components/modals/EventModal';
import { GuestModal } from './components/modals/GuestModal';
import { ExpenseModal } from './components/modals/ExpenseModal';
import { VendorModal } from './components/modals/VendorModal';
import { TaskModal } from './components/modals/TaskModal';
import { TableModal } from './components/modals/TableModal';

import { EventItem, Guest, Expense, Vendor, Task, SeatingTable } from './types';

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modal states
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<EventItem | null>(null);

  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [guestToEdit, setGuestToEdit] = useState<Guest | null>(null);

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [vendorToEdit, setVendorToEdit] = useState<Vendor | null>(null);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [tableToEdit, setTableToEdit] = useState<SeatingTable | null>(null);

  const handleOpenAddModal = (type: 'event' | 'guest' | 'expense' | 'vendor' | 'task') => {
    switch (type) {
      case 'event':
        setEventToEdit(null);
        setEventModalOpen(true);
        break;
      case 'guest':
        setGuestToEdit(null);
        setGuestModalOpen(true);
        break;
      case 'expense':
        setExpenseToEdit(null);
        setExpenseModalOpen(true);
        break;
      case 'vendor':
        setVendorToEdit(null);
        setVendorModalOpen(true);
        break;
      case 'task':
        setTaskToEdit(null);
        setTaskModalOpen(true);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F0E5] text-[#29231F] flex font-sans antialiased selection:bg-[#D98261] selection:text-white">
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all">
        {/* Sticky Top Bar */}
        <TopBar
          currentTab={currentTab}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onSelectTab={setCurrentTab}
          onOpenAddModal={handleOpenAddModal}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardPage
              onNavigate={setCurrentTab}
              onOpenAddModal={handleOpenAddModal}
            />
          )}

          {currentTab === 'events' && (
            <EventsPage
              onOpenCreateModal={() => {
                setEventToEdit(null);
                setEventModalOpen(true);
              }}
              onOpenEditModal={(evt) => {
                setEventToEdit(evt);
                setEventModalOpen(true);
              }}
            />
          )}

          {currentTab === 'guests' && (
            <GuestsPage
              onOpenCreateModal={() => {
                setGuestToEdit(null);
                setGuestModalOpen(true);
              }}
              onOpenEditModal={(guest) => {
                setGuestToEdit(guest);
                setGuestModalOpen(true);
              }}
            />
          )}

          {currentTab === 'budget' && (
            <BudgetPage
              onOpenCreateModal={() => {
                setExpenseToEdit(null);
                setExpenseModalOpen(true);
              }}
              onOpenEditModal={(exp) => {
                setExpenseToEdit(exp);
                setExpenseModalOpen(true);
              }}
            />
          )}

          {currentTab === 'vendors' && (
            <VendorsPage
              onOpenCreateModal={() => {
                setVendorToEdit(null);
                setVendorModalOpen(true);
              }}
              onOpenEditModal={(v) => {
                setVendorToEdit(v);
                setVendorModalOpen(true);
              }}
            />
          )}

          {currentTab === 'timeline' && (
            <TimelinePage
              onOpenCreateModal={() => {
                setTaskToEdit(null);
                setTaskModalOpen(true);
              }}
              onOpenEditModal={(task) => {
                setTaskToEdit(task);
                setTaskModalOpen(true);
              }}
            />
          )}

          {currentTab === 'seating' && (
            <SeatingPage
              onOpenCreateTableModal={() => {
                setTableToEdit(null);
                setTableModalOpen(true);
              }}
              onOpenEditTableModal={(tbl) => {
                setTableToEdit(tbl);
                setTableModalOpen(true);
              }}
            />
          )}

          {currentTab === 'reports' && <ReportsPage />}

          {currentTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Global Modals */}
      <EventModal
        isOpen={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        eventToEdit={eventToEdit}
      />

      <GuestModal
        isOpen={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        guestToEdit={guestToEdit}
      />

      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        expenseToEdit={expenseToEdit}
      />

      <VendorModal
        isOpen={vendorModalOpen}
        onClose={() => setVendorModalOpen(false)}
        vendorToEdit={vendorToEdit}
      />

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        taskToEdit={taskToEdit}
      />

      <TableModal
        isOpen={tableModalOpen}
        onClose={() => setTableModalOpen(false)}
        tableToEdit={tableToEdit}
      />

      {/* Floating Toast Alerts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <EventProvider>
      <MainLayout />
    </EventProvider>
  );
}
