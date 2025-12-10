import { motion } from 'framer-motion';
import { NavLink, useParams } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Users, Activity, MessageSquare, Sparkles, X } from 'lucide-react';
import { useContext } from 'react';
import { UIContext } from '../context/UIContext';

const Sidebar = ({ inProject = false }) => {
  const { sidebarOpen, toggleSidebar } = useContext(UIContext);
  const { projectId } = useParams();

  const dashboardLinks = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/projects', icon: FolderKanban, label: 'Projeler' },
  ];

  const projectLinks = projectId ? [
    { path: `/project/${projectId}`, icon: LayoutDashboard, label: 'Genel Bakış', end: true },
    { path: `/project/${projectId}/members`, icon: Users, label: 'Üyeler' },
    { path: `/project/${projectId}/tasks`, icon: FolderKanban, label: 'Görevler' },
    { path: `/project/${projectId}/activity`, icon: Activity, label: 'Aktivite' },
    { path: `/project/${projectId}/chat`, icon: MessageSquare, label: 'Chat' },
    { path: `/project/${projectId}/ai`, icon: Sparkles, label: 'AI Asistan' },
  ] : [];

  const links = inProject ? projectLinks : dashboardLinks;

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64
          bg-surface-light dark:bg-surface-dark
          border-r border-border-light dark:border-border-dark
          z-30 lg:z-10
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out
        `}
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Mobile Close Button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/30' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }
              `}
            >
              {({ isActive }) => (
                <motion.div 
                  className="flex items-center gap-3 w-full"
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>
      </motion.aside>
    </>
  );
};

export default Sidebar;
