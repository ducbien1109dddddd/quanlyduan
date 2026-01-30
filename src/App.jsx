import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/Projects/ProjectList';
import ProjectDetail from './pages/Projects/ProjectDetail';
import ProjectForm from './pages/Projects/ProjectForm';
import TenderList from './pages/Tenders/TenderList';
import TenderDetail from './pages/Tenders/TenderDetail';
import TenderForm from './pages/Tenders/TenderForm';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { PERMISSIONS, ROLES } from './data/mockUsers';

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute requiredPermissions={[PERMISSIONS.DASHBOARD_VIEW]}>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route
                  path="/projects"
                  element={
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.PROJECTS_VIEW]}>
                      <ProjectList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/:id"
                  element={
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.PROJECTS_VIEW]}>
                      <ProjectDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/new"
                  element={
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.PROJECTS_CREATE]}>
                      <ProjectForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/edit/:id"
                  element={
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.PROJECTS_EDIT]}>
                      <ProjectForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tenders"
                  element={
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.TENDERS_VIEW]}>
                      <TenderList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tenders/:id"
                  element={
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.TENDERS_VIEW]}>
                      <TenderDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tenders/new"
                  element={
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.TENDERS_CREATE]}>
                      <TenderForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tenders/edit/:id"
                  element={
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.TENDERS_EDIT]}>
                      <TenderForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.REPORTS_VIEW]}>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.SETTINGS_VIEW]}>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;