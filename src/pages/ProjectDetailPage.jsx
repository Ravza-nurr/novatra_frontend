import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { Calendar, Users, Activity } from 'lucide-react';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const { getProjectById } = useProjects();
  const { tasks } = useTasks();
  const { getUserById } = useAuth();
  const project = getProjectById(projectId);

  if (!project) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400">Proje bulunamadı</p>
      </div>
    );
  }

  // Get members array from members object
  const memberIds = project.members ? Object.keys(project.members) : [];
  const members = memberIds.map(id => {
    const user = getUserById(id);
    if (!user) return null;
    return {
      ...user,
      projectRole: project.members[id]
    };
  }).filter(Boolean);

  // Calculate difficulty stats per user
  const getUserDifficultyStats = (userId) => {
    const userTasks = tasks.filter(t => t.projectId === projectId && t.assigneeId === userId);

    if (userTasks.length === 0) return null;

    const difficultyMap = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
    const totalScore = userTasks.reduce((acc, task) => acc + (difficultyMap[task.difficulty] || 2), 0);
    const average = totalScore / userTasks.length;
    const percentage = (average / 3) * 100;

    let color = 'bg-amber-500';
    let textColor = 'text-amber-500';

    if (average < 1.6) {
      color = 'bg-emerald-500';
      textColor = 'text-emerald-500';
    } else if (average >= 2.4) {
      color = 'bg-rose-500';
      textColor = 'text-rose-500';
    }

    return { average, percentage, color, textColor, taskCount: userTasks.length };
  };

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <Card>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {project.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Oluşturulma</p>
              <p className="font-semibold">
                {new Date(project.createdAt).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Üye Sayısı</p>
              <p className="font-semibold">{memberIds.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Görev</p>
              <p className="font-semibold">{project.tasks.length}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Team Workload */}
      <Card>
        <div className="mb-6">
          <h2 className="text-xl font-bold">Takım İş Yükü</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Proje üyeleri ve üzerlerindeki görev zorluk dağılımı
          </p>
        </div>

        <div className="space-y-6">
          {members.map(member => {
            const stats = getUserDifficultyStats(member.id);

            return (
              <div key={member.id} className="flex items-center gap-4">
                {/* User Info */}
                <div className="flex items-center gap-3 w-48 shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-semibold">
                    {member.avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {member.firstName} {member.lastName}
                    </p>
                    <Badge variant={member.projectRole === 'admin' ? 'admin' : 'user'} size="sm">
                      {member.projectRole}
                    </Badge>
                  </div>
                </div>

                {/* Difficulty Bar */}
                <div className="flex-1">
                  {stats ? (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500 dark:text-gray-400">
                          {stats.taskCount} Görev
                        </span>
                        <span className={`font-medium ${stats.textColor}`}>
                          {stats.average.toFixed(1)} / 3.0
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${stats.color}`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center">
                      <span className="text-xs text-gray-400 italic">
                        Henüz görev atanmamış
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default ProjectDetailPage;
