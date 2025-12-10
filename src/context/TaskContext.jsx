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
    const newTask = {
      id: uuidv4(),
      ...taskData,
      status: currentUser.role === 'admin' ? (taskData.status || 'todo') : 'todo',
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
    if (currentUser.role === 'admin' && taskData.assigneeId && taskData.assigneeId !== currentUser.id) {
      if (createNotification) {
        createNotification({
          userId: taskData.assigneeId,
          message: `${currentUser.firstName} sana yeni görev atadı: "${newTask.title}"`,
          taskId: newTask.id,
          type: 'task_assigned'
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

  const value = {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    getProjectTasks,
    getTasksByStatus
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
