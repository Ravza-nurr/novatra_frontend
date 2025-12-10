import { motion } from 'framer-motion';
import Card from './Card';

const AnalyticsWidget = ({ 
  title, 
  value, 
  icon,
  color = 'primary',
  trend = null 
}) => {
  const colorClasses = {
    primary: 'from-primary to-primary-light',
    success: 'from-green-500 to-emerald-500',
    warning: 'from-yellow-500 to-orange-500',
    danger: 'from-red-500 to-pink-500',
    info: 'from-blue-500 to-cyan-500',
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full blur-3xl`}></div>

      <div className="relative z-10">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-4`}>
          <div className="text-white text-xl">{icon}</div>
        </div>

        {/* Value */}
        <motion.div
          className="text-3xl font-bold mb-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {value}
        </motion.div>

        {/* Title */}
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {title}
        </div>

        {/* Trend */}
        {trend && (
          <div className={`text-xs font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </Card>
  );
};

export default AnalyticsWidget;
