import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Card, Statistic, Table, Tag, Alert, Space } from 'antd';
import {
  ProjectOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  BankOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency, getStatusColor } from '../data/mockData';
import { checkDeadlineStatus, isAtRisk } from '../utils/deadlineUtils';
import './Dashboard.css';

const Dashboard = () => {
  const projects = useSelector((state) => state.projects.projects);
  const tenders = useSelector((state) => state.tenders.tenders);

  const statistics = useMemo(() => {
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalBudget = projects.reduce((sum, p) => sum + p.totalBudget, 0);
    const disbursedBudget = projects.reduce((sum, p) => sum + p.disbursedBudget, 0);

    return {
      totalProjects: projects.length,
      totalTenders: tenders.length,
      activeProjects,
      completedProjects,
      totalBudget,
      disbursedBudget,
    };
  }, [projects, tenders]);

  // Chart data: Project count by status
  const projectStatusData = useMemo(() => {
    const statusCount = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(statusCount).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
    }));
  }, [projects]);

  // Chart data: Budget distribution by project type
  const budgetDistributionData = useMemo(() => {
    const typeBudget = projects.reduce((acc, project) => {
      acc[project.type] = (acc[project.type] || 0) + project.totalBudget;
      return acc;
    }, {});
    
    return Object.entries(typeBudget).map(([type, budget]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      budget: budget / 1000000000, // Convert to billions
    }));
  }, [projects]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Chart data: Project progress over time (last 6 months)
  const progressOverTimeData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => {
      const monthProjects = projects.filter(p => {
        const startDate = new Date(p.startDate);
        return startDate.getMonth() <= index;
      });
      const avgProgress = monthProjects.length > 0
        ? monthProjects.reduce((sum, p) => sum + p.progress, 0) / monthProjects.length
        : 0;
      return {
        month,
        progress: Math.round(avgProgress),
      };
    });
  }, [projects]);

  // Recent activity table data
  const recentActivityData = useMemo(() => {
    return projects
      .slice()
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      .slice(0, 5)
      .map((project) => {
        const projectTenders = tenders.filter(t => t.projectId === project.id);
        const deadlineStatus = checkDeadlineStatus(project.endDate, project.progress);
        return {
          key: project.id,
          projectName: project.name,
          tenderPackage: projectTenders.length > 0 ? projectTenders[0].name : 'N/A',
          status: project.status,
          startDate: project.startDate,
          endDate: project.endDate,
          deadlineStatus,
        };
      });
  }, [projects, tenders]);

  // Calculate at-risk items
  const atRiskItems = useMemo(() => {
    const atRiskProjects = projects.filter(p => {
      if (!p.endDate || p.status === 'completed' || p.status === 'cancelled') return false;
      const deadlineStatus = checkDeadlineStatus(p.endDate, p.progress);
      return deadlineStatus.isOverdue || deadlineStatus.status === 'warning';
    });

    const atRiskTenders = tenders.filter(t => {
      if (!t.endDate || t.status === 'completed' || t.status === 'cancelled') return false;
      const deadlineStatus = checkDeadlineStatus(t.endDate, t.progress || 0);
      return deadlineStatus.isOverdue || deadlineStatus.status === 'warning';
    });

    return {
      projects: atRiskProjects,
      tenders: atRiskTenders,
      total: atRiskProjects.length + atRiskTenders.length,
    };
  }, [projects, tenders]);

  const recentActivityColumns = [
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: 'Tender Package',
      dataIndex: 'tenderPackage',
      key: 'tenderPackage',
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
    },
    {
      title: 'Deadline Status',
      dataIndex: 'deadlineStatus',
      key: 'deadlineStatus',
      render: (deadlineStatus) => {
        if (!deadlineStatus) return '-';
        if (deadlineStatus.isOverdue) {
          return <Tag color="red">Trễ {deadlineStatus.daysOverdue} ngày</Tag>;
        }
        if (deadlineStatus.status === 'warning') {
          return <Tag color="orange">Còn {deadlineStatus.daysRemaining} ngày</Tag>;
        }
        return <Tag color="green">Còn {deadlineStatus.daysRemaining} ngày</Tag>;
      },
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
  ];

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>

      {/* Deadline Alerts */}
      {atRiskItems.total > 0 && (
        <Alert
          message={
            <Space>
              <ExclamationCircleOutlined />
              <strong>Cảnh báo Deadline</strong>
            </Space>
          }
          description={
            <span>
              Có <strong>{atRiskItems.projects.length}</strong> dự án và <strong>{atRiskItems.tenders.length}</strong> gói thầu 
              đang trễ deadline hoặc có nguy cơ trễ. Vui lòng kiểm tra và xử lý kịp thời.
            </span>
          }
          type="warning"
          showIcon
          closable
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Summary Cards */}
      <Row gutter={[16, 16]} className="summary-cards">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Projects"
              value={statistics.totalProjects}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Tender Packages"
              value={statistics.totalTenders}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Projects"
              value={statistics.activeProjects}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completed Projects"
              value={statistics.completedProjects}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Budget"
              value={formatCurrency(statistics.totalBudget)}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Disbursed Budget"
              value={formatCurrency(statistics.disbursedBudget)}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} className="charts-row">
        <Col xs={24} lg={12}>
          <Card title="Project Count by Status" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Budget Distribution by Project Type" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={budgetDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, budget }) => `${type}: ${budget.toFixed(1)}B`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="budget"
                >
                  {budgetDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24}>
          <Card title="Project Progress Over Time" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="progress"
                  stroke="#1890ff"
                  strokeWidth={2}
                  name="Average Progress (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Table */}
      <Card title="Recent Activity" className="recent-activity-card">
        <Table
          columns={recentActivityColumns}
          dataSource={recentActivityData}
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default Dashboard;