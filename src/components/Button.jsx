import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button', 
  disabled = false,
  fullWidth = false,
  icon = null,
  className = ''
}) => {
  const baseClasses = 'btn relative px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-lg hover:shadow-primary/50',
    secondary: 'bg-surface-light dark:bg-surface-dark border-2 border-border-light dark:border-border-dark hover:border-primary',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/50',
    ghost: 'bg-transparent hover:bg-surface-light dark:hover:bg-surface-dark'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;
