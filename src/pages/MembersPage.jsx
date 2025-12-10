import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserPlus, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Avatar from '../components/Avatar';
import InviteMemberModal from '../modals/InviteMemberModal';

const MembersPage = () => {
  const { projectId } = useParams();
  const { currentUser, getUserById } = useAuth();
  const { getProjectById, getUserRoleInProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const project = getProjectById(projectId);
  
  // Get members array from members object
  const memberIds = project?.members ? Object.keys(project.members) : [];
  const members = memberIds.map(id => {
    const user = getUserById(id);
    if (!user) return null;
    return {
      ...user,
      projectRole: project.members[id] // Add project-specific role
    };
  }).filter(Boolean);

  const currentUserRole = getUserRoleInProject(projectId, currentUser?.id);
  const isAdmin = currentUserRole === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Proje Üyeleri</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {members.length} üye bu projede çalışıyor
          </p>
        </div>
        {isAdmin && (
          <Button 
            icon={<UserPlus />}
            onClick={() => setIsModalOpen(true)}
          >
            Üye Davet Et
          </Button>
        )}
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member, index) => (
          <Card key={member.id} className="!p-0 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <Avatar 
                  initials={member.avatarInitials} 
                  size="lg"
                  online={member.id === currentUser?.id}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1 truncate">
                    {member.firstName} {member.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
                    {member.email}
                  </p>
                  <Badge variant={member.projectRole === 'admin' ? 'admin' : 'user'}>
                    {member.projectRole === 'admin' ? (
                      <><Shield className="w-3 h-3 inline mr-1" />Admin</>
                    ) : (
                      <><UserIcon className="w-3 h-3 inline mr-1" />User</>
                    )}
                  </Badge>
                </div>
              </div>

              {member.id === currentUser?.id && (
                <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                  <Badge variant="primary" size="sm">
                    Siz
                  </Badge>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {!isAdmin && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex gap-3">
            <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Bilgi</p>
              <p>Sadece admin kullanıcılar yeni üye ekleyebilir</p>
            </div>
          </div>
        </Card>
      )}

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
      />
    </div>
  );
};

export default MembersPage;
