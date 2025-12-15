import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import GoldenStarLogo from '../components/GoldenStarLogo';
import MouseFollowStars from '../components/MouseFollowStars';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    try {
      login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setError('');
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto relative">
      <MouseFollowStars />

      {/* Left Side - Branding */}
      <motion.div
        className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-primary to-primary-light rounded-2xl text-white relative z-10 h-full"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center mb-6 w-20 h-20 mx-auto">
          <GoldenStarLogo />
        </div>

        <h1 className="text-4xl font-bold mb-4 text-center">NOVATRA</h1>
        <p className="text-lg opacity-90 mb-8 text-center">
          Premium Proje Yönetim Platformu
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              ✓
            </div>
            <div>
              <h3 className="font-semibold mb-1">Akıllı Görev Akışı Yönetimi</h3>
              <p className="text-sm opacity-80">Süreçlerinizi dinamik ve modern bir yapıda düzenleyin</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              ✓
            </div>
            <div>
              <h3 className="font-semibold mb-1">Gerçek Zamanlı İşbirliği</h3>
              <p className="text-sm opacity-80">Ekibinizle anında iletişim kurun</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              ✓
            </div>
            <div>
              <h3 className="font-semibold mb-1">AI Destekli Asistan</h3>
              <p className="text-sm opacity-80">Yapay zeka ile verimliliğinizi artırın</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        className="flex flex-col p-8 md:p-12 relative z-10 h-full"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-2xl border border-border-light dark:border-border-dark h-full flex flex-col justify-center">
          <h2 className="text-3xl font-bold gradient-text mb-2">Hoş Geldiniz</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Hesabınıza giriş yapın
          </p>

          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="ornek@email.com"
              icon={<Mail className="w-5 h-5" />}
              required
            />

            <div className="flex flex-col gap-2">
              <Input
                type="password"
                label="Şifre"
                value={formData.password}
                onChange={handleChange('password')}
                placeholder="••••••••"
                icon={<Lock className="w-5 h-5" />}
                required
              />
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary-dark transition-colors"
                >
                  Şifremi Unuttum
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              icon={<LogIn className="w-5 h-5" />}
            >
              Giriş Yap
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Hesabınız yok mu?{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Kayıt Olun
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Demo Hesap:
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Email: admin@novatra.com<br />
              Şifre: admin123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
