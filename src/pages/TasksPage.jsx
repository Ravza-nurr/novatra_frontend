import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import Button from '../components/Button';
import KanbanColumn from '../components/KanbanColumn';
import KanbanCard from '../components/KanbanCard';
import TaskList from '../components/TaskList';
import PendingTasks from '../components/PendingTasks';
import RejectedTasks from '../components/RejectedTasks';
import CreateTaskModal from '../modals/CreateTaskModal';

const TasksPage = () => {
  const { projectId } = useParams();
  const { currentUser, getUserById } = useAuth();
  const { getTasksByStatus, updateTask, getPendingTasks, tasks } = useTasks();
  const { getProjectById, getUserRoleInProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const project = getProjectById(projectId);
  const currentUserRole = getUserRoleInProject(projectId, currentUser?.id);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const todoTasks = getTasksByStatus(projectId, 'todo', currentUser?.id, currentUserRole);
  const inProgressTasks = getTasksByStatus(projectId, 'inprogress', currentUser?.id, currentUserRole);
  const doneTasks = getTasksByStatus(projectId, 'done', currentUser?.id, currentUserRole);
  // Only show non-pending, non-rejected tasks in lists
  const allTasks = [...todoTasks, ...inProgressTasks, ...doneTasks];

  // Get pending tasks - only for users to see their own notifications
  const pendingTasks = currentUserRole === 'user'
    ? getPendingTasks(projectId, currentUser?.id)
    : [];



  const handleDragStart = (event) => {
    const { active } = event;
    const task = active.data.current?.task;

    // Check if user can drag this task
    if (currentUserRole === 'user' && task?.assigneeId !== currentUser?.id) {
      return; // Prevent dragging
    }

    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const task = active.data.current?.task;
    let newStatus = over.id;

    // If dropped over another task, get that task's status
    if (over.data.current?.type === 'task') {
      newStatus = over.data.current.task.status;
    }

    // Check if user has permission to move this task
    if (currentUserRole === 'user' && task?.assigneeId !== currentUser?.id) {
      setActiveTask(null);
      return;
    }

    // Validate new status
    const validStatuses = ['todo', 'inprogress', 'done'];
    if (!validStatuses.includes(newStatus)) {
      setActiveTask(null);
      return;
    }

    // Update task status if it changed
    if (task && newStatus && task.status !== newStatus) {
      const user = getUserById(currentUser.id);
      const userName = user ? `${user.firstName} ${user.lastName}` : 'User';
      updateTask(task.id, { status: newStatus }, userName);
    }

    setActiveTask(null);
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Görevler</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {currentUserRole === 'user'
              ? 'Sadece size atanan görevleri görüyorsunuz'
              : 'Tüm görevleri görüntüleyebilir ve yönetebilirsiniz'
            }
          </p>
        </div>
        <Button
          icon={<Plus />}
          onClick={() => setIsModalOpen(true)}
        >
          Yeni Görev
        </Button>
      </div>

      {/* Pending Tasks Section - Only for Users */}
      {pendingTasks.length > 0 && (
        <PendingTasks projectId={projectId} userRole={currentUserRole} />
      )}

      {/* Rejected Tasks Section - Only for Admin */}
      <RejectedTasks projectId={projectId} userRole={currentUserRole} />

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <KanbanColumn
            id="todo"
            title="To Do"
            tasks={todoTasks}
            color="gray"
          />
          <KanbanColumn
            id="inprogress"
            title="In Progress"
            tasks={inProgressTasks}
            color="blue"
          />
          <KanbanColumn
            id="done"
            title="Done"
            tasks={doneTasks}
            color="green"
          />
        </div>

        <DragOverlay className="z-50">
          {activeTask ? <KanbanCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      {/* All Tasks List Section */}
      <div className="mt-12 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Tüm Görevler</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Projedeki tüm görevlerin detaylı listesi
            </p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Toplam: {allTasks.length} görev
          </div>
        </div>
        <div className="rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-6">
          <TaskList tasks={allTasks} />
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
        members={project?.members || {}}
        currentUserRole={currentUserRole}
      />
    </div>
  );
};

export default TasksPage;
