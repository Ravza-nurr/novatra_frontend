import { motion } from 'framer-motion';
import { Sun, Moon, Bell, Menu } from 'lucide-react';
import { useContext, useState, useRef, useEffect } from 'react';
import { UIContext } from '../context/UIContext';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { theme, toggleTheme, toggleSidebar } = useContext(UIContext);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav
      className="h-16 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-40"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <h1 className="text-xl font-bold gradient-text hidden sm:block">NOVATRA V4</h1>
        </motion.div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-500" />
          )}
        </motion.button>

        {/* Notifications */}
        {currentUser && <NotificationBell />}

        {/* User Avatar & Dropdown */}
        {currentUser && (
          <div className="relative" ref={dropdownRef}>
            <motion.button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Avatar initials={currentUser.avatarInitials} size="md" online />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium">{currentUser.firstName} {currentUser.lastName}</p>
              </div>
            </motion.button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-48 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-xl overflow-hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <button
                  onClick={() => {
                    navigate('/dashboard');
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <p className="text-sm font-medium">Anasayfa</p>
                </button>
                <button
                  onClick={() => {
                    navigate('/projects');
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <p className="text-sm font-medium">Projelerim</p>
                </button>
                <div className="border-t border-border-light dark:border-border-dark"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <p className="text-sm font-medium">Çıkış Yap</p>
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
