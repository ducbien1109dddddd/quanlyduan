import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { login } from '../store/slices/authSlice';
import './Login.css';

const { Title, Text } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.auth.users);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Check if user exists
      const user = users.find(
        (u) => u.username === values.username && u.password === values.password
      );
      
      if (user) {
        dispatch(login(values));
        message.success('Login successful!');
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        message.error('Invalid username or password');
      }
    } catch (error) {
      message.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <Title level={2}>Project & Tender Management</Title>
          <Text type="secondary">Sign in to your account</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              icon={<LoginOutlined />}
              loading={loading}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div className="login-footer">
          <Text type="secondary" style={{ fontSize: 12 }}>
            Demo credentials: admin/admin123, manager/manager123, editor/editor123, viewer/viewer123
          </Text>
          <div style={{ marginTop: 12 }}>
            <Text>
              Don't have an account? <Link to="/register">Sign up</Link>
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;