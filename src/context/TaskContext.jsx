import { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from './AuthContext';
import { ProjectContext } from './ProjectContext';
import { NotificationContext } from './NotificationContext';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { addActivity } = useContext(ProjectContext);
  const { createNotification } = useContext(NotificationContext);

  // Load tasks from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem('novatra_tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('novatra_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const createTask = (taskData) => {
    // If admin assigns task to another user, set status to 'pending'
    const isAdminAssigning = currentUser.role === 'admin' && taskData.assigneeId && taskData.assigneeId !== currentUser.id;

    const newTask = {
      id: uuidv4(),
      ...taskData,
      status: isAdminAssigning ? 'pending' : (taskData.status || 'todo'),
      assigneeId: currentUser.role === 'admin' ? taskData.assigneeId : currentUser.id,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id
    };

    setTasks([...tasks, newTask]);

    // Add activity log
    if (addActivity) {
      addActivity(taskData.projectId, {
        userId: currentUser.id,
        message: `"${newTask.title}" görevi oluşturuldu`
      });
    }

    // Send notification if admin assigned task to another user
    if (isAdminAssigning) {
      if (createNotification) {
        createNotification({
          userId: taskData.assigneeId,
          message: `${currentUser.firstName} sana yeni görev atadı: "${newTask.title}"`,
          type: 'task_assigned',
          payload: { taskId: newTask.id }
        });
      }
    }

    return newTask;
  };

  const updateTask = (taskId, updates, userName) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, ...updates } : t
    ));

    // Add activity if status changed
    if (updates.status && updates.status !== task.status && addActivity) {
      const statusMap = {
        'todo': 'To Do',
        'inprogress': 'In Progress',
        'done': 'Done'
      };

      const displayName = userName || `${currentUser.firstName} ${currentUser.lastName}`;
      addActivity(task.projectId, {
        userId: currentUser.id,
        message: `${displayName} "${task.title}" görevini ${statusMap[updates.status]} kolonuna taşıdı`
      });
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const getTaskById = (taskId) => {
    return tasks.find(t => t.id === taskId);
  };

  const getProjectTasks = (projectId, userId, userRole) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);

    // If user role is 'user', only show tasks assigned to them
    if (userRole === 'user') {
      return projectTasks.filter(t => t.assigneeId === userId);
    }

    // Admin sees all tasks
    return projectTasks;
  };

  const getTasksByStatus = (projectId, status, userId, userRole) => {
    const projectTasks = getProjectTasks(projectId, userId, userRole);
    return projectTasks.filter(t => t.status === status);
  };

  const getPendingTasks = (projectId, userId) => {
    return tasks.filter(t => t.projectId === projectId && t.assigneeId === userId && t.status === 'pending');
  };

  const acceptTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status !== 'pending') return false;

    // Update task to todo status
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, status: 'todo', acceptedAt: new Date().toISOString() } : t
    ));

    // Add activity log
    if (addActivity) {
      addActivity(task.projectId, {
        userId: currentUser.id,
        message: `"${task.title}" görevi kabul edildi`
      });
    }

    return true;
  };

  const rejectTask = (taskId, reason = '') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status !== 'pending') return false;

    // Update task to rejected status
    setTasks(tasks.map(t =>
      t.id === taskId ? {
        ...t,
        status: 'rejected',
        rejectedBy: currentUser.id,
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason
      } : t
    ));

    // Add activity log
    if (addActivity) {
      const reasonText = reason ? ` (Neden: ${reason})` : '';
      addActivity(task.projectId, {
        userId: currentUser.id,
        message: `"${task.title}" görevi reddedildi${reasonText}`
      });
    }

    return true;
  };

  const acknowledgeRejectedTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status !== 'rejected') return false;

    // Mark task as acknowledged
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, acknowledged: true, acknowledgedAt: new Date().toISOString() } : t
    ));

    return true;
  };

  const value = {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    getProjectTasks,
    getTasksByStatus,
    getPendingTasks,
    acceptTask,
    rejectTask,
    acknowledgeRejectedTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
