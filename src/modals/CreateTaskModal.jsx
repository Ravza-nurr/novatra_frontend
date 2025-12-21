import { useState, useContext } from 'react';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { AuthContext } from '../context/AuthContext';

const CreateTaskModal = ({ isOpen, onClose, projectId, members = {}, currentUserRole }) => {
  const { currentUser } = useAuth();
  const { users } = useContext(AuthContext);
  const { createTask } = useTasks();

  // Convert members object to array of user IDs
  const memberIds = Object.keys(members);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeId: currentUser?.id || '',
    priority: 'Medium',
    difficulty: 'Medium',
    status: 'todo'
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Görev başlığı gereklidir';
    }
    if (!formData.assigneeId) {
      newErrors.assigneeId = 'Atanan kişi seçilmelidir';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const taskData = {
      ...formData,
      projectId,
      // User role can only create tasks for themselves with 'todo' status
      ...(currentUserRole === 'user' && {
        assigneeId: currentUser.id,
        status: 'todo'
      })
    };

    createTask(taskData);
    setFormData({
      title: '',
      description: '',
      assigneeId: currentUser?.id || '',
      priority: 'Medium',
      difficulty: 'Medium',
      status: 'todo'
    });
    setErrors({});
    onClose();
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  // Get project members
  const projectMembers = users.filter(user => memberIds.includes(user.id));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yeni Görev Oluştur">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Görev Başlığı"
          value={formData.title}
          onChange={handleChange('title')}
          placeholder="Örn: UI Tasarımı Geliştir"
          error={errors.title}
          required
        />

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Açıklama
          </label>
          <textarea
            value={formData.description}
            onChange={handleChange('description')}
            placeholder="Görev detaylarını yazın..."
            rows={3}
            className="
              w-full px-4 py-3 rounded-lg
              bg-surface-light dark:bg-surface-dark
              border-2 border-border-light dark:border-border-dark
              text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
              transition-all duration-200
              resize-none
            "
          />
        </div>

        {/* Admin can assign to anyone, User can only assign to themselves */}
        {currentUserRole === 'admin' ? (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Atanan Kişi <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.assigneeId}
              onChange={handleChange('assigneeId')}
              className={`
                w-full px-4 py-3 rounded-lg
                bg-surface-light dark:bg-surface-dark
                border-2 ${errors.assigneeId ? 'border-red-500' : 'border-border-light dark:border-border-dark'}
                text-gray-900 dark:text-gray-100
                focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                transition-all duration-200
              `}
            >
              <option value="">Kişi Seçin</option>
              {projectMembers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.role})
                </option>
              ))}
            </select>
            {errors.assigneeId && (
              <p className="mt-1 text-sm text-red-500">{errors.assigneeId}</p>
            )}
          </div>
        ) : (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              ℹ️ Görev otomatik olarak size atanacak
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Öncelik <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.priority}
            onChange={handleChange('priority')}
            className="
              w-full px-4 py-3 rounded-lg
              bg-surface-light dark:bg-surface-dark
              border-2 border-border-light dark:border-border-dark
              text-gray-900 dark:text-gray-100
              focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
              transition-all duration-200
            "
          >
            <option value="Low">Düşük</option>
            <option value="Medium">Orta</option>
            <option value="High">Yüksek</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Zorluk Seviyesi
          </label>
          <select
            value={formData.difficulty}
            onChange={handleChange('difficulty')}
            className="
              w-full px-4 py-3 rounded-lg
              bg-surface-light dark:bg-surface-dark
              border-2 border-border-light dark:border-border-dark
              text-gray-900 dark:text-gray-100
              focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
              transition-all duration-200
            "
          >
            <option value="Easy">Kolay</option>
            <option value="Medium">Orta</option>
            <option value="Hard">Zor</option>
          </select>
        </div>

        {/* Status - Only for admin */}
        {currentUserRole === 'admin' && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Durum
            </label>
            <select
              value={formData.status}
              onChange={handleChange('status')}
              className="
                w-full px-4 py-3 rounded-lg
                bg-surface-light dark:bg-surface-dark
                border-2 border-border-light dark:border-border-dark
                text-gray-900 dark:text-gray-100
                focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                transition-all duration-200
              "
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        )}

        {currentUserRole === 'user' && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ℹ️ Görev "To Do" durumunda oluşturulacak
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="secondary" onClick={onClose} type="button">
            İptal
          </Button>
          <Button type="submit">
            Görev Oluştur
          </Button>
        </div>
      </form>
    </Modal >
  );
};

export default CreateTaskModal;
