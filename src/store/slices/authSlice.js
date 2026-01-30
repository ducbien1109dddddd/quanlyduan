import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockUsers } from '../../data/mockUsers';
import * as firebaseService from '../../services/firebaseService';

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

// Async thunks for Firebase operations
export const fetchUsers = createAsyncThunk(
  'auth/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const users = await firebaseService.getAllUsers();
      // If no users in Firebase, initialize with mock users
      if (users.length === 0) {
        // Initialize Firebase with mock users
        for (const user of mockUsers) {
          await firebaseService.createUser(user);
        }
        return mockUsers;
      }
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to localStorage if Firebase fails
      const savedUsers = localStorage.getItem('users');
      if (savedUsers) {
        try {
          return JSON.parse(savedUsers);
        } catch (e) {
          return mockUsers;
        }
      }
      return mockUsers;
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // Check if username exists
      const existingUser = await firebaseService.getUserByUsername(userData.username);
      if (existingUser) {
        throw new Error('Username already exists');
      }

      const newUser = {
        username: userData.username,
        password: userData.password,
        name: userData.name,
        email: userData.email,
        role: 'viewer',
        permissions: [
          'projects.view',
          'tenders.view',
          'dashboard.view',
          'reports.view',
        ],
        avatar: null,
        isActive: true,
      };

      const createdUser = await firebaseService.createUser(newUser);
      return createdUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserPermissionsAsync = createAsyncThunk(
  'auth/updateUserPermissions',
  async ({ userId, permissions, role }, { rejectWithValue }) => {
    try {
      const updates = {};
      if (role) updates.role = role;
      if (permissions) updates.permissions = permissions;
      
      await firebaseService.updateUser(userId, updates);
      return { userId, ...updates };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUserAsync = createAsyncThunk(
  'auth/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await firebaseService.deleteUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentUser: getInitialUser(),
  isAuthenticated: !!getInitialUser(),
  users: [],
  loading: false,
  error: null,
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
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    updateCurrentUser: (state, action) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update user permissions
    builder
      .addCase(updateUserPermissionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserPermissionsAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, ...updates } = action.payload;
        const userIndex = state.users.findIndex((u) => u.id === userId);
        
        if (userIndex !== -1) {
          state.users[userIndex] = { ...state.users[userIndex], ...updates };
        }
        
        // Update current user if it's the same user
        if (state.currentUser && state.currentUser.id === userId) {
          state.currentUser = { ...state.currentUser, ...updates };
          localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
        }
      })
      .addCase(updateUserPermissionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete user
    builder
      .addCase(deleteUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        const userId = action.payload;
        state.users = state.users.filter((u) => u.id !== userId);
        
        // Logout if deleted user is current user
        if (state.currentUser && state.currentUser.id === userId) {
          state.currentUser = null;
          state.isAuthenticated = false;
          localStorage.removeItem('currentUser');
        }
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { login, logout, setUsers, updateCurrentUser } = authSlice.actions;

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