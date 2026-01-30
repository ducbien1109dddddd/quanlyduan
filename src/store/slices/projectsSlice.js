import { createSlice } from '@reduxjs/toolkit';
import { mockProjects } from '../../data/mockData';

const initialState = {
  projects: mockProjects,
  selectedProject: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action) => {
      state.projects.push({
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      });
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...action.payload };
      }
    },
    deleteProject: (state, action) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
  },
});

export const { addProject, updateProject, deleteProject, setSelectedProject } = projectsSlice.actions;
export default projectsSlice.reducer;