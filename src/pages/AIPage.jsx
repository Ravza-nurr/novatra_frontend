import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileText, Calendar, Map, BarChart3, Send } from 'lucide-react';
import Card from '../components/Card';
import AIQuickActionCard from '../components/AIQuickActionCard';
import Button from '../components/Button';
import Modal from '../components/Modal';

const AIPage = () => {
  const [selectedAction, setSelectedAction] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickActions = [
    {
      id: 'task-description',
      icon: <FileText />,
      title: 'Görev Açıklaması Üret',
      description: 'AI ile detaylı görev açıklamaları oluşturun',
      response: 'Tabii ki! İşte detaylı bir görev açıklaması:\n\n**Görev: Landing Page Tasarımı**\n\nKullanıcı dostu, modern ve responsive bir landing page tasarımı oluşturun. Sayfa hero bölümü, özellikler, fiyatlandırma ve iletişim formunu içermelidir.\n\n**Gereksinimler:**\n- Mobile-first yaklaşım\n- Hızlı yükleme süresi\n- SEO optimizasyonu\n- Erişilebilirlik standartları'
    },
    {
      id: 'sprint-plan',
      icon: <Calendar />,
      title: 'Sprint Planı Oluştur',
      description: '2 haftalık sprint planlaması yapın',
      response: '📅 **2 Haftalık Sprint Planı**\n\n**Hafta 1:**\n- Gün 1-2: Tasarım mockup\'ları\n- Gün 3-4: Frontend geliştirme\n- Gün 5: Code review\n\n**Hafta 2:**\n- Gün 1-2: Backend API entegrasyonu\n- Gün 3: Test ve bug fixing\n- Gün 4: Deployment hazırlığı\n- Gün 5: Sprint review ve retrospective'
    },
    {
      id: 'roadmap',
      icon: <Map />,
      title: 'Yol Haritası Çıkar',
      description: 'Proje yol haritası oluşturun',
      response: '🗺️ **Proje Yol Haritası (Q1-Q2 2024)**\n\n**Q1 2024:**\n✅ MVP Geliştirme\n✅ Beta Testing\n🔄 Kullanıcı Geri Bildirimleri\n\n**Q2 2024:**\n📋 Yeni Özellikler\n📋 Performance Optimization\n📋 Resmi Lansıman\n\nHer aşama için detaylı milestone\'lar ve deliverable\'lar tanımlanmıştır.'
    },
    {
      id: 'report',
      icon: <BarChart3 />,
      title: 'Rapor Özeti',
      description: 'Proje ilerlemesi raporu oluşturun',
      response: '📊 **Proje İlerleme Raporu**\n\n**Genel Durum:** ✅ Planında\n\n**Tamamlanan:** 67%\n**Devam Eden:** 4 görev\n**Bekleyen:** 8 görev\n\n**Öne Çıkanlar:**\n✨ UI tasarımı tamamlandı\n✨ API entegrasyonu %80 bitti\n\n**Riskler:**\n⚠️ Test ortamı gecikmesi (düşük risk)'
    }
  ];

  const handleQuickAction = (action) => {
    setSelectedAction(action);
  };

  const closeModal = () => {
    setSelectedAction(null);
  };

  const handleChatSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: chatInput,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');
    setIsTyping(true);

    // Simulate AI typing
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: getAIResponse(chatInput),
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const getAIResponse = (input) => {
    const responses = {
      'görev': 'Yeni bir görev oluşturmanıza yardımcı olabilirim. Görevin başlığı, açıklaması ve önceliği hakkında bilgi verir misiniz?',
      'proje': 'Proje yönetimi konusunda size yardımcı olabilirim. Ne tür bir proje oluşturmak istiyorsunuz?',
      'ekip': 'Ekip yönetimi konusunda destek olabilirim. Ekibinize yeni üye mi eklemek istiyorsunuz?',
      'rapor': 'Detaylı proje raporları oluşturabilirim. Hangi metrikleri görmek istersiniz?',
      'default': 'Anladım! Size nasıl yardımcı olabilirim? Görevler, projeler, ekip yönetimi veya raporlama konularında destek sağlayabilirim. 🤖'
    };

    const lowerInput = input.toLowerCase();
    for (const [key, value] of Object.entries(responses)) {
      if (lowerInput.includes(key)) {
        return value;
      }
    }
    return responses.default;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          AI Asistan
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Yapay zeka destekli proje yönetimi asistanınız
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <AIQuickActionCard
                icon={action.icon}
                title={action.title}
                description={action.description}
                onClick={() => handleQuickAction(action)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Chat */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Chat
        </h2>

        <div className="space-y-4">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg space-y-3">
            {chatMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <Sparkles className="w-12 h-12 mx-auto mb-3 text-primary opacity-50" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    AI asistanınızla sohbete başlayın
                  </p>
                </div>
              </div>
            ) : (
              chatMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[80%] px-4 py-3 rounded-2xl
                      ${message.isUser
                        ? 'bg-gradient-to-r from-primary to-primary-light text-white rounded-br-sm'
                        : 'glass text-gray-900 dark:text-gray-100 rounded-bl-sm'
                      }
                    `}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                </motion.div>
              ))
            )}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="glass px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <div className="typing-dot w-2 h-2 bg-primary rounded-full"></div>
                    <div className="typing-dot w-2 h-2 bg-primary rounded-full"></div>
                    <div className="typing-dot w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleChatSend} className="flex gap-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="AI asistanınıza bir şey sorun..."
              className="
                flex-1 px-4 py-3 rounded-lg
                bg-surface-light dark:bg-surface-dark
                border-2 border-border-light dark:border-border-dark
                text-gray-900 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                transition-all duration-200
              "
            />
            <Button
              type="submit"
              icon={<Send className="w-4 h-4" />}
              disabled={!chatInput.trim()}
            >
              Gönder
            </Button>
          </form>
        </div>
      </Card>

      {/* AI Response Modal */}
      {selectedAction && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title={selectedAction.title}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-primary-light/10 rounded-lg">
              <Sparkles className="w-6 h-6 text-primary" />
              <p className="text-sm font-medium">AI tarafından oluşturuldu</p>
            </div>

            <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                {selectedAction.response}
              </pre>
            </div>

            <div className="flex justify-end">
              <Button onClick={closeModal}>
                Tamam
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AIPage;
