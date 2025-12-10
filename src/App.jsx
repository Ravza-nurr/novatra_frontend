import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProjectProvider } from './context/ProjectContext';
import { TaskProvider } from './context/TaskContext';
import { router } from './router';

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <NotificationProvider>
          <ProjectProvider>
            <TaskProvider>
              <RouterProvider router={router} />
            </TaskProvider>
          </ProjectProvider>
        </NotificationProvider>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;
