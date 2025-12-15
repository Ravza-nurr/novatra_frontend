import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import AnalyticsWidget from '../components/AnalyticsWidget';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { getUserProjects } = useProjects();
  const { tasks } = useTasks();
  const navigate = useNavigate();

  const userProjects = currentUser ? getUserProjects(currentUser.id) : [];
  const userTasks = tasks.filter(t =>
    userProjects.some(p => p.id === t.projectId)
  );

  const totalTasks = userTasks.length;
  const completedTasks = userTasks.filter(t => t.status === 'done').length;
  const inProgressTasks = userTasks.filter(t => t.status === 'inprogress').length;
  const todoTasks = userTasks.filter(t => t.status === 'todo').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">
          Hoş Geldiniz, {currentUser?.firstName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          İşte projelerinizin genel durumu
        </p>
      </motion.div>

      {/* Analytics Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsWidget
          title="Toplam Görevler"
          value={totalTasks}
          icon={<ListTodo />}
          color="primary"
        />
        <AnalyticsWidget
          title="Tamamlanan"
          value={completedTasks}
          icon={<CheckCircle2 />}
          color="success"
        />
        <AnalyticsWidget
          title="Devam Eden"
          value={inProgressTasks}
          icon={<Clock />}
          color="warning"
        />
        <AnalyticsWidget
          title="Bekleyen"
          value={todoTasks}
          icon={<TrendingUp />}
          color="info"
        />
      </div>

      {/* Projects List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Projelerim</h2>

        {userProjects.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Henüz bir projeniz yok
              </p>
              <button
                onClick={() => navigate('/projects')}
                className="text-primary hover:underline font-medium"
              >
                Proje Oluştur
              </button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProjects.map((project, index) => {
              const projectTasks = tasks.filter(t => t.projectId === project.id);
              const completed = projectTasks.filter(t => t.status === 'done').length;
              const total = projectTasks.length;
              const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="cursor-pointer"
                  >
                    <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">İlerleme</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-primary-light"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <ListTodo className="w-4 h-4" />
                        <span>{projectTasks.length}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{completed}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
