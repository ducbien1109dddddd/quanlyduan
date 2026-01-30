import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';
import { HomeOutlined, LockOutlined } from '@ant-design/icons';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Result
        icon={<LockOutlined style={{ color: '#ff4d4f' }} />}
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" icon={<HomeOutlined />} onClick={() => navigate('/')}>
            Go Home
          </Button>
        }
      />
    </div>
  );
};

export default Unauthorized;