import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  ListTodo, 
  Calendar, 
  Edit2, 
  Trash2, 
  Kanban, 
  List, 
  RotateCcw,
  X,
  Layers
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { Task, TaskStatus } from '../types';
import { TaskPriorityBadge } from '../components/common/Badge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';

interface TimelinePageProps {
  onOpenCreateModal: () => void;
  onOpenEditModal: (task: Task) => void;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({
  onOpenCreateModal,
  onOpenEditModal,
}) => {
  const { 
    filteredTasks, 
    deleteTask, 
    updateTaskStatus, 
    events, 
    globalSearch,
    activeEventId,
    activeEvent,
    setActiveEventId 
  } = useEventContext();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedEventId, setSelectedEventId] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const searchQuery = (localSearch || globalSearch).toLowerCase().trim();

  // Filtered Tasks
  const displayedTasks = useMemo(() => {
    return filteredTasks.filter((t) => {
      const matchesSearch = 
        !searchQuery ||
        t.name.toLowerCase().includes(searchQuery) ||
        t.description.toLowerCase().includes(searchQuery) ||
        (t.assignedTo && t.assignedTo.toLowerCase().includes(searchQuery));

      const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
      const matchesPriority = selectedPriority === 'ALL' || t.priority === selectedPriority;
      const matchesEvent = activeEventId !== 'ALL' || selectedEventId === 'ALL' || t.eventId === selectedEventId;

      return matchesSearch && matchesStatus && matchesPriority && matchesEvent;
    });
  }, [filteredTasks, searchQuery, selectedStatus, selectedPriority, selectedEventId, activeEventId]);

  const hasActiveFilters = searchQuery !== '' || selectedStatus !== 'ALL' || selectedPriority !== 'ALL' || (activeEventId === 'ALL' && selectedEventId !== 'ALL');

  const handleResetFilters = () => {
    setLocalSearch('');
    setSelectedStatus('ALL');
    setSelectedPriority('ALL');
    setSelectedEventId('ALL');
  };

  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = filteredTasks.filter(t => t.status === 'In Progress').length;
  const todoTasks = filteredTasks.filter(t => t.status === 'To Do').length;
  const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Kanban groups with warm tones
  const kanbanColumns: { status: TaskStatus; title: string; color: string; badgeColor: string }[] = [
    { status: 'To Do', title: 'To Do (Pending)', color: 'border-[#E6D5C1] bg-[#F7F0E5]/70', badgeColor: 'bg-[#FCF8F1] text-[#483329] border border-[#E6D5C1]' },
    { status: 'In Progress', title: 'In Progress', color: 'border-[#D98261]/40 bg-[#D98261]/10', badgeColor: 'bg-[#D98261] text-white' },
    { status: 'Completed', title: 'Completed', color: 'border-[#A6A77A]/50 bg-[#A6A77A]/15', badgeColor: 'bg-[#A6A77A] text-white' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Scope banner if focused on single event */}
      {activeEvent && (
        <div className="p-3.5 px-5 rounded-2xl bg-[#FCF8F1] border border-[#D98261]/40 flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D98261] shrink-0" />
            <span className="text-[#483329]">
              Showing timeline tasks for: <strong className="text-[#29231F] font-bold">{activeEvent.name}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveEventId('ALL')}
            className="font-bold text-[#D98261] hover:text-[#B96E42] underline"
          >
            Show All Events Tasks
          </button>
        </div>
      )}

