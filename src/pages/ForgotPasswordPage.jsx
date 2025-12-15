import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import GoldenStarLogo from '../components/GoldenStarLogo';
import MouseFollowStars from '../components/MouseFollowStars';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Lütfen e-posta adresinizi girin.');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
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
                    Şifremi Unuttum
                </h2>

                {!submitted ? (
                    <>
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                type="email"
                                label="E-posta Adresi"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                }}
                                placeholder="ornek@email.com"
                                icon={<Mail className="w-5 h-5" />}
                                required
                                error={error}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                icon={<Send className="w-4 h-4" />}
                            >
                                Sıfırlama Bağlantısı Gönder
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
                            <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">E-posta Gönderildi!</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Lütfen e-posta kutunuzu kontrol edin ve talimatları izleyin.
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

export default ForgotPasswordPage;
