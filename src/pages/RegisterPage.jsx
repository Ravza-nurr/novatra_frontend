import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ad gereklidir';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Soyad gereklidir';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email gereklidir';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir email adresi girin';
    }

    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      const { confirmPassword, ...userData } = formData;
      // Always set role as 'user' - roles are project-specific
      register({ ...userData, role: 'user' });
      navigate('/dashboard');
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Left Side - Branding */}
      <motion.div
        className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-primary-light to-primary rounded-2xl text-white"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-6">
            <span className="text-4xl font-bold">N</span>
          </div>
        </motion.div>

        <h1 className="text-4xl font-bold mb-4">Aramıza Katılın</h1>
        <p className="text-lg opacity-90 mb-8">
          Modern proje yönetiminin gücünü keşfedin
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              🚀
            </div>
            <div>
              <h3 className="font-semibold mb-1">Hızlı Başlangıç</h3>
              <p className="text-sm opacity-80">Dakikalar içinde kurulum yapın</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              👥
            </div>
            <div>
              <h3 className="font-semibold mb-1">Ekip İşbirliği</h3>
              <p className="text-sm opacity-80">Sınırsız takım üyesi ekleyin</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              ⚡
            </div>
            <div>
              <h3 className="font-semibold mb-1">Güçlü Özellikler</h3>
              <p className="text-sm opacity-80">AI asistan, kanban, chat ve daha fazlası</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Register Form */}
      <motion.div
        className="flex flex-col justify-center p-8 md:p-12"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-2xl border border-border-light dark:border-border-dark">
          <h2 className="text-3xl font-bold gradient-text mb-2">Hesap Oluşturun</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Ücretsiz hesabınızı oluşturun
          </p>

          {errors.general && (
            <motion.div
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Ad"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                placeholder="Ahmet"
                icon={<User className="w-5 h-5" />}
                error={errors.firstName}
                required
              />

              <Input
                label="Soyad"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                placeholder="Yılmaz"
                icon={<User className="w-5 h-5" />}
                error={errors.lastName}
                required
              />
            </div>

            <Input
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="ornek@email.com"
              icon={<Mail className="w-5 h-5" />}
              error={errors.email}
              required
            />

            <Input
              type="password"
              label="Şifre"
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              error={errors.password}
              required
            />

            <Input
              type="password"
              label="Şifre Tekrar"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              error={errors.confirmPassword}
              required
            />

            <Button 
              type="submit" 
              fullWidth
              icon={<UserPlus className="w-5 h-5" />}
            >
              Kayıt Ol
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Zaten hesabınız var mı?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Giriş Yapın
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
