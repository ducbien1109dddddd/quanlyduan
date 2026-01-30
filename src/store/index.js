import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './slices/projectsSlice';
import tendersReducer from './slices/tendersSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    tenders: tendersReducer,
    auth: authReducer,
  },
});