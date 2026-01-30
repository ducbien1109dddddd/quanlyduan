import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Descriptions, Tag, Progress, Button } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { setSelectedTender } from '../../store/slices/tendersSlice';
import { formatCurrency, getStatusColor } from '../../data/mockData';
import WithPermission from '../../components/Common/WithPermission';
import { PERMISSIONS } from '../../data/mockUsers';
import './TenderDetail.css';

const TenderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tenders = useSelector((state) => state.tenders.tenders);
  const projects = useSelector((state) => state.projects.projects);
  const tender = tenders.find((t) => t.id === id);
  const project = tender ? projects.find((p) => p.id === tender.projectId) : null;

  useEffect(() => {
    if (tender) {
      dispatch(setSelectedTender(tender));
    }
  }, [tender, dispatch]);

  if (!tender) {
    return <div>Tender package not found</div>;
  }

  return (
    <div className="tender-detail">
      <div className="detail-header">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/tenders')}
        >
          Back to List
        </Button>
        <WithPermission permission={PERMISSIONS.TENDERS_EDIT}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/tenders/edit/${tender.id}`)}
          >
            Edit Tender Package
          </Button>
        </WithPermission>
      </div>

      <Card title="Tender Package Information" className="detail-card">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Tender Code">{tender.code}</Descriptions.Item>
          <Descriptions.Item label="Tender Name">{tender.name}</Descriptions.Item>
          <Descriptions.Item label="Project">
            {project ? (
              <Button
                type="link"
                onClick={() => navigate(`/projects/${tender.projectId}`)}
              >
                {tender.projectName}
              </Button>
            ) : (
              tender.projectName
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(tender.status)}>
              {tender.status.charAt(0).toUpperCase() + tender.status.slice(1).replace('-', ' ')}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Contractor">{tender.contractor}</Descriptions.Item>
          <Descriptions.Item label="Bid Value">
            {formatCurrency(tender.bidValue)}
          </Descriptions.Item>
          <Descriptions.Item label="Contract Value">
            {formatCurrency(tender.contractValue)}
          </Descriptions.Item>
          <Descriptions.Item label="Start Date">{tender.startDate}</Descriptions.Item>
          <Descriptions.Item label="End Date">{tender.endDate}</Descriptions.Item>
          <Descriptions.Item label="Implementation Progress" span={2}>
            <Progress percent={tender.progress} status="active" />
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>
            {tender.description}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Implementation Progress" className="detail-card">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <strong>Start Date:</strong> {tender.startDate}
          </div>
          <Progress
            percent={tender.progress}
            status={tender.progress === 100 ? 'success' : 'active'}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
          <div>
            <strong>End Date:</strong> {tender.endDate}
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default TenderDetail;