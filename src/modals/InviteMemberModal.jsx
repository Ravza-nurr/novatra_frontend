import { useState, useContext } from 'react';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';
import { NotificationContext } from '../context/NotificationContext';
import { Mail, UserPlus } from 'lucide-react';

const InviteMemberModal = ({ isOpen, onClose, projectId }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const { addMember } = useProjects();
  const { currentUser, getUserByEmail, createUserFromEmail } = useAuth();
  const { createNotification } = useContext(NotificationContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email adresi gereklidir');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Geçerli bir email adresi girin');
      return;
    }

    // Check if user exists
    let user = getUserByEmail(email);

    // If user doesn't exist, create new user
    if (!user) {
      user = createUserFromEmail(email, role);
    }

    // Add member to project with selected role
    addMember(projectId, user.id, currentUser.id, role);

    // Send notification
    createNotification({
      userId: user.id,
      message: `${currentUser.firstName} ${currentUser.lastName} sizi projeye ekledi`,
      type: 'member_added'
    });

    setEmail('');
    setRole('user');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Üye Davet Et">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email Adresi"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          placeholder="ornek@email.com"
          error={error}
          icon={<Mail className="w-5 h-5" />}
          required
        />

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Rol <span className="text-red-500">*</span>
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="
              w-full px-4 py-3 rounded-lg
              bg-surface-light dark:bg-surface-dark
              border-2 border-border-light dark:border-border-dark
              text-gray-900 dark:text-gray-100
              focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
              transition-all duration-200
            "
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Admin: Tüm proje yetkileri | User: Sınırlı yetkiler
          </p>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex gap-3">
            <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Bilgi</p>
              <p>
                Kullanıcı sistemde yoksa otomatik olarak oluşturulacak ve projeye eklenecektir.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="secondary" onClick={onClose} type="button">
            İptal
          </Button>
          <Button type="submit" icon={<UserPlus className="w-4 h-4" />}>
            Üye Ekle
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default InviteMemberModal;
