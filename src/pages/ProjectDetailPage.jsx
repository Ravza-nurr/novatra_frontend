import { useParams } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { Calendar, Users, Activity } from 'lucide-react';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const { getProjectById } = useProjects();
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

      {/* Members */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Proje Üyeleri</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {members.map(member => (
            <div 
              key={member.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-semibold">
                {member.avatarInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {member.firstName} {member.lastName}
                </p>
                <Badge variant={member.projectRole === 'admin' ? 'admin' : 'user'} size="sm">
                  {member.projectRole}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProjectDetailPage;
