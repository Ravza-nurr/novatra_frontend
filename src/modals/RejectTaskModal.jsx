import { X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import Input from '../components/Input';

const RejectTaskModal = ({ isOpen, onClose, onReject, taskTitle }) => {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReject = async () => {
        setIsSubmitting(true);
        await onReject(reason);
        setIsSubmitting(false);
        setReason('');
        onClose();
    };

    const handleClose = () => {
        setReason('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div
                            className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl max-w-md w-full p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Görevi Reddet</h2>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    disabled={isSubmitting}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>"{taskTitle}"</strong> görevini reddetmek üzeresiniz.
                                </p>

                                <Input
                                    label="Reddetme Nedeni (İsteğe Bağlı)"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Neden bu görevi reddediyorsunuz?"
                                    multiline
                                    rows={3}
                                    disabled={isSubmitting}
                                />

                                <div className="flex gap-3 justify-end pt-2">
                                    <Button
                                        variant="secondary"
                                        onClick={handleClose}
                                        disabled={isSubmitting}
                                    >
                                        İptal
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={handleReject}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Reddediliyor...' : 'Reddet'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default RejectTaskModal;
