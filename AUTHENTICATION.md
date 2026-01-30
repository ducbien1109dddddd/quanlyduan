# Hệ thống Phân quyền Tài khoản

## Tổng quan

Hệ thống quản lý dự án và gói thầu đã được tích hợp hệ thống phân quyền đầy đủ với các role và permission-based access control.

## Các Role (Vai trò)

### 1. Admin
- **Username**: `admin`
- **Password**: `admin123`
- **Quyền**: Tất cả quyền (full access)
- **Mô tả**: Quản trị viên có quyền truy cập và thao tác tất cả các tính năng trong hệ thống

### 2. Manager
- **Username**: `manager`
- **Password**: `manager123`
- **Quyền**: 
  - Xem, tạo, sửa, xóa Projects
  - Xem, tạo, sửa, xóa Tenders
  - Xem Dashboard và Reports
- **Mô tả**: Quản lý dự án có quyền quản lý đầy đủ projects và tenders

### 3. Editor
- **Username**: `editor`
- **Password**: `editor123`
- **Quyền**:
  - Xem, tạo, sửa Projects (không được xóa)
  - Xem, tạo, sửa Tenders (không được xóa)
  - Xem Dashboard và Reports
- **Mô tả**: Biên tập viên có quyền tạo và chỉnh sửa nhưng không được xóa

### 4. Viewer
- **Username**: `viewer`
- **Password**: `viewer123`
- **Quyền**:
  - Chỉ xem Projects
  - Chỉ xem Tenders
  - Xem Dashboard và Reports
- **Mô tả**: Người xem chỉ có quyền đọc, không thể tạo, sửa hoặc xóa

## Permissions (Quyền)

### Projects Permissions
- `projects.view` - Xem danh sách và chi tiết projects
- `projects.create` - Tạo project mới
- `projects.edit` - Chỉnh sửa project
- `projects.delete` - Xóa project

### Tenders Permissions
- `tenders.view` - Xem danh sách và chi tiết tenders
- `tenders.create` - Tạo tender mới
- `tenders.edit` - Chỉnh sửa tender
- `tenders.delete` - Xóa tender

### System Permissions
- `dashboard.view` - Xem dashboard
- `reports.view` - Xem reports
- `settings.view` - Xem settings
- `settings.edit` - Chỉnh sửa settings
- `all` - Tất cả quyền (chỉ dành cho Admin)

## Cách sử dụng

### 1. Đăng nhập
- Truy cập `/login`
- Nhập username và password
- Hoặc sử dụng Quick Login buttons để đăng nhập nhanh

### 2. Protected Routes
Tất cả các routes đều được bảo vệ bởi `ProtectedRoute` component:
- Tự động redirect về `/login` nếu chưa đăng nhập
- Kiểm tra permissions trước khi cho phép truy cập
- Redirect về `/unauthorized` nếu không có quyền

### 3. UI Components với Permissions

#### WithPermission Component
```jsx
import WithPermission from '../components/Common/WithPermission';
import { PERMISSIONS } from '../data/mockUsers';

<WithPermission permission={PERMISSIONS.PROJECTS_CREATE}>
  <Button>New Project</Button>
</WithPermission>
```

#### WithRole Component
```jsx
import WithRole from '../components/Common/WithRole';
import { ROLES } from '../data/mockUsers';

<WithRole allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
  <Button>Admin Only</Button>
</WithRole>
```

## Cấu trúc Code

### Redux Store
- `src/store/slices/authSlice.js` - Quản lý authentication state
- Selectors: `selectCurrentUser`, `selectIsAuthenticated`, `selectUserPermissions`, `selectUserRole`

### Components
- `src/components/Auth/ProtectedRoute.jsx` - Route guard component
- `src/components/Common/WithPermission.jsx` - Permission-based UI wrapper
- `src/components/Common/WithRole.jsx` - Role-based UI wrapper

### Pages
- `src/pages/Login.jsx` - Trang đăng nhập
- `src/pages/Unauthorized.jsx` - Trang lỗi 403

### Data
- `src/data/mockUsers.js` - Mock users và permission definitions

## Bảo mật

### Lưu ý
- **Đây là frontend-only authentication** - chỉ phù hợp cho demo
- Trong production, cần:
  - Backend API với JWT tokens
  - Server-side permission validation
  - HTTPS encryption
  - Session management
  - Password hashing (bcrypt)

### LocalStorage
- User info được lưu trong localStorage
- Tự động logout khi clear localStorage
- Không lưu password trong localStorage

## Testing Permissions

### Test Admin
1. Login với `admin/admin123`
2. Kiểm tra có thể truy cập tất cả pages
3. Kiểm tra tất cả buttons đều hiển thị

### Test Manager
1. Login với `manager/manager123`
2. Kiểm tra có thể tạo, sửa, xóa projects và tenders
3. Kiểm tra không thể truy cập Settings (nếu không có permission)

### Test Editor
1. Login với `editor/editor123`
2. Kiểm tra có thể tạo, sửa nhưng không thể xóa
3. Kiểm tra nút Delete không hiển thị

### Test Viewer
1. Login với `viewer/viewer123`
2. Kiểm tra chỉ có thể xem, không thể tạo/sửa/xóa
3. Kiểm tra các nút Create/Edit/Delete không hiển thị

## Thêm User mới

Để thêm user mới, chỉnh sửa `src/data/mockUsers.js`:

```javascript
{
  id: '5',
  username: 'newuser',
  password: 'password123',
  name: 'New User',
  email: 'newuser@ptms.gov.vn',
  role: 'editor',
  permissions: [
    'projects.view',
    'projects.create',
    'tenders.view',
  ],
}
```

## Thêm Permission mới

1. Thêm vào `PERMISSIONS` object trong `src/data/mockUsers.js`
2. Gán permission cho các role cần thiết
3. Sử dụng `WithPermission` component trong UI
4. Thêm vào `ProtectedRoute` nếu cần bảo vệ route