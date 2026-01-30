import React from 'react';
import { Tag } from 'antd';
import { ExclamationCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { checkDeadlineStatus } from '../../utils/deadlineUtils';

const DeadlineBadge = ({ endDate, progress }) => {
  if (!endDate) return null;

  const deadlineStatus = checkDeadlineStatus(endDate, progress);

  if (deadlineStatus.isOverdue) {
    return (
      <Tag color="red" icon={<ExclamationCircleOutlined />}>
        Trễ {deadlineStatus.daysOverdue} ngày
      </Tag>
    );
  }

  if (deadlineStatus.status === 'warning') {
    return (
      <Tag color="orange" icon={<ClockCircleOutlined />}>
        Còn {deadlineStatus.daysRemaining} ngày
      </Tag>
    );
  }

  return (
    <Tag color="green">
      Còn {deadlineStatus.daysRemaining} ngày
    </Tag>
  );
};

export default DeadlineBadge;