import { database } from '../config/firebase';
import { ref, set, get, push, update, remove, onValue, off } from 'firebase/database';

// Users collection path
const USERS_PATH = 'users';

/**
 * Get all users from Firebase
 */
export const getAllUsers = async () => {
  try {
    const usersRef = ref(database, USERS_PATH);
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      const usersData = snapshot.val();
      // Convert Firebase object to array
      return Object.keys(usersData).map(key => ({
        id: key,
        ...usersData[key]
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  try {
    const userRef = ref(database, `${USERS_PATH}/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return {
        id: userId,
        ...snapshot.val()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

/**
 * Get user by username
 */
export const getUserByUsername = async (username) => {
  try {
    const users = await getAllUsers();
    return users.find(user => user.username === username) || null;
  } catch (error) {
    console.error('Error getting user by username:', error);
    throw error;
  }
};

/**
 * Create new user
 */
export const createUser = async (userData) => {
  try {
    const usersRef = ref(database, USERS_PATH);
    const newUserRef = push(usersRef);
    
    const userWithId = {
      ...userData,
      id: newUserRef.key,
      createdAt: new Date().toISOString(),
    };
    
    await set(newUserRef, userWithId);
    return userWithId;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update user
 */
export const updateUser = async (userId, updates) => {
  try {
    const userRef = ref(database, `${USERS_PATH}/${userId}`);
    await update(userRef, updates);
    return { id: userId, ...updates };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Delete user
 */
export const deleteUser = async (userId) => {
  try {
    const userRef = ref(database, `${USERS_PATH}/${userId}`);
    await remove(userRef);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Listen to users changes (real-time updates)
 */
export const subscribeToUsers = (callback) => {
  const usersRef = ref(database, USERS_PATH);
  
  onValue(usersRef, (snapshot) => {
    if (snapshot.exists()) {
      const usersData = snapshot.val();
      const users = Object.keys(usersData).map(key => ({
        id: key,
        ...usersData[key]
      }));
      callback(users);
    } else {
      callback([]);
    }
  });
  
  // Return unsubscribe function
  return () => {
    off(usersRef);
  };
};