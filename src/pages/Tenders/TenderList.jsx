import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Input, Space, Tag, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { deleteTender } from '../../store/slices/tendersSlice';
import { formatCurrency, getStatusColor } from '../../data/mockData';
import WithPermission from '../../components/Common/WithPermission';
import { PERMISSIONS } from '../../data/mockUsers';
import DeadlineBadge from '../../components/Common/DeadlineBadge';
import './TenderList.css';

const { Search } = Input;

const TenderList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tenders = useSelector((state) => state.tenders.tenders);
  const projects = useSelector((state) => state.projects.projects);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);

  const tendersWithProjectNames = useMemo(() => {
    return tenders.map((tender) => {
      const project = projects.find((p) => p.id === tender.projectId);
      return {
        ...tender,
        projectName: project ? project.name : 'N/A',
      };
    });
  }, [tenders, projects]);

  const filteredTenders = useMemo(() => {
    return tendersWithProjectNames.filter((tender) => {
      const matchesSearch =
        tender.code.toLowerCase().includes(searchText.toLowerCase()) ||
        tender.name.toLowerCase().includes(searchText.toLowerCase()) ||
        tender.contractor.toLowerCase().includes(searchText.toLowerCase()) ||
        tender.projectName.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter ? tender.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [tendersWithProjectNames, searchText, statusFilter]);

  const handleDelete = (id) => {
    dispatch(deleteTender(id));
    message.success('Tender package deleted successfully');
  };

  const columns = [
    {
      title: 'Tender Code',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: 'Tender Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Project',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: 'Contractor',
      dataIndex: 'contractor',
      key: 'contractor',
    },
    {
      title: 'Bid Value',
      dataIndex: 'bidValue',
      key: 'bidValue',
      render: (value) => formatCurrency(value),
      sorter: (a, b) => a.bidValue - b.bidValue,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
        </Tag>
      ),
      filters: [
        { text: 'Awarded', value: 'awarded' },
        { text: 'In Progress', value: 'in-progress' },
        { text: 'Completed', value: 'completed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Deadline',
      key: 'deadline',
      render: (_, record) => (
        <DeadlineBadge endDate={record.endDate} progress={record.progress} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <WithPermission permission={PERMISSIONS.TENDERS_VIEW}>
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/tenders/${record.id}`)}
            >
              View
            </Button>
          </WithPermission>
          <WithPermission permission={PERMISSIONS.TENDERS_EDIT}>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => navigate(`/tenders/edit/${record.id}`)}
            >
              Edit
            </Button>
          </WithPermission>
          <WithPermission permission={PERMISSIONS.TENDERS_DELETE}>
            <Popconfirm
              title="Are you sure you want to delete this tender package?"
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
    <div className="tender-list">
      <div className="page-header">
        <h1 className="page-title">Tender Package Management</h1>
        <WithPermission permission={PERMISSIONS.TENDERS_CREATE}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/tenders/new')}
          >
            New Tender Package
          </Button>
        </WithPermission>
      </div>

      <div className="filters">
        <Search
          placeholder="Search by code, name, contractor, or project"
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
            type={statusFilter === 'awarded' ? 'primary' : 'default'}
            onClick={() => setStatusFilter('awarded')}
          >
            Awarded
          </Button>
          <Button
            type={statusFilter === 'in-progress' ? 'primary' : 'default'}
            onClick={() => setStatusFilter('in-progress')}
          >
            In Progress
          </Button>
          <Button
            type={statusFilter === 'completed' ? 'primary' : 'default'}
            onClick={() => setStatusFilter('completed')}
          >
            Completed
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredTenders}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} tender packages`,
        }}
      />
    </div>
  );
};

export default TenderList;