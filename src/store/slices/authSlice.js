import { createSlice } from '@reduxjs/toolkit';
import { mockUsers } from '../../data/mockUsers';

// Get user from localStorage or use default
const getInitialUser = () => {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    try {
      return JSON.parse(savedUser);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Get users from localStorage or use mock data
const getInitialUsers = () => {
  const savedUsers = localStorage.getItem('users');
  if (savedUsers) {
    try {
      return JSON.parse(savedUsers);
    } catch (e) {
      return mockUsers;
    }
  }
  // Save mock users to localStorage initially
  localStorage.setItem('users', JSON.stringify(mockUsers));
  return mockUsers;
};

const initialState = {
  currentUser: getInitialUser(),
  isAuthenticated: !!getInitialUser(),
  users: getInitialUsers(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { username, password } = action.payload;
      const user = state.users.find(
        (u) => u.username === username && u.password === password
      );
      
      if (user) {
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password; // Don't store password
        state.currentUser = userWithoutPassword;
        state.isAuthenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
      }
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      localStorage.removeItem('currentUser');
    },
    register: (state, action) => {
      const { username, password, name, email } = action.payload;
      
      // Check if username already exists
      const existingUser = state.users.find((u) => u.username === username);
      if (existingUser) {
        return state; // Username already exists
      }
      
      // Create new user with default viewer role
      const newUser = {
        id: Date.now().toString(),
        username,
        password,
        name,
        email,
        role: 'viewer',
        permissions: [
          'projects.view',
          'tenders.view',
          'dashboard.view',
          'reports.view',
        ],
        avatar: null,
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      
      state.users.push(newUser);
      // Save to localStorage (in real app, this would be API call)
      localStorage.setItem('users', JSON.stringify(state.users));
    },
    updateUser: (state, action) => {
      const { id, ...updates } = action.payload;
      const userIndex = state.users.findIndex((u) => u.id === id);
      
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...updates };
        localStorage.setItem('users', JSON.stringify(state.users));
        
        // Update current user if it's the same user
        if (state.currentUser && state.currentUser.id === id) {
          const updatedUser = { ...state.currentUser, ...updates };
          delete updatedUser.password;
          state.currentUser = updatedUser;
          localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
        }
      }
    },
    updateUserPermissions: (state, action) => {
      const { userId, permissions, role } = action.payload;
      const userIndex = state.users.findIndex((u) => u.id === userId);
      
      if (userIndex !== -1) {
        if (role) {
          state.users[userIndex].role = role;
        }
        if (permissions) {
          state.users[userIndex].permissions = permissions;
        }
        localStorage.setItem('users', JSON.stringify(state.users));
        
        // Update current user if it's the same user
        if (state.currentUser && state.currentUser.id === userId) {
          if (role) state.currentUser.role = role;
          if (permissions) state.currentUser.permissions = permissions;
          localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
        }
      }
    },
    deleteUser: (state, action) => {
      const userId = action.payload;
      state.users = state.users.filter((u) => u.id !== userId);
      localStorage.setItem('users', JSON.stringify(state.users));
      
      // Logout if deleted user is current user
      if (state.currentUser && state.currentUser.id === userId) {
        state.currentUser = null;
        state.isAuthenticated = false;
        localStorage.removeItem('currentUser');
      }
    },
  },
});

export const { login, logout, register, updateUser, updateUserPermissions, deleteUser } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserPermissions = (state) => {
  if (!state.auth.currentUser) return [];
  return state.auth.currentUser.permissions || [];
};
export const selectUserRole = (state) => {
  return state.auth.currentUser?.role || null;
};

// Permission check helper
export const hasPermission = (permissions, permission) => {
  return permissions.includes(permission) || permissions.includes('all');
};

// Role check helper
export const hasRole = (userRole, allowedRoles) => {
  return allowedRoles.includes(userRole);
};

export default authSlice.reducer;