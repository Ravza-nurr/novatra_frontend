import { motion } from 'framer-motion';
import Card from './Card';

const AIQuickActionCard = ({
  icon,
  title,
  description,
  onClick
}) => {
  return (
    <Card
      className="cursor-pointer group relative overflow-hidden h-full"
      onClick={onClick}
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mb-4"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <div className="text-white text-2xl">{icon}</div>
        </motion.div>

        {/* Content */}
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      {/* Animated Border */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-primary opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.2 }}
      />
    </Card>
  );
};

export default AIQuickActionCard;
