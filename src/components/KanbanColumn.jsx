import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import KanbanCard from './KanbanCard';
import { Plus } from 'lucide-react';

const KanbanColumn = ({
  id,
  title,
  tasks,
  onAddTask,
  color = 'gray'
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const colorClasses = {
    gray: 'border-gray-300 dark:border-gray-700',
    blue: 'border-blue-400 dark:border-blue-600',
    yellow: 'border-yellow-400 dark:border-yellow-600',
    green: 'border-green-400 dark:border-green-600',
  };

  return (
    <motion.div
      ref={setNodeRef}
      className={`
        flex flex-col h-full min-w-[320px] rounded-xl
        bg-gray-50 dark:bg-gray-900
        border-2 ${isOver ? 'border-primary' : colorClasses[color]}
        transition-all duration-200
        relative z-20
        ${isOver ? 'shadow-lg shadow-primary/20 scale-[1.02]' : ''}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-border-light dark:border-border-dark">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full bg-${color}-500`}></div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {tasks.length}
            </span>
          </div>
          {onAddTask && (
            <button
              onClick={onAddTask}
              className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="text-center text-gray-400 dark:text-gray-600 py-8">
              <p className="text-sm">Görev bulunmuyor</p>
            </div>
          ) : (
            tasks.map((task) => (
              <KanbanCard key={task.id} task={task} />
            ))
          )}
        </SortableContext>
      </div>
    </motion.div>
  );
};

export default KanbanColumn;
