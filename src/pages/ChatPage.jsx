import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import ChatBubble from '../components/ChatBubble';
import Button from '../components/Button';
import io from 'socket.io-client';

const ChatPage = () => {
  const { projectId } = useParams();
  const { currentUser, getUserById } = useAuth();
  const { getProjectById, addActivity } = useProjects();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const project = getProjectById(projectId);

  // Load messages from localStorage
  useEffect(() => {
    const storedMessages = localStorage.getItem(`chat_${projectId}`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, [projectId]);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_${projectId}`, JSON.stringify(messages));
    }
  }, [messages, projectId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentUser) return;

    const message = {
      id: Date.now().toString(),
      text: newMessage,
      userId: currentUser.id,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Add to activity log
    if (addActivity) {
      addActivity(projectId, {
        userId: currentUser.id,
        message: `${currentUser.firstName} chat'te mesaj gönderdi`
      });
    }

    // Simulate receiving a response (for demo purposes)
    setTimeout(() => {
      const otherUser = project?.members.find(id => id !== currentUser.id);
      if (otherUser) {
        const responseUser = getUserById(otherUser);
        if (responseUser) {
          const response = {
            id: Date.now().toString() + '_response',
            text: getAutoResponse(),
            userId: responseUser.id,
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, response]);
        }
      }
    }, 1000 + Math.random() * 2000);
  };

  const getAutoResponse = () => {
    const responses = [
      'Anladım, teşekkürler!',
      'Harika fikir! 👍',
      'Bunu inceleyelim.',
      'Katılıyorum.',
      'Güzel çalışma!',
      'Hemen bakıyorum.',
      'Tamam, ayarlıyorum.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Proje Chat'i</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ekibinizle gerçek zamanlı iletişim kurun
        </p>
      </div>

      {/* Chat Container */}
      <Card className="h-[600px] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Henüz mesaj yok</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                İlk mesajı göndererek sohbeti başlatın
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => {
                const user = getUserById(message.userId);
                return (
                  <ChatBubble
                    key={message.id}
                    message={message.text}
                    user={user}
                    isCurrentUser={message.userId === currentUser?.id}
                    timestamp={message.timestamp}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border-light dark:border-border-dark">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="
                flex-1 px-4 py-3 rounded-lg
                bg-gray-100 dark:bg-gray-800
                border-2 border-transparent
                text-gray-900 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                transition-all duration-200
              "
            />
            <Button 
              type="submit" 
              icon={<Send className="w-4 h-4" />}
              disabled={!newMessage.trim()}
            >
              Gönder
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ChatPage;
