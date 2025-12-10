import { useState } from 'react';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';

const CreateProjectModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const { createProject } = useProjects();
  const { currentUser } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Proje adı gereklidir';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Açıklama gereklidir';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    createProject(formData);
    setFormData({ name: '', description: '' });
    setErrors({});
    onClose();
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yeni Proje Oluştur">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Proje Adı"
          value={formData.name}
          onChange={handleChange('name')}
          placeholder="Örn: NOVATRA V4 Development"
          error={errors.name}
          required
        />

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Açıklama <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={handleChange('description')}
            placeholder="Proje hakkında kısa bir açıklama yazın..."
            rows={4}
            className={`
              w-full px-4 py-3 rounded-lg
              bg-surface-light dark:bg-surface-dark
              border-2 ${errors.description ? 'border-red-500' : 'border-border-light dark:border-border-dark'}
              text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
              transition-all duration-200
              resize-none
            `}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="secondary" onClick={onClose} type="button">
            İptal
          </Button>
          <Button type="submit">
            Proje Oluştur
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
