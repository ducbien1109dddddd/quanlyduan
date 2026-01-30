import React from 'react';
import { Alert } from 'antd';
import { ExclamationCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { checkDeadlineStatus } from '../../utils/deadlineUtils';

const DeadlineAlert = ({ endDate, progress, type = 'project' }) => {
  if (!endDate) return null;

  const deadlineStatus = checkDeadlineStatus(endDate, progress);

  if (deadlineStatus.status === 'on-time') {
    return null; // Don't show alert if on time
  }

  const typeText = type === 'project' ? 'dự án' : 'gói thầu';

  if (deadlineStatus.isOverdue) {
    return (
      <Alert
        message={
          <span>
            <ExclamationCircleOutlined style={{ marginRight: 8 }} />
            <strong>{typeText.charAt(0).toUpperCase() + typeText.slice(1)} đã trễ deadline!</strong>
          </span>
        }
        description={`${typeText.charAt(0).toUpperCase() + typeText.slice(1)} đã trễ ${deadlineStatus.daysOverdue} ngày so với thời gian dự kiến hoàn thành.`}
        type="error"
        showIcon
        style={{ marginBottom: 16 }}
      />
    );
  }

  if (deadlineStatus.status === 'warning') {
    return (
      <Alert
        message={
          <span>
            <ClockCircleOutlined style={{ marginRight: 8 }} />
            <strong>Cảnh báo deadline</strong>
          </span>
        }
        description={`${typeText.charAt(0).toUpperCase() + typeText.slice(1)} còn ${deadlineStatus.daysRemaining} ngày nữa đến deadline. Vui lòng kiểm tra tiến độ.`}
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />
    );
  }

  return null;
};

export default DeadlineAlert;