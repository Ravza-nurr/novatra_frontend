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
import CreateTaskModal from '../modals/CreateTaskModal';

const TasksPage = () => {
  const { projectId } = useParams();
  const { currentUser, getUserById } = useAuth();
  const { getTasksByStatus, updateTask } = useTasks();
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
