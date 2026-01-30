import dayjs from 'dayjs';

/**
 * Check deadline status
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {number} progress - Current progress percentage (0-100)
 * @returns {object} - { status: 'overdue' | 'warning' | 'on-time', daysRemaining, daysOverdue }
 */
export const checkDeadlineStatus = (endDate, progress = 0) => {
  if (!endDate) return { status: 'unknown', daysRemaining: null, daysOverdue: null };

  const today = dayjs();
  const deadline = dayjs(endDate);
  const daysDiff = deadline.diff(today, 'day');

  // If deadline has passed
  if (daysDiff < 0) {
    return {
      status: 'overdue',
      daysRemaining: 0,
      daysOverdue: Math.abs(daysDiff),
      isOverdue: true,
    };
  }

  // If deadline is within 7 days (warning)
  if (daysDiff <= 7) {
    return {
      status: 'warning',
      daysRemaining: daysDiff,
      daysOverdue: 0,
      isOverdue: false,
    };
  }

  // On time
  return {
    status: 'on-time',
    daysRemaining: daysDiff,
    daysOverdue: 0,
    isOverdue: false,
  };
};

/**
 * Get deadline status color
 */
export const getDeadlineStatusColor = (status) => {
  const colors = {
    overdue: 'red',
    warning: 'orange',
    'on-time': 'green',
    unknown: 'default',
  };
  return colors[status] || 'default';
};

/**
 * Get deadline status text
 */
export const getDeadlineStatusText = (deadlineStatus) => {
  if (deadlineStatus.isOverdue) {
    return `Trễ ${deadlineStatus.daysOverdue} ngày`;
  }
  if (deadlineStatus.status === 'warning') {
    return `Còn ${deadlineStatus.daysRemaining} ngày`;
  }
  if (deadlineStatus.status === 'on-time') {
    return `Còn ${deadlineStatus.daysRemaining} ngày`;
  }
  return 'Chưa xác định';
};

/**
 * Check if project/tender is at risk based on progress and deadline
 */
export const isAtRisk = (endDate, progress, startDate) => {
  if (!endDate || !startDate) return false;

  const deadlineStatus = checkDeadlineStatus(endDate, progress);
  const today = dayjs();
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const totalDays = end.diff(start, 'day');
  const elapsedDays = today.diff(start, 'day');
  
  // Expected progress based on time elapsed
  const expectedProgress = totalDays > 0 ? (elapsedDays / totalDays) * 100 : 0;
  
  // At risk if: overdue OR (warning AND progress is behind expected)
  return deadlineStatus.isOverdue || 
         (deadlineStatus.status === 'warning' && progress < expectedProgress - 10);
};