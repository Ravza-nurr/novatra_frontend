import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, XCircle, Check } from 'lucide-react';
import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import Badge from './Badge';
import Button from './Button';
import toast from 'react-hot-toast';

const RejectedTasks = ({ projectId, userRole }) => {
    const { tasks, acknowledgeRejectedTask } = useTasks();
    const { getUserById } = useAuth();
    const [isExpanded, setIsExpanded] = useState(false);

    // Get rejected tasks that haven't been acknowledged
    const rejectedTasks = userRole === 'admin'
        ? tasks.filter(t => t.projectId === projectId && t.status === 'rejected' && !t.acknowledged)
        : []; // Users don't see rejected tasks

    if (rejectedTasks.length === 0 || userRole !== 'admin') {
        return null;
    }

    const handleAcknowledge = (taskId) => {
        acknowledgeRejectedTask(taskId);
        toast.success('Görev anlaşıldı olarak işaretlendi');
    };

    const getAssigneeName = (assigneeId) => {
        const user = getUserById(assigneeId);
        return user ? `${user.firstName} ${user.lastName}` : 'Bilinmeyen';
    };

    const getRejectedByName = (rejectedById) => {
        const user = getUserById(rejectedById);
        return user ? `${user.firstName} ${user.lastName}` : 'Bilinmeyen';
    };

    const priorityVariant = {
        'Low': 'low',
        'Medium': 'medium',
        'High': 'high',
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-600 p-4">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between mb-3"
            >
                <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <h3 className="font-semibold text-lg">Reddedilen Görevler</h3>
                    <Badge variant="danger" size="sm">
                        {rejectedTasks.length}
                    </Badge>
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {isExpanded && (
                <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {rejectedTasks.map((task, index) => (
                        <motion.div
                            key={task.id}
                            className="p-4 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-sm">{task.title}</h4>
                                        <Badge variant={priorityVariant[task.priority]} size="sm">
                                            {task.priority}
                                        </Badge>
                                    </div>
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => handleAcknowledge(task.id)}
                                    >
                                        <Check className="w-4 h-4 mr-1" />
                                        Anlaşıldı
                                    </Button>
                                </div>

                                {task.description && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {task.description}
                                    </p>
                                )}

                                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border-light dark:border-border-dark">
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">Atanan:</span>
                                        <span className="ml-1 font-medium">{getAssigneeName(task.assigneeId)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">Reddeden:</span>
                                        <span className="ml-1 font-medium text-red-600 dark:text-red-400">
                                            {getRejectedByName(task.rejectedBy)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">Tarih:</span>
                                        <span className="ml-1">{formatDate(task.rejectedAt)}</span>
                                    </div>
                                    {task.rejectionReason && (
                                        <div className="col-span-2">
                                            <span className="text-gray-500 dark:text-gray-400">Neden:</span>
                                            <p className="ml-1 italic text-red-700 dark:text-red-300">
                                                "{task.rejectionReason}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default RejectedTasks;
