import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useContext } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { NotificationContext } from '../context/NotificationContext';
import Button from './Button';
import Badge from './Badge';
import toast from 'react-hot-toast';
import RejectTaskModal from '../modals/RejectTaskModal';

const PendingTasks = ({ projectId, userRole }) => {
    const { getPendingTasks, acceptTask, rejectTask, tasks, getTaskById } = useTasks();
    const { currentUser, getUserById } = useAuth();
    const { notifications, updateNotification, deleteNotification } = useContext(NotificationContext);
    const [isExpanded, setIsExpanded] = useState(true);

    // Rejection Modal State
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [taskToReject, setTaskToReject] = useState(null);

    // Get pending tasks based on user role
    const pendingTasks = userRole === 'admin'
        ? tasks.filter(t => t.projectId === projectId && t.status === 'pending') // Admin sees all
        : getPendingTasks(projectId, currentUser?.id); // User sees only their own

    if (pendingTasks.length === 0) {
        return null;
    }

    const getAssigneeName = (assigneeId) => {
        const user = getUserById(assigneeId);
        return user ? `${user.firstName} ${user.lastName}` : 'Bilinmeyen';
    };

    const handleAccept = (taskId) => {
        const task = getTaskById(taskId);
        const success = acceptTask(taskId);

        if (success) {
            toast.success('Görev To Do listene eklendi');

            // Update corresponding notification if exists
            const relatedNotification = notifications.find(
                n => n.type === 'task_assigned' && n.payload?.taskId === taskId
            );

            if (relatedNotification) {
                updateNotification(relatedNotification.id, {
                    message: `Görev kabul edildi: "${task.title}"`,
                    type: 'info',
                    payload: null,
                    read: true
                });
            }
        } else {
            toast.error('Görev kabul edilemedi');
        }
    };

    const handleRejectClick = (task) => {
        setTaskToReject(task);
        setIsRejectModalOpen(true);
    };

    const handleRejectConfirm = async (reason) => {
        if (!taskToReject) return;

        const success = rejectTask(taskToReject.id, reason || 'Kullanıcı tarafından reddedildi');

        if (success) {
            toast.error('Görev reddedildi');

            // Update corresponding notification if exists (instead of deleting)
            const relatedNotification = notifications.find(
                n => n.type === 'task_assigned' && n.payload?.taskId === taskToReject.id
            );

            if (relatedNotification) {
                updateNotification(relatedNotification.id, {
                    message: `Görev reddedildi: "${taskToReject.title}"`,
                    type: 'error', // Use error type for rejection
                    payload: null,
                    read: true
                });
            }
        } else {
            toast.error('Görev reddedilemedi');
        }

        setTaskToReject(null);
    };

    const priorityVariant = {
        'Low': 'low',
        'Medium': 'medium',
        'High': 'high',
    };

    return (
        <div className="rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 p-4">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between mb-3"
            >
                <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">
                        {userRole === 'admin' ? 'Bekleyen Tüm Görevler' : 'Onay Bekleyen Görevler'}
                    </h3>
                    <Badge variant="warning" size="sm">
                        {pendingTasks.length}
                    </Badge>
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {pendingTasks.map((task) => (
                            <motion.div
                                key={task.id}
                                className="p-4 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-semibold text-sm">{task.title}</h4>
                                            <Badge variant={priorityVariant[task.priority]} size="sm">
                                                {task.priority}
                                            </Badge>
                                        </div>
                                        {userRole === 'admin' && task.assigneeId !== currentUser?.id && (
                                            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                                                👤 Atanan: {getAssigneeName(task.assigneeId)}
                                            </p>
                                        )}
                                        {task.description && (
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                                {task.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-3">
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => handleAccept(task.id)}
                                    >
                                        Kabul Et
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleRejectClick(task)}
                                    >
                                        Reddet
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <RejectTaskModal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                onReject={handleRejectConfirm}
                taskTitle={taskToReject?.title || ''}
            />
        </div>
    );
};

export default PendingTasks;