      {/* Top Progress Bar Card */}
      <div className="paper-card rounded-3xl p-6 sm:p-7 border border-[#E6D5C1] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div>
            <h3 className="text-lg font-editorial font-bold text-[#29231F] tracking-tight">Timeline Milestone Progress</h3>
            <p className="text-xs text-[#483329]/70 mt-0.5 font-medium">
              Completed Tasks: <span className="font-bold text-[#D98261]">{completedTasks}</span> of {totalTasks} ({completionPercent}%)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-[#F7F0E5] text-[#483329] border border-[#E6D5C1] font-semibold">
              {todoTasks} To Do
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-[#D98261]/15 text-[#B96E42] border border-[#D98261]/30 font-semibold">
              {inProgressTasks} In Progress
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-[#A6A77A]/20 text-[#555635] border border-[#A6A77A]/40 font-semibold">
              {completedTasks} Done
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-3 bg-[#E6D5C1]/50 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-[#A6A77A] rounded-full transition-all duration-300"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Control Bar: Search, Filters, View Mode Toggle, Add Task */}
      <div className="flex flex-col gap-4 paper-card p-5 sm:p-6 rounded-3xl border border-[#E6D5C1] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative min-w-[220px] flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#B96E42]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search tasks, descriptions..."
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
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-[#F7F0E5] border border-[#E6D5C1] rounded-xl text-[#483329] focus:outline-none focus:ring-2 focus:ring-[#D98261]/30 focus:border-[#D98261] transition-colors"
            >
              <option value="ALL">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-[#F7F0E5] border border-[#E6D5C1] rounded-xl text-[#483329] focus:outline-none focus:ring-2 focus:ring-[#D98261]/30 focus:border-[#D98261] transition-colors"
            >
              <option value="ALL">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
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

          {/* View Toggle & Add Button */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <div className="flex items-center p-1 bg-[#F7F0E5] rounded-xl border border-[#E6D5C1]">
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'kanban' ? 'bg-[#FCF8F1] text-[#D98261] shadow-xs' : 'text-[#483329]/60 hover:text-[#29231F]'
                }`}
                title="Kanban Board View"
              >
                <Kanban className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'list' ? 'bg-[#FCF8F1] text-[#D98261] shadow-xs' : 'text-[#483329]/60 hover:text-[#29231F]'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#D98261] hover:bg-[#B96E42] active:bg-[#9E5730] rounded-xl transition-all shadow-[0_4px_12px_rgba(217,130,97,0.3)] hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Result Count Bar */}
        <div className="flex items-center justify-between text-xs text-[#483329]/70 pt-3 border-t border-[#E6D5C1]">
          <span>
            Showing <strong className="text-[#29231F] font-bold">{displayedTasks.length}</strong> of{' '}
            <strong className="text-[#29231F] font-bold">{totalTasks}</strong> tasks
          </span>
          {hasActiveFilters && (
            <span className="text-[#D98261] font-bold">Filters applied</span>
          )}
        </div>
      </div>

      {/* Main Task View */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No tasks created yet"
          description="Add milestones, catering tastings, floral mockups, and venue rehearsals to stay on schedule."
          actionLabel="Add Task"
          onAction={onOpenCreateModal}
        />
      ) : displayedTasks.length === 0 ? (
        <div className="p-12 text-center bg-[#FCF8F1] rounded-3xl border border-[#E6D5C1]">
          <ListTodo className="w-10 h-10 text-[#D98261]/50 mx-auto mb-3" />
          <h4 className="text-lg font-editorial font-bold text-[#29231F]">No matching tasks found</h4>
          <p className="text-xs text-[#483329]/70 max-w-sm mx-auto mt-1 mb-4 font-serif">
            Try adjusting your search criteria or resetting filters.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-bold text-[#B96E42] bg-[#D98261]/15 hover:bg-[#D98261]/25 rounded-xl transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'kanban' ? (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {kanbanColumns.map(col => {
            const colTasks = displayedTasks.filter(t => t.status === col.status);

            return (
              <div
                key={col.status}
                className={`rounded-3xl p-4 sm:p-5 border flex flex-col min-h-[480px] ${col.color}`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E6D5C1]">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-editorial font-bold text-[#29231F]">{col.title}</h4>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${col.badgeColor}`}>
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#483329]/60 font-serif italic">
                      No tasks in this column
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const eventName = events.find(e => e.id === task.eventId)?.name;

                      return (
                        <div
                          key={task.id}
                          className="paper-card bg-[#FCF8F1] rounded-2xl p-4 border border-[#E6D5C1] shadow-xs hover:border-[#D98261] hover:shadow-md transition-all group"
                        >
                          {/* Priority & Due Date */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <TaskPriorityBadge priority={task.priority} />
                            <span className="text-[11px] text-[#483329]/70 font-mono flex items-center gap-1 font-semibold">
                              <Calendar className="w-3 h-3 text-[#B96E42]" />
                              {task.dueDate}
                            </span>
                          </div>

                          {/* Task Name */}
                          <h5 className="text-sm font-editorial font-bold text-[#29231F] group-hover:text-[#D98261] transition-colors">
                            {task.name}
                          </h5>

                          {/* Description */}
                          {task.description && (
                            <p className="text-xs text-[#483329]/75 mt-1 line-clamp-2 leading-relaxed font-serif">
                              {task.description}
                            </p>
                          )}

                          {/* Assignee & Event */}
                          <div className="mt-3 pt-2.5 border-t border-[#E6D5C1]/70 flex items-center justify-between text-xs text-[#483329]">
                            <span className="truncate max-w-[120px] text-[11px] text-[#483329]/70 font-medium">
                              {task.assignedTo ? `👤 ${task.assignedTo}` : 'Unassigned'}
                            </span>

                            {/* Quick Status Shift Buttons */}
                            <div className="flex items-center gap-1">
                              {col.status !== 'To Do' && (
                                <button
                                  type="button"
                                  onClick={() => updateTaskStatus(task.id, 'To Do')}
                                  className="text-[10px] px-2 py-0.5 rounded-lg bg-[#F7F0E5] hover:bg-[#E6D5C1] text-[#483329] font-bold"
                                  title="Move to To Do"
                                >
                                  ← To Do
                                </button>
                              )}
                              {col.status !== 'In Progress' && (
                                <button
                                  type="button"
                                  onClick={() => updateTaskStatus(task.id, 'In Progress')}
                                  className="text-[10px] px-2 py-0.5 rounded-lg bg-[#D98261]/15 hover:bg-[#D98261]/25 text-[#B96E42] font-bold"
                                  title="Move to In Progress"
                                >
                                  In Progress
                                </button>
                              )}
                              {col.status !== 'Completed' && (
                                <button
                                  type="button"
                                  onClick={() => updateTaskStatus(task.id, 'Completed')}
                                  className="text-[10px] px-2 py-0.5 rounded-lg bg-[#A6A77A]/20 hover:bg-[#A6A77A]/35 text-[#555635] font-bold"
                                  title="Mark Done"
                                >
                                  ✓ Done
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Edit / Delete Footer */}
                          <div className="mt-2 pt-2 border-t border-[#E6D5C1]/60 flex items-center justify-between text-xs">
                            <span className="text-[10px] text-[#483329]/70 font-semibold truncate max-w-[140px]">
                              {eventName}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => onOpenEditModal(task)}
                                className="p-1 text-[#483329]/60 hover:text-[#D98261] rounded transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setTaskToDelete(task)}
                                className="p-1 text-[#483329]/60 hover:text-[#B96E42] rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="paper-card rounded-3xl border border-[#E6D5C1] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#483329]">
              <thead className="bg-[#F7F0E5] text-[11px] font-bold text-[#B96E42] uppercase tracking-wider border-b border-[#E6D5C1]">
                <tr>
                  <th className="py-3.5 px-4">Task Name</th>
                  <th className="py-3.5 px-4">Associated Event</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Assigned To</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6D5C1]/60 font-normal">
                {displayedTasks.map((task) => {
                  const eventName = events.find(e => e.id === task.eventId)?.name;

                  return (
                    <tr key={task.id} className="hover:bg-[#F7F0E5]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#29231F]">{task.name}</div>
                        {task.description && (
                          <div className="text-xs text-[#483329]/60 truncate max-w-sm mt-0.5 font-serif italic">{task.description}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-[#483329]">
                        {eventName || 'General Event'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs font-mono text-[#29231F]">
                        {task.dueDate}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <TaskPriorityBadge priority={task.priority} />
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#483329]">
                        {task.assignedTo || <span className="text-[#483329]/50 font-serif italic">Unassigned</span>}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                          className={`text-xs font-bold py-1 px-3 rounded-full border cursor-pointer focus:outline-none transition-colors shadow-2xs ${
                            task.status === 'Completed'
                              ? 'bg-[#A6A77A]/20 text-[#555635] border-[#A6A77A]/60'
                              : task.status === 'In Progress'
                              ? 'bg-[#D98261]/20 text-[#B96E42] border-[#D98261]/50'
                              : 'bg-[#E6D5C1]/40 text-[#483329] border-[#E6D5C1]'
                          }`}
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenEditModal(task)}
                            className="p-1.5 text-[#483329]/60 hover:text-[#D98261] hover:bg-[#F7F0E5] rounded-xl transition-colors"
                            title="Edit Task"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setTaskToDelete(task)}
                            className="p-1.5 text-[#483329]/60 hover:text-[#B96E42] hover:bg-[#D98261]/15 rounded-xl transition-colors"
                            title="Delete Task"
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
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) deleteTask(taskToDelete.id);
        }}
        title="Delete Planning Task"
        message={`Are you sure you want to remove task "${taskToDelete?.name}"?`}
        confirmLabel="Delete Task"
        isDestructive={true}
      />
    </div>
  );
};
