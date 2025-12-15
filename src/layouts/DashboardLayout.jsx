import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

import MouseFollowStars from '../components/MouseFollowStars';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark relative">
      <MouseFollowStars />
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-6 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
