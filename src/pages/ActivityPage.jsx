import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Clock } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import { formatDistanceToNow } from '../utils/dateUtils';

const ActivityPage = () => {
  const { projectId } = useParams();
  const { getProjectById } = useProjects();
  const { getUserById } = useAuth();
  
  const project = getProjectById(projectId);
  const activities = project?.activity || [];

  // Sort activities by timestamp (newest first)
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Aktivite Geçmişi</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Proje aktivitelerini görüntüleyin
        </p>
      </div>

      {/* Activity Feed */}
      {sortedActivities.length === 0 ? (
        <Card className="text-center py-16">
          <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
          <h3 className="text-xl font-semibold mb-2">Henüz aktivite yok</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Proje aktiviteleri burada görünecek
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedActivities.map((activity, index) => {
            const user = getUserById(activity.userId);
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="flex items-start gap-4">
                  {/* User Avatar */}
                  {user && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {user.avatarInitials}
                    </div>
                  )}

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {activity.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatDistanceToNow(activity.timestamp)}</span>
                    </div>
                  </div>

                  {/* Activity Icon */}
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-primary" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityPage;
