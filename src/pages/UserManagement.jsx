import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Button, Space, Tag, Popconfirm, message, Modal, Form, Select, Checkbox, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { updateUserPermissionsAsync, deleteUserAsync, setUsers } from '../store/slices/authSlice';
import { subscribeToUsers } from '../services/firebaseService';
import { PERMISSIONS, ROLES } from '../data/mockUsers';
import './UserManagement.css';

const { Option } = Select;
const { Text } = Typography;

const UserManagement = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.auth.users);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  // Subscribe to real-time updates from Firebase
  useEffect(() => {
    const unsubscribe = subscribeToUsers((users) => {
      // Update users in Redux store
      dispatch(setUsers(users));
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch]);

  // Filter out current user from delete options (can't delete yourself)
  const manageableUsers = useMemo(() => {
    return users.filter((u) => u.id !== currentUser?.id);
  }, [users, currentUser]);

  const handleEditPermissions = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      role: user.role,
      permissions: user.permissions || [],
    });
    setEditModalVisible(true);
  };

  const handleDelete = async (userId) => {
    const result = await dispatch(deleteUserAsync(userId));
    if (deleteUserAsync.fulfilled.match(result)) {
      message.success('User deleted successfully');
    } else {
      message.error('Failed to delete user');
    }
  };

  const handleSavePermissions = () => {
    form.validateFields().then(async (values) => {
      const result = await dispatch(updateUserPermissionsAsync({
        userId: selectedUser.id,
        role: values.role,
        permissions: values.permissions,
      }));
      
      if (updateUserPermissionsAsync.fulfilled.match(result)) {
        message.success('User permissions updated successfully');
        setEditModalVisible(false);
        form.resetFields();
      } else {
        message.error('Failed to update permissions');
      }
    });
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

  const allPermissions = [
    { value: PERMISSIONS.PROJECTS_VIEW, label: 'View Projects' },
    { value: PERMISSIONS.PROJECTS_CREATE, label: 'Create Projects' },
    { value: PERMISSIONS.PROJECTS_EDIT, label: 'Edit Projects' },
    { value: PERMISSIONS.PROJECTS_DELETE, label: 'Delete Projects' },
    { value: PERMISSIONS.TENDERS_VIEW, label: 'View Tenders' },
    { value: PERMISSIONS.TENDERS_CREATE, label: 'Create Tenders' },
    { value: PERMISSIONS.TENDERS_EDIT, label: 'Edit Tenders' },
    { value: PERMISSIONS.TENDERS_DELETE, label: 'Delete Tenders' },
    { value: PERMISSIONS.DASHBOARD_VIEW, label: 'View Dashboard' },
    { value: PERMISSIONS.REPORTS_VIEW, label: 'View Reports' },
    { value: PERMISSIONS.SETTINGS_VIEW, label: 'View Settings' },
    { value: PERMISSIONS.SETTINGS_EDIT, label: 'Edit Settings' },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={getRoleColor(role)}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => {
        if (permissions?.includes('all')) {
          return <Tag color="red">ALL PERMISSIONS</Tag>;
        }
        return <span>{permissions?.length || 0} permissions</span>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditPermissions(record)}
          >
            Edit Permissions
          </Button>
          {record.id !== currentUser?.id && (
            <Popconfirm
              title="Are you sure you want to delete this user?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="user-management">
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        <Text type="secondary">Manage user accounts and permissions</Text>
      </div>

      <Table
        columns={columns}
        dataSource={manageableUsers}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} users`,
        }}
      />

      <Modal
        title="Edit User Permissions"
        open={editModalVisible}
        onOk={handleSavePermissions}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
        width={600}
        okText="Save"
        cancelText="Cancel"
      >
        {selectedUser && (
          <div style={{ marginBottom: 16 }}>
            <p><strong>User:</strong> {selectedUser.name} ({selectedUser.username})</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
          </div>
        )}

        <Form form={form} layout="vertical">
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select>
              <Option value={ROLES.ADMIN}>Admin (Full Access)</Option>
              <Option value={ROLES.MANAGER}>Manager (Projects & Tenders)</Option>
              <Option value={ROLES.EDITOR}>Editor (Create & Edit)</Option>
              <Option value={ROLES.VIEWER}>Viewer (Read Only)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="permissions"
            label="Permissions"
            rules={[{ required: true, message: 'Please select at least one permission!' }]}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {allPermissions.map((perm) => (
                  <Checkbox key={perm.value} value={perm.value}>
                    {perm.label}
                  </Checkbox>
                ))}
                <Checkbox value={PERMISSIONS.ALL}>
                  <Tag color="red">ALL PERMISSIONS (Admin only)</Tag>
                </Checkbox>
              </Space>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;