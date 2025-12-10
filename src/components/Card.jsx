import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  gradient = false,
  onClick = null
}) => {
  const baseClasses = `
    rounded-xl p-6
    bg-surface-light dark:bg-surface-dark
    border border-border-light dark:border-border-dark
    transition-all duration-300
  `;

  const hoverClasses = hover ? 'hover-glow cursor-pointer' : '';
  const gradientClasses = gradient ? 'card-gradient-border' : '';

  return (
    <motion.div
      className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4 } : {}}
    >
      {children}
    </motion.div>
  );
};

export default Card;
