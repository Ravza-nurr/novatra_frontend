import { motion } from 'framer-motion';

const ChatBubble = ({ 
  message, 
  user, 
  isCurrentUser,
  timestamp 
}) => {
  return (
    <motion.div
      className={`flex items-end gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
      initial={{ opacity: 0, y: 10, x: isCurrentUser ? 20 : -20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Avatar - only show for others */}
      {!isCurrentUser && user && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
          {user.avatarInitials}
        </div>
      )}

      {/* Message Bubble */}
      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
        {!isCurrentUser && user && (
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-3">
            {user.firstName} {user.lastName}
          </span>
        )}
        
        <div
          className={`
            px-4 py-3 rounded-2xl
            ${isCurrentUser 
              ? 'bg-gradient-to-r from-primary to-primary-light text-white rounded-br-sm' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm'
            }
          `}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message}</p>
        </div>

        <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 px-3">
          {new Date(timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
