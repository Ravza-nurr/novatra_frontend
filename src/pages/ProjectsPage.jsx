import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FolderKanban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import Button from '../components/Button';
import Card from '../components/Card';
import CreateProjectModal from '../modals/CreateProjectModal';

const ProjectsPage = () => {
  const { currentUser } = useAuth();
  const { getUserProjects } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const userProjects = currentUser ? getUserProjects(currentUser.id) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projeler</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tüm projelerinizi görüntüleyin ve yönetin
          </p>
        </div>
        <Button 
          icon={<Plus />}
          onClick={() => setIsModalOpen(true)}
        >
          Yeni Proje
        </Button>
      </div>

      {/* Projects Grid */}
      {userProjects.length === 0 ? (
        <Card className="text-center py-16">
          <FolderKanban className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
          <h3 className="text-xl font-semibold mb-2">Henüz proje yok</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            İlk projenizi oluşturarak başlayın
          </p>
          <Button 
            icon={<Plus />}
            onClick={() => setIsModalOpen(true)}
          >
            İlk Projeyi Oluştur
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                onClick={() => navigate(`/project/${project.id}`)}
                gradient
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                    <FolderKanban className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(project.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>

                <h3 className="font-bold text-xl mb-2">{project.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{project.members ? Object.keys(project.members).length : 0} Üye</span>
                  <span>•</span>
                  <span>{project.tasks.length} Görev</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProjectsPage;
