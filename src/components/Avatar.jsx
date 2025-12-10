import { motion } from 'framer-motion';

const Avatar = ({ 
  initials, 
  size = 'md', 
  online = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className={`
          ${sizeClasses[size]}
          rounded-full
          bg-gradient-to-br from-primary to-primary-light
          flex items-center justify-center
          text-white font-semibold
          shadow-lg
        `}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {initials}
      </motion.div>
      
      {online && (
        <motion.div
          className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface-light dark:border-surface-dark"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        />
      )}
    </div>
  );
};

export default Avatar;
