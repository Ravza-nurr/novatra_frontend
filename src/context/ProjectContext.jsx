import { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from './AuthContext';
import { NotificationContext } from './NotificationContext';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const { currentUser } = useContext(AuthContext);

  // Load projects from localStorage
  useEffect(() => {
    const storedProjects = localStorage.getItem('novatra_projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
  }, []);

  // Save projects to localStorage
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('novatra_projects', JSON.stringify(projects));
    }
  }, [projects]);

  const createProject = (projectData) => {
    const newProject = {
      id: uuidv4(),
      ...projectData,
      createdAt: new Date().toISOString(),
      members: {
        [currentUser.id]: 'admin' // Creator is always admin of their project
      },
      tasks: [],
      activity: [
        {
          id: uuidv4(),
          userId: currentUser.id,
          message: `${currentUser.firstName} ${currentUser.lastName} projeyi oluşturdu`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    setProjects([...projects, newProject]);
    return newProject;
  };

  const updateProject = (projectId, updates) => {
    setProjects(projects.map(p =>
      p.id === projectId ? { ...p, ...updates } : p
    ));
  };

  const deleteProject = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const getProjectById = (projectId) => {
    return projects.find(p => p.id === projectId);
  };

  const getUserProjects = (userId) => {
    return projects.filter(p => p.members && p.members[userId] !== undefined);
  };

  const addMember = (projectId, userId, addedByUserId, role = 'user') => {
    const project = getProjectById(projectId);
    if (!project) return;

    if (!project.members[userId]) {
      const updatedMembers = { ...project.members, [userId]: role };
      const activity = {
        id: uuidv4(),
        userId: addedByUserId,
        message: `Yeni üye projeye eklendi (${role})`,
        timestamp: new Date().toISOString()
      };

      updateProject(projectId, {
        members: updatedMembers,
        activity: [...project.activity, activity]
      });
    }
  };

  const removeMember = (projectId, userId) => {
    const project = getProjectById(projectId);
    if (!project) return;

    const updatedMembers = { ...project.members };
    delete updatedMembers[userId];
    updateProject(projectId, { members: updatedMembers });
  };

  const getUserRoleInProject = (projectId, userId) => {
    const project = getProjectById(projectId);
    if (!project || !project.members) return null;
    return project.members[userId] || null;
  };

  const addActivity = (projectId, activity) => {
    const project = getProjectById(projectId);
    if (!project) return;

    const newActivity = {
      id: uuidv4(),
      ...activity,
      timestamp: new Date().toISOString()
    };

    updateProject(projectId, {
      activity: [...project.activity, newActivity]
    });
  };

  const [invitations, setInvitations] = useState([]);

  // Load invitations from localStorage
  useEffect(() => {
    const storedInvitations = localStorage.getItem('novatra_invitations');
    if (storedInvitations) {
      setInvitations(JSON.parse(storedInvitations));
    }
  }, []);

  // Save invitations to localStorage
  useEffect(() => {
    if (invitations.length > 0) {
      localStorage.setItem('novatra_invitations', JSON.stringify(invitations));
    }
  }, [invitations]);

  const sendInvitation = (projectId, userId, invitedByUserId, role = 'user') => {
    const newInvitation = {
      id: uuidv4(),
      projectId,
      userId,
      invitedByUserId,
      role,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setInvitations([...invitations, newInvitation]);
    return newInvitation;
  };

  const respondToInvitation = (invitationId, status) => { // status: 'accepted' or 'rejected'
    const invitation = invitations.find(i => i.id === invitationId);
    if (!invitation) return;

    if (status === 'accepted') {
      addMember(invitation.projectId, invitation.userId, invitation.invitedByUserId, invitation.role);
    }

    // Remove invitation after response
    setInvitations(invitations.filter(i => i.id !== invitationId));
  };

  const value = {
    projects,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    getUserProjects,
    addMember,
    removeMember,
    addActivity,
    getUserRoleInProject,
    invitations,
    sendInvitation,
    respondToInvitation
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
