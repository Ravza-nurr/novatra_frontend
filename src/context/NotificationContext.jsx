import { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { currentUser } = useContext(AuthContext);

  // Load notifications from localStorage
  useEffect(() => {
    const storedNotifications = localStorage.getItem('novatra_notifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('novatra_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const createNotification = (notificationData) => {
    const newNotification = {
      id: uuidv4(),
      ...notificationData,
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications([...notifications, newNotification]);
    return newNotification;
  };

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = (userId) => {
    setNotifications(notifications.map(n =>
      n.userId === userId ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (notificationId) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const updateNotification = (notificationId, updates) => {
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, ...updates } : n
    ));
  };

  const getUserNotifications = (userId) => {
    return notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const getUnreadCount = (userId) => {
    return notifications.filter(n => n.userId === userId && !n.read).length;
  };

  const value = {
    notifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateNotification,
    getUserNotifications,
    getUnreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
