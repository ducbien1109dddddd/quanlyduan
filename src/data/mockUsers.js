// Mock Users with different roles and permissions

export const mockUsers = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
    email: 'admin@ptms.gov.vn',
    role: 'admin',
    permissions: [
      'all', // Admin has all permissions
    ],
    avatar: null,
  },
  {
    id: '2',
    username: 'manager',
    password: 'manager123',
    name: 'Project Manager',
    email: 'manager@ptms.gov.vn',
    role: 'manager',
    permissions: [
      'projects.view',
      'projects.create',
      'projects.edit',
      'projects.delete',
      'tenders.view',
      'tenders.create',
      'tenders.edit',
      'tenders.delete',
      'dashboard.view',
      'reports.view',
    ],
    avatar: null,
  },
  {
    id: '3',
    username: 'viewer',
    password: 'viewer123',
    name: 'Viewer User',
    email: 'viewer@ptms.gov.vn',
    role: 'viewer',
    permissions: [
      'projects.view',
      'tenders.view',
      'dashboard.view',
      'reports.view',
    ],
    avatar: null,
  },
  {
    id: '4',
    username: 'editor',
    password: 'editor123',
    name: 'Editor User',
    email: 'editor@ptms.gov.vn',
    role: 'editor',
    permissions: [
      'projects.view',
      'projects.create',
      'projects.edit',
      'tenders.view',
      'tenders.create',
      'tenders.edit',
      'dashboard.view',
      'reports.view',
    ],
    avatar: null,
  },
];

// Permission definitions
export const PERMISSIONS = {
  // Projects
  PROJECTS_VIEW: 'projects.view',
  PROJECTS_CREATE: 'projects.create',
  PROJECTS_EDIT: 'projects.edit',
  PROJECTS_DELETE: 'projects.delete',
  
  // Tenders
  TENDERS_VIEW: 'tenders.view',
  TENDERS_CREATE: 'tenders.create',
  TENDERS_EDIT: 'tenders.edit',
  TENDERS_DELETE: 'tenders.delete',
  
  // Dashboard & Reports
  DASHBOARD_VIEW: 'dashboard.view',
  REPORTS_VIEW: 'reports.view',
  
  // Settings
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_EDIT: 'settings.edit',
  
  // All permissions
  ALL: 'all',
};

// Role definitions
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EDITOR: 'editor',
  VIEWER: 'viewer',
};