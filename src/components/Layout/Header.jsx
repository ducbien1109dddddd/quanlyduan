import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Button, Badge, Dropdown, Avatar, Breadcrumb, Tag } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout, selectCurrentUser } from '../../store/slices/authSlice';
import './Header.css';

const { Header: AntHeader } = Layout;

const Header = ({ collapsed, setCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector(selectCurrentUser);

  const getBreadcrumbItems = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const items = [{ title: 'Home' }];
    
    if (paths.length === 0) {
      return [{ title: 'Dashboard' }];
    }

    paths.forEach((path, index) => {
      const isLast = index === paths.length - 1;
      const title = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      items.push({
        title: isLast ? (
          <span style={{ fontWeight: 600 }}>{title}</span>
        ) : (
          title
        ),
      });
    });

    return items;
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      dispatch(logout());
      navigate('/login');
    } else if (key === 'profile') {
      // Navigate to profile page (if exists)
      console.log('Profile clicked');
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'red',
      manager: 'blue',
      editor: 'green',
      viewer: 'orange',
    };
    return colors[role] || 'default';
  };

  return (
    <AntHeader className="main-header">
      <div className="header-left">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="trigger"
        />
        <Breadcrumb items={getBreadcrumbItems()} />
      </div>
      <div className="header-right">
        <Badge count={5} size="small">
          <Button
            type="text"
            icon={<BellOutlined />}
            className="notification-btn"
          />
        </Badge>
        <Dropdown
          menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
          placement="bottomRight"
        >
          <div className="user-info">
            <Avatar icon={<UserOutlined />} />
            <div className="user-details">
              <span className="username">{currentUser?.name || 'User'}</span>
              {currentUser?.role && (
                <Tag color={getRoleColor(currentUser.role)} style={{ marginLeft: 8, fontSize: 11 }}>
                  {currentUser.role.toUpperCase()}
                </Tag>
              )}
            </div>
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;