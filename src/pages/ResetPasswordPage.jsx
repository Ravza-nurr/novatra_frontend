import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import GoldenStarLogo from '../components/GoldenStarLogo';
import MouseFollowStars from '../components/MouseFollowStars';

const ResetPasswordPage = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Şifreler eşleşmiyor!');
            return;
        }
        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }, 1000);
    };

    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <MouseFollowStars />

            <motion.div
                className="w-full max-w-md bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-2xl border border-border-light dark:border-border-dark relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16">
                        <GoldenStarLogo />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center mb-2 gradient-text">
                    Yeni Şifre Belirle
                </h2>

                {!submitted ? (
                    <>
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                            Lütfen hesabınız için yeni bir şifre belirleyin.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                type="password"
                                label="Yeni Şifre"
                                value={formData.password}
                                onChange={handleChange('password')}
                                placeholder="••••••••"
                                icon={<Lock className="w-5 h-5" />}
                                required
                            />

                            <Input
                                type="password"
                                label="Yeni Şifre (Tekrar)"
                                value={formData.confirmPassword}
                                onChange={handleChange('confirmPassword')}
                                placeholder="••••••••"
                                icon={<Lock className="w-5 h-5" />}
                                required
                            />

                            <Button
                                type="submit"
                                fullWidth
                                icon={<CheckCircle className="w-4 h-4" />}
                            >
                                Şifreyi Güncelle
                            </Button>
                        </form>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                    >
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Şifre Güncellendi!</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Giriş sayfasına yönlendiriliyorsunuz...
                        </p>
                    </motion.div>
                )}

                <div className="mt-6 text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Giriş sayfasına dön
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;
