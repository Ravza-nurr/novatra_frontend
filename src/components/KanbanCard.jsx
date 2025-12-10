import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import Badge from './Badge';
import Avatar from './Avatar';
import { useAuth } from '../hooks/useAuth';

const KanbanCard = ({ task }) => {
  const { currentUser, getUserById } = useAuth();
  const assignee = getUserById(task.assigneeId);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityVariant = {
    'Low': 'low',
    'Medium': 'medium',
    'High': 'high',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        group relative p-4 rounded-lg
        bg-surface-light dark:bg-surface-dark
        border border-border-light dark:border-border-dark
        cursor-grab active:cursor-grabbing
        transition-all duration-200
        hover:shadow-lg hover:shadow-primary/10
        ${isDragging ? 'opacity-50 scale-105 shadow-2xl rotate-2' : ''}
      `}
      whileHover={{ y: -2 }}
      layout
    >
      {/* Drag Handle */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Task Title */}
      <h4 className="font-semibold text-sm mb-2 pr-6">{task.title}</h4>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        {/* Priority Badge */}
        <Badge variant={priorityVariant[task.priority]} size="sm">
          {task.priority}
        </Badge>

        {/* Assignee Avatar */}
        {assignee && (
          <Avatar 
            initials={assignee.avatarInitials} 
            size="sm"
            online={assignee.id === currentUser?.id}
          />
        )}
      </div>
    </motion.div>
  );
};

export default KanbanCard;
