import { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('novatra_users');
    const storedSession = localStorage.getItem('novatra_session');
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Initialize with default admin user
      const defaultUsers = [
        {
          id: uuidv4(),
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@novatra.com',
          password: 'admin123',
          role: 'admin',
          avatarInitials: 'AU',
          projects: []
        }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('novatra_users', JSON.stringify(defaultUsers));
    }
    
    if (storedSession) {
      setCurrentUser(JSON.parse(storedSession));
    }
    
    setLoading(false);
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('novatra_users', JSON.stringify(users));
    }
  }, [users]);

  // Save session to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('novatra_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('novatra_session');
    }
  }, [currentUser]);

  const register = (userData) => {
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Bu email adresi zaten kullanılıyor');
    }

    const newUser = {
      id: uuidv4(),
      ...userData,
      avatarInitials: `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase(),
      projects: []
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Email veya şifre hatalı');
    }

    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUser = (userId, updates) => {
    setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (currentUser?.id === userId) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  const getUserById = (userId) => {
    return users.find(u => u.id === userId);
  };

  const getUserByEmail = (email) => {
    return users.find(u => u.email === email);
  };

  const createUserFromEmail = (email, role = 'user') => {
    const nameParts = email.split('@')[0].split('.');
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts[1] || 'Guest';
    
    const newUser = {
      id: uuidv4(),
      firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
      lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
      email,
      password: uuidv4().substring(0, 8), // Random password
      role,
      avatarInitials: `${firstName[0]}${lastName[0]}`.toUpperCase(),
      projects: []
    };

    setUsers([...users, newUser]);
    return newUser;
  };

  const value = {
    currentUser,
    users,
    loading,
    register,
    login,
    logout,
    updateUser,
    getUserById,
    getUserByEmail,
    createUserFromEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
