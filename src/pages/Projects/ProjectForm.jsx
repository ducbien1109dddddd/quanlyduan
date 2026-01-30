import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, InputNumber, Select, DatePicker, Button, Card, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { addProject, updateProject } from '../../store/slices/projectsSlice';
import dayjs from 'dayjs';
import './ProjectForm.css';

const { TextArea } = Input;
const { Option } = Select;

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects);
  const [form] = Form.useForm();
  const isEdit = !!id;
  const project = isEdit ? projects.find((p) => p.id === id) : null;

  useEffect(() => {
    if (project) {
      form.setFieldsValue({
        ...project,
        startDate: dayjs(project.startDate),
        endDate: dayjs(project.endDate),
      });
    }
  }, [project, form]);

  const onFinish = (values) => {
    const projectData = {
      ...values,
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: values.endDate.format('YYYY-MM-DD'),
      progress: values.progress || 0,
      disbursedBudget: values.disbursedBudget || 0,
    };

    if (isEdit) {
      dispatch(updateProject({ ...projectData, id }));
      message.success('Project updated successfully');
    } else {
      dispatch(addProject(projectData));
      message.success('Project created successfully');
    }
    navigate('/projects');
  };

  return (
    <div className="project-form">
      <div className="form-header">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/projects')}
        >
          Back to List
        </Button>
        <h1 className="page-title">
          {isEdit ? 'Edit Project' : 'Create New Project'}
        </h1>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: 'planning',
            type: 'infrastructure',
            progress: 0,
          }}
        >
          <Form.Item
            label="Project Code"
            name="code"
            rules={[{ required: true, message: 'Please enter project code' }]}
          >
            <Input placeholder="PRJ-2024-XXX" />
          </Form.Item>

          <Form.Item
            label="Project Name"
            name="name"
            rules={[{ required: true, message: 'Please enter project name' }]}
          >
            <Input placeholder="Enter project name" />
          </Form.Item>

          <Form.Item
            label="Investor"
            name="investor"
            rules={[{ required: true, message: 'Please enter investor' }]}
          >
            <Input placeholder="Enter investor name" />
          </Form.Item>

          <Form.Item
            label="Project Type"
            name="type"
            rules={[{ required: true, message: 'Please select project type' }]}
          >
            <Select>
              <Option value="infrastructure">Infrastructure</Option>
              <Option value="technology">Technology</Option>
              <Option value="energy">Energy</Option>
              <Option value="healthcare">Healthcare</Option>
              <Option value="education">Education</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Total Budget (VND)"
            name="totalBudget"
            rules={[{ required: true, message: 'Please enter total budget' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Enter total budget"
            />
          </Form.Item>

          <Form.Item
            label="Disbursed Budget (VND)"
            name="disbursedBudget"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Enter disbursed budget"
            />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value="planning">Planning</Option>
              <Option value="active">Active</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{ required: true, message: 'Please select start date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="End Date"
            name="endDate"
            rules={[{ required: true, message: 'Please select end date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Progress (%)"
            name="progress"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              max={100}
              placeholder="Enter progress percentage"
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <TextArea rows={4} placeholder="Enter project description" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              {isEdit ? 'Update Project' : 'Create Project'}
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => navigate('/projects')}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProjectForm;