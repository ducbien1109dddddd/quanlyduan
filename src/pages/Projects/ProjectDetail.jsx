import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Descriptions, Tag, Progress, Button, Table, Space } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { setSelectedProject } from '../../store/slices/projectsSlice';
import { formatCurrency, getStatusColor } from '../../data/mockData';
import WithPermission from '../../components/Common/WithPermission';
import { PERMISSIONS } from '../../data/mockUsers';
import DeadlineAlert from '../../components/Common/DeadlineAlert';
import DeadlineBadge from '../../components/Common/DeadlineBadge';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects);
  const tenders = useSelector((state) => state.tenders.tenders);
  const project = projects.find((p) => p.id === id);

  useEffect(() => {
    if (project) {
      dispatch(setSelectedProject(project));
    }
  }, [project, dispatch]);

  if (!project) {
    return <div>Project not found</div>;
  }

  const relatedTenders = tenders.filter((t) => t.projectId === project.id);

  const tenderColumns = [
    {
      title: 'Tender Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tender Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Contractor',
      dataIndex: 'contractor',
      key: 'contractor',
    },
    {
      title: 'Contract Value',
      dataIndex: 'contractValue',
      key: 'contractValue',
      render: (value) => formatCurrency(value),
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
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => <Progress percent={progress} size="small" />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/tenders/${record.id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="project-detail">
      <div className="detail-header">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/projects')}
        >
          Back to List
        </Button>
        <WithPermission permission={PERMISSIONS.PROJECTS_EDIT}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/projects/edit/${project.id}`)}
          >
            Edit Project
          </Button>
        </WithPermission>
      </div>

      <Card title="Project Information" className="detail-card">
        <DeadlineAlert endDate={project.endDate} progress={project.progress} type="project" />
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Project Code">{project.code}</Descriptions.Item>
          <Descriptions.Item label="Project Name">{project.name}</Descriptions.Item>
          <Descriptions.Item label="Investor">{project.investor}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(project.status)}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Project Type">
            {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
          </Descriptions.Item>
          <Descriptions.Item label="Total Budget">
            {formatCurrency(project.totalBudget)}
          </Descriptions.Item>
          <Descriptions.Item label="Disbursed Budget">
            {formatCurrency(project.disbursedBudget)}
          </Descriptions.Item>
          <Descriptions.Item label="Budget Utilization">
            <Progress
              percent={Math.round((project.disbursedBudget / project.totalBudget) * 100)}
              status="active"
            />
          </Descriptions.Item>
          <Descriptions.Item label="Start Date">{project.startDate}</Descriptions.Item>
          <Descriptions.Item label="End Date">
            <Space>
              {project.endDate}
              <DeadlineBadge endDate={project.endDate} progress={project.progress} />
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Overall Progress" span={2}>
            <Progress percent={project.progress} status="active" />
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>
            {project.description}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Timeline & Progress" className="detail-card">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <strong>Start Date:</strong> {project.startDate}
          </div>
          <Progress
            percent={project.progress}
            status={project.progress === 100 ? 'success' : 'active'}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
          <div>
            <strong>End Date:</strong> {project.endDate}
          </div>
        </Space>
      </Card>

      <Card title="Related Tender Packages" className="detail-card">
        <Table
          columns={tenderColumns}
          dataSource={relatedTenders}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default ProjectDetail;