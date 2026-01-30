# Project & Tender Management System

A modern frontend interface built with ReactJS for managing projects and tender packages. This is a comprehensive government/enterprise-style application with a clean, professional UI.

## Tech Stack

- **React 18** - Functional components with hooks
- **React Router v6** - Client-side routing
- **Redux Toolkit** - State management
- **Ant Design 5** - UI component library
- **Recharts** - Chart library for data visualization
- **Vite** - Build tool and dev server
- **Day.js** - Date manipulation

## Features

### 1. Dashboard
- Summary cards showing key metrics:
  - Total projects and tender packages
  - Active and completed projects
  - Total and disbursed budget
- Interactive charts:
  - Bar chart: Project count by status
  - Pie chart: Budget distribution by project type
  - Line chart: Project progress over time
- Recent activity table

### 2. Project Management
- **Project List**: Table view with pagination, search, and filtering
- **Project Detail**: Comprehensive project information with timeline and progress
- **Create/Edit Project**: Form for adding or updating projects
- Features:
  - Search by code, name, or investor
  - Filter by status (Active, Completed, Planning)
  - Sort by various fields
  - View related tender packages

### 3. Tender Package Management
- **Tender List**: Table view with pagination, search, and filtering
- **Tender Detail**: Detailed tender information with implementation progress
- **Create/Edit Tender**: Form for managing tender packages
- Features:
  - Link to parent project
  - Track contractor and contract values
  - Monitor implementation progress
  - Status management

### 4. Common Features
- Responsive sidebar navigation
- Breadcrumb navigation
- User profile dropdown
- Notification badge
- Color-coded status indicators
- Professional government/enterprise styling

## Project Structure

```
src/
├── components/
│   └── Layout/
│       ├── MainLayout.jsx
│       ├── Sidebar.jsx
│       └── Header.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Projects/
│   │   ├── ProjectList.jsx
│   │   ├── ProjectDetail.jsx
│   │   └── ProjectForm.jsx
│   ├── Tenders/
│   │   ├── TenderList.jsx
│   │   ├── TenderDetail.jsx
│   │   └── TenderForm.jsx
│   ├── Reports.jsx
│   └── Settings.jsx
├── store/
│   ├── index.js
│   └── slices/
│       ├── projectsSlice.js
│       └── tendersSlice.js
├── data/
│   └── mockData.js
├── App.jsx
├── main.jsx
└── index.css
```

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

The application will be available at `http://localhost:3000`

## Usage

### Navigation
- Use the sidebar to navigate between different modules
- Click on project/tender names to view details
- Use breadcrumbs to navigate back

### Managing Projects
1. Go to **Projects** from the sidebar
2. Click **New Project** to create a project
3. Fill in the form and submit
4. View, edit, or delete projects from the list

### Managing Tenders
1. Go to **Tender Packages** from the sidebar
2. Click **New Tender Package** to create a tender
3. Select the parent project and fill in details
4. Track progress and status

### Dashboard
- View summary statistics
- Analyze data with interactive charts
- Monitor recent activity

## Mock Data

The application comes with pre-populated mock data including:
- 6 sample projects
- 8 sample tender packages
- Various statuses and progress levels

All data is stored in Redux state and persists during the session.

## Authentication & Authorization

Hệ thống đã được tích hợp đầy đủ phân quyền với 4 roles:
- **Admin**: Full access
- **Manager**: Manage projects & tenders
- **Editor**: Create & edit (no delete)
- **Viewer**: Read-only access

Xem chi tiết trong [AUTHENTICATION.md](./AUTHENTICATION.md)

### Quick Login
- Admin: `admin/admin123`
- Manager: `manager/manager123`
- Editor: `editor/editor123`
- Viewer: `viewer/viewer123`

## Features Not Implemented

- Backend API integration
- Real-time updates
- File uploads
- Advanced reporting
- Export functionality

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Responsive Design

- Desktop-first design
- Tablet support (768px+)
- Mobile-friendly navigation

## License

This project is for demonstration purposes.

## Notes

- All data is stored in Redux state (no backend)
- Changes persist only during the session
- Refresh will reset to initial mock data
- No authentication is implemented