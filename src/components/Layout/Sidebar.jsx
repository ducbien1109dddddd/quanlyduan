import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ProjectOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import './Sidebar.css';

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isAdmin = currentUser?.role === 'admin';

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: 'Projects',
    },
    {
      key: '/tenders',
      icon: <FileTextOutlined />,
      label: 'Tender Packages',
    },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
    },
    ...(isAdmin ? [{
      key: '/users',
      icon: <UsergroupAddOutlined />,
      label: 'User Management',
    }] : []),
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const selectedKey = location.pathname === '/' 
    ? '/' 
    : '/' + location.pathname.split('/')[1];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      className="sidebar"
      theme="light"
    >
      <div className="sidebar-logo">
        {!collapsed ? (
          <h2>PTMS</h2>
        ) : (
          <h2>P</h2>
        )}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={handleMenuClick}
        className="sidebar-menu"
      />
    </Sider>
  );
};

export default Sidebar;