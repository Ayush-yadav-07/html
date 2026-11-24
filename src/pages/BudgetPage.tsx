import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Wallet, 
  TrendingUp, 
  AlertTriangle, 
  Edit2, 
  Trash2, 
  Receipt,
  RotateCcw,
  X,
  Layers,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { Expense, ExpenseCategory } from '../types';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';

interface BudgetPageProps {
  onOpenCreateModal: () => void;
  onOpenEditModal: (expense: Expense) => void;
}

export const BudgetPage: React.FC<BudgetPageProps> = ({
  onOpenCreateModal,
  onOpenEditModal,
}) => {
  const { 
    filteredExpenses, 
    deleteExpense, 
    stats, 
    formatCurrency, 
    events, 
    globalSearch,
    activeEventId,
    activeEvent,
    setActiveEventId 
  } = useEventContext();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedEventId, setSelectedEventId] = useState<string>('ALL');
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const searchQuery = (localSearch || globalSearch).toLowerCase().trim();

  // Filtered Expenses
  const displayedExpenses = useMemo(() => {
    return filteredExpenses.filter((exp) => {
      const matchesSearch = 
        !searchQuery ||
        exp.name.toLowerCase().includes(searchQuery) ||
        exp.vendorName.toLowerCase().includes(searchQuery) ||
        exp.category.toLowerCase().includes(searchQuery) ||
        (exp.notes && exp.notes.toLowerCase().includes(searchQuery));

      const matchesCategory = selectedCategory === 'ALL' || exp.category === selectedCategory;
      const matchesEvent = activeEventId !== 'ALL' || selectedEventId === 'ALL' || exp.eventId === selectedEventId;

      return matchesSearch && matchesCategory && matchesEvent;
    });
  }, [filteredExpenses, searchQuery, selectedCategory, selectedEventId, activeEventId]);

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'ALL' || (activeEventId === 'ALL' && selectedEventId !== 'ALL');

  const handleResetFilters = () => {
    setLocalSearch('');
    setSelectedCategory('ALL');
    setSelectedEventId('ALL');
  };

  const categories: ExpenseCategory[] = [
    'Venue',
    'Catering',
    'Decoration',
    'Photography',
    'Transport',
    'Entertainment',
    'Other',
  ];

  // Category Spend Distribution
  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    categories.forEach(cat => { map[cat] = 0; });
    filteredExpenses.forEach(exp => {
      map[exp.category] = (map[exp.category] || 0) + exp.amount;
    });
    return map;
  }, [filteredExpenses]);

  const { isBudgetHighAlert, budgetUsagePercent } = stats;

  return (
    <div className="space-y-6 pb-12">
      {/* Scope banner if focused on single event */}
      {activeEvent && (
        <div className="p-3.5 px-5 rounded-2xl bg-[#FCF8F1] border border-[#D98261]/40 flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D98261] shrink-0" />
            <span className="text-[#483329]">
              Showing budget & expenses for: <strong className="text-[#29231F] font-bold">{activeEvent.name}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveEventId('ALL')}
            className="font-bold text-[#D98261] hover:text-[#B96E42] underline"
          >
            Show All Events Budget
          </button>
        </div>
      )}

      {/* High Budget Warning Alert */}
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
              Expenses have reached {budgetUsagePercent}% of the approved budget. Keep expenditure within allocations.
            </p>
          </div>
        </div>
      )}

      {/* 4 Financial Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget */}
        <div className="paper-card bg-[#FCF8F1] p-5 rounded-3xl border border-[#E6D5C1] shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#B96E42] uppercase tracking-wider">Total Allocated</p>
            <div className="p-2 bg-[#F7F0E5] text-[#D98261] rounded-xl border border-[#E6D5C1]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-[#29231F] mt-2 tabular-nums">
            {formatCurrency(stats.totalBudget)}
          </h3>
          <p className="text-xs text-[#483329]/70 mt-1 font-medium">Approved event allocations</p>
        </div>

        {/* Total Spent */}
        <div className="paper-card bg-[#FCF8F1] p-5 rounded-3xl border border-[#E6D5C1] shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#B96E42] uppercase tracking-wider">Total Disbursed</p>
            <div className="p-2 bg-[#F7F0E5] text-[#B96E42] rounded-xl border border-[#E6D5C1]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-[#29231F] mt-2 tabular-nums">
            {formatCurrency(stats.totalSpent)}
          </h3>
          <p className="text-xs text-[#483329]/70 mt-1 font-medium">{filteredExpenses.length} logged expense items</p>
        </div>

        {/* Remaining Budget */}
        <div className="paper-card bg-[#FCF8F1] p-5 rounded-3xl border border-[#E6D5C1] shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#B96E42] uppercase tracking-wider">Remaining Balance</p>
            <div className="p-2 rounded-xl bg-[#F7F0E5] text-[#A6A77A] border border-[#E6D5C1]">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <h3 className={`text-2xl sm:text-3xl font-editorial font-bold mt-2 tabular-nums ${
            stats.remainingBudget < 0 ? 'text-[#B96E42]' : 'text-[#29231F]'
          }`}>
            {formatCurrency(stats.remainingBudget)}
          </h3>
          <p className="text-xs text-[#483329]/70 mt-1 font-medium">
            {stats.remainingBudget < 0 ? 'Budget deficit occurred' : 'Available spending cushion'}
          </p>
        </div>

        {/* Budget Usage % */}
        <div className="paper-card bg-[#FCF8F1] p-5 rounded-3xl border border-[#E6D5C1] shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#B96E42] uppercase tracking-wider">Budget Utilization</p>
            <span className="text-xs font-bold text-[#D98261] px-2.5 py-0.5 rounded-full bg-[#D98261]/15 border border-[#D98261]/40 font-mono">
              {stats.budgetUsagePercent}%
            </span>
          </div>
          <div className="mt-3">
            <div className="w-full h-2.5 bg-[#E6D5C1]/50 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  stats.budgetUsagePercent >= 100
                    ? 'bg-[#B96E42]'
                    : 'bg-[#D98261]'
                }`}
                style={{ width: `${Math.min(stats.budgetUsagePercent, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#483329]/70 mt-1.5 font-medium">
              <span>0% Disbursed</span>
              <span>100% Target</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      <div className="paper-card bg-[#FCF8F1] rounded-3xl p-6 sm:p-7 border border-[#E6D5C1] shadow-xs">
        <h3 className="text-lg font-editorial font-bold text-[#29231F] tracking-tight mb-1">
          Expenditure by Service Category
        </h3>
        <p className="text-xs text-[#483329]/70 mb-5 font-serif">
          Detailed breakdown of costs incurred across event operations
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const amount = categoryTotals[cat] || 0;
            const percentOfTotal = stats.totalSpent > 0 ? Math.round((amount / stats.totalSpent) * 100) : 0;
            return (
              <div key={cat} className="p-4 rounded-2xl bg-[#F7F0E5] border border-[#E6D5C1]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#29231F]">{cat}</span>
                  <span className="text-[11px] font-bold text-[#D98261] font-mono">{percentOfTotal}%</span>
                </div>
                <p className="text-base font-editorial font-bold text-[#29231F] mb-2 tabular-nums">{formatCurrency(amount)}</p>
                <div className="w-full h-1.5 bg-[#E6D5C1]/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D98261] rounded-full"
                    style={{ width: `${percentOfTotal}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expense Ledger Controls: Search, Category Filter, Add Expense */}
      <div className="flex flex-col gap-4 paper-card p-5 sm:p-6 rounded-3xl border border-[#E6D5C1] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative min-w-[220px] flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#B96E42]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search expenses, vendors..."
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

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-[#F7F0E5] border border-[#E6D5C1] rounded-xl text-[#483329] focus:outline-none focus:ring-2 focus:ring-[#D98261]/30 focus:border-[#D98261] transition-colors"
            >
              <option value="ALL">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {activeEventId === 'ALL' && (
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="px-3 py-2 text-xs font-semibold bg-[#F7F0E5] border border-[#E6D5C1] rounded-xl text-[#483329] focus:outline-none focus:ring-2 focus:ring-[#D98261]/30 focus:border-[#D98261] transition-colors max-w-[180px] truncate"
              >
                <option value="ALL">All Associated Events</option>
                {events.map(evt => (
                  <option key={evt.id} value={evt.id}>{evt.name}</option>
                ))}
              </select>
            )}

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

          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#D98261] hover:bg-[#B96E42] active:bg-[#9E5730] rounded-xl transition-all shadow-[0_4px_12px_rgba(217,130,97,0.3)] hover:-translate-y-0.5 self-end sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
        </div>

        {/* Filter Count Result Bar */}
        <div className="flex items-center justify-between text-xs text-[#483329]/70 pt-3 border-t border-[#E6D5C1]">
          <span>
            Showing <strong className="text-[#29231F] font-bold">{displayedExpenses.length}</strong> of{' '}
            <strong className="text-[#29231F] font-bold">{filteredExpenses.length}</strong> expenses
          </span>
          {hasActiveFilters && (
            <span className="text-[#D98261] font-bold">Filters applied</span>
          )}
        </div>
      </div>

      {/* Expense Table */}
      {filteredExpenses.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No expenses recorded yet"
          description="Record your first expense to track budget allocations, vendors, and payment receipts."
          actionLabel="Record Expense"
          onAction={onOpenCreateModal}
        />
      ) : displayedExpenses.length === 0 ? (
        <div className="p-12 text-center bg-[#FCF8F1] rounded-3xl border border-[#E6D5C1]">
          <Wallet className="w-10 h-10 text-[#D98261]/50 mx-auto mb-3" />
          <h4 className="text-lg font-editorial font-bold text-[#29231F]">No matching expenses found</h4>
          <p className="text-xs text-[#483329]/70 max-w-sm mx-auto mt-1 mb-4 font-serif">
            Try adjusting your search criteria or resetting the category filter.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-bold text-[#B96E42] bg-[#D98261]/15 hover:bg-[#D98261]/25 rounded-xl transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="paper-card rounded-3xl border border-[#E6D5C1] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#483329]">
              <thead className="bg-[#F7F0E5] text-[11px] font-bold text-[#B96E42] uppercase tracking-wider border-b border-[#E6D5C1]">
                <tr>
                  <th className="py-3.5 px-4">Expense Description</th>
                  <th className="py-3.5 px-4">Associated Event</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Payee / Vendor</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6D5C1]/60 font-normal">
                {displayedExpenses.map((exp) => {
                  const eventName = events.find(e => e.id === exp.eventId)?.name;

                  return (
                    <tr key={exp.id} className="hover:bg-[#F7F0E5]/60 transition-colors">
                      {/* Name & Notes */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#29231F]">{exp.name}</div>
                        {exp.notes && (
                          <div className="text-xs text-[#483329]/60 mt-0.5 truncate max-w-xs font-serif italic">{exp.notes}</div>
                        )}
                      </td>

                      {/* Associated Event */}
                      <td className="py-3.5 px-4 text-xs">
                        <span className="font-semibold text-[#483329] truncate block max-w-[160px]">
                          {eventName || 'General Event'}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F7F0E5] text-[#483329] border border-[#E6D5C1] font-semibold">
                          {exp.category}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-bold text-[#29231F] whitespace-nowrap font-mono">
                        {formatCurrency(exp.amount)}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-xs whitespace-nowrap font-mono text-[#483329]/80">
                        {exp.date}
                      </td>

                      {/* Vendor */}
                      <td className="py-3.5 px-4 text-xs text-[#29231F] font-semibold">
                        {exp.vendorName}
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                            exp.paymentStatus === 'Paid'
                              ? 'bg-[#A6A77A]/20 text-[#555635] border-[#A6A77A]/60'
                              : exp.paymentStatus === 'Partial'
                              ? 'bg-[#D98261]/20 text-[#B96E42] border-[#D98261]/50'
                              : 'bg-[#E6D5C1]/40 text-[#483329] border-[#E6D5C1]'
                          }`}
                        >
                          {exp.paymentStatus === 'Paid' ? 'Paid in Full' : exp.paymentStatus === 'Partial' ? 'Partial' : 'Pending'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenEditModal(exp)}
                            className="p-1.5 text-[#483329]/60 hover:text-[#D98261] hover:bg-[#F7F0E5] rounded-xl transition-colors"
                            title="Edit Expense"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setExpenseToDelete(exp)}
                            className="p-1.5 text-[#483329]/60 hover:text-[#B96E42] hover:bg-[#D98261]/15 rounded-xl transition-colors"
                            title="Delete Expense"
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={() => {
          if (expenseToDelete) deleteExpense(expenseToDelete.id);
        }}
        title="Delete Expense Voucher"
        message={`Are you sure you want to delete "${expenseToDelete?.name}" (${formatCurrency(expenseToDelete?.amount || 0)})? This will restore the budget allocation.`}
        confirmLabel="Delete Expense"
        isDestructive={true}
      />
    </div>
  );
};
