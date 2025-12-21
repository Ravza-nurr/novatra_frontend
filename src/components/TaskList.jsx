import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import Badge from './Badge';
import Avatar from './Avatar';
import { useAuth } from '../hooks/useAuth';

const TaskList = ({ tasks }) => {
  const { getUserById } = useAuth();

  const statusConfig = {
    todo: {
      label: 'To Do',
      icon: Circle,
      color: 'text-gray-500',
      bgColor: 'bg-gray-100 dark:bg-gray-800'
    },
    inprogress: {
      label: 'In Progress',
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    done: {
      label: 'Done',
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900'
    }
  };

  const priorityVariant = {
    'Low': 'low',
    'Medium': 'medium',
    'High': 'high',
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>Henüz görev bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border-light dark:border-border-dark">
            <tr className="text-left">
              <th className="pb-3 pr-4 font-semibold text-sm text-gray-600 dark:text-gray-400">Görev</th>
              <th className="pb-3 px-4 font-semibold text-sm text-gray-600 dark:text-gray-400">Durum</th>
              <th className="pb-3 px-4 font-semibold text-sm text-gray-600 dark:text-gray-400">Öncelik</th>
              <th className="pb-3 pl-4 font-semibold text-sm text-gray-600 dark:text-gray-400">Atanan</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => {
              const assignee = getUserById(task.assigneeId);
              const StatusIcon = statusConfig[task.status]?.icon || Circle;
              
              return (
                <motion.tr
                  key={task.id}
                  className="border-b border-border-light dark:border-border-dark last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <td className="py-4 pr-4">
                    <div>
                      <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                      {task.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-4 h-4 ${statusConfig[task.status]?.color}`} />
                      <span className="text-sm">{statusConfig[task.status]?.label}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={priorityVariant[task.priority]} size="sm">
                      {task.priority}
                    </Badge>
                  </td>
                  <td className="py-4 pl-4">
                    {assignee && (
                      <div className="flex items-center gap-2">
                        <Avatar 
                          initials={assignee.avatarInitials} 
                          size="sm"
                        />
                        <span className="text-sm">
                          {assignee.firstName} {assignee.lastName}
                        </span>
                      </div>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {tasks.map((task, index) => {
          const assignee = getUserById(task.assigneeId);
          const StatusIcon = statusConfig[task.status]?.icon || Circle;
          
          return (
            <motion.div
              key={task.id}
              className="p-4 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <div className="space-y-3">
                {/* Title & Description */}
                <div>
                  <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                  {task.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Status & Priority */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`w-4 h-4 ${statusConfig[task.status]?.color}`} />
                    <span className="text-xs">{statusConfig[task.status]?.label}</span>
                  </div>
                  <Badge variant={priorityVariant[task.priority]} size="sm">
                    {task.priority}
                  </Badge>
                </div>

                {/* Assignee */}
                {assignee && (
                  <div className="flex items-center gap-2 pt-2 border-t border-border-light dark:border-border-dark">
                    <Avatar 
                      initials={assignee.avatarInitials} 
                      size="sm"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {assignee.firstName} {assignee.lastName}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskList;
