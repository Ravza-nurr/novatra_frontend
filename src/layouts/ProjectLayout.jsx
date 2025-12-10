import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const ProjectLayout = () => {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar inProject={true} />
        <main className="flex-1 lg:ml-64 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProjectLayout;
