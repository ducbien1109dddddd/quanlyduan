import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Input, Space, Tag, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { deleteProject } from '../../store/slices/projectsSlice';
import { formatCurrency, getStatusColor } from '../../data/mockData';
import WithPermission from '../../components/Common/WithPermission';
import { PERMISSIONS } from '../../data/mockUsers';
import './ProjectList.css';

const { Search } = Input;

const ProjectList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.code.toLowerCase().includes(searchText.toLowerCase()) ||
        project.name.toLowerCase().includes(searchText.toLowerCase()) ||
        project.investor.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter ? project.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchText, statusFilter]);

  const handleDelete = (id) => {
    dispatch(deleteProject(id));
    message.success('Project deleted successfully');
  };

  const columns = [
    {
      title: 'Project Code',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Investor',
      dataIndex: 'investor',
      key: 'investor',
    },
    {
      title: 'Total Budget',
      dataIndex: 'totalBudget',
      key: 'totalBudget',
      render: (budget) => formatCurrency(budget),
      sorter: (a, b) => a.totalBudget - b.totalBudget,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Completed', value: 'completed' },
        { text: 'Planning', value: 'planning' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <WithPermission permission={PERMISSIONS.PROJECTS_VIEW}>
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/projects/${record.id}`)}
            >
              View
            </Button>
          </WithPermission>
          <WithPermission permission={PERMISSIONS.PROJECTS_EDIT}>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => navigate(`/projects/edit/${record.id}`)}
            >
              Edit
            </Button>
          </WithPermission>
          <WithPermission permission={PERMISSIONS.PROJECTS_DELETE}>
            <Popconfirm
              title="Are you sure you want to delete this project?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </WithPermission>
        </Space>
      ),
    },
  ];

  return (
    <div className="project-list">
      <div className="page-header">
        <h1 className="page-title">Project Management</h1>
        <WithPermission permission={PERMISSIONS.PROJECTS_CREATE}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/projects/new')}
          >
            New Project
          </Button>
        </WithPermission>
      </div>

      <div className="filters">
        <Search
          placeholder="Search by code, name, or investor"
          allowClear
          enterButton
          style={{ width: 400 }}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={setSearchText}
        />
        <Space>
          <Button
            type={statusFilter === null ? 'primary' : 'default'}
            onClick={() => setStatusFilter(null)}
          >
            All
          </Button>
          <Button
            type={statusFilter === 'active' ? 'primary' : 'default'}
            onClick={() => setStatusFilter('active')}
          >
            Active
          </Button>
          <Button
            type={statusFilter === 'completed' ? 'primary' : 'default'}
            onClick={() => setStatusFilter('completed')}
          >
            Completed
          </Button>
          <Button
            type={statusFilter === 'planning' ? 'primary' : 'default'}
            onClick={() => setStatusFilter('planning')}
          >
            Planning
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredProjects}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} projects`,
        }}
      />
    </div>
  );
};

export default ProjectList;