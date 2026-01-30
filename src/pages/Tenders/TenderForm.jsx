import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, InputNumber, Select, DatePicker, Button, Card, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { addTender, updateTender } from '../../store/slices/tendersSlice';
import dayjs from 'dayjs';
import './TenderForm.css';

const { TextArea } = Input;
const { Option } = Select;

const TenderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tenders = useSelector((state) => state.tenders.tenders);
  const projects = useSelector((state) => state.projects.projects);
  const [form] = Form.useForm();
  const isEdit = !!id;
  const tender = isEdit ? tenders.find((t) => t.id === id) : null;

  useEffect(() => {
    if (tender) {
      form.setFieldsValue({
        ...tender,
        startDate: dayjs(tender.startDate),
        endDate: dayjs(tender.endDate),
      });
    }
  }, [tender, form]);

  const onFinish = (values) => {
    const tenderData = {
      ...values,
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: values.endDate.format('YYYY-MM-DD'),
      progress: values.progress || 0,
      contractValue: values.contractValue || values.bidValue,
    };

    if (isEdit) {
      dispatch(updateTender({ ...tenderData, id }));
      message.success('Tender package updated successfully');
    } else {
      dispatch(addTender(tenderData));
      message.success('Tender package created successfully');
    }
    navigate('/tenders');
  };

  return (
    <div className="tender-form">
      <div className="form-header">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/tenders')}
        >
          Back to List
        </Button>
        <h1 className="page-title">
          {isEdit ? 'Edit Tender Package' : 'Create New Tender Package'}
        </h1>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: 'awarded',
            progress: 0,
          }}
        >
          <Form.Item
            label="Tender Code"
            name="code"
            rules={[{ required: true, message: 'Please enter tender code' }]}
          >
            <Input placeholder="TDR-2024-XXX" />
          </Form.Item>

          <Form.Item
            label="Tender Name"
            name="name"
            rules={[{ required: true, message: 'Please enter tender name' }]}
          >
            <Input placeholder="Enter tender name" />
          </Form.Item>

          <Form.Item
            label="Project"
            name="projectId"
            rules={[{ required: true, message: 'Please select project' }]}
          >
            <Select placeholder="Select project">
              {projects.map((project) => (
                <Option key={project.id} value={project.id}>
                  {project.code} - {project.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Contractor"
            name="contractor"
            rules={[{ required: true, message: 'Please enter contractor name' }]}
          >
            <Input placeholder="Enter contractor name" />
          </Form.Item>

          <Form.Item
            label="Bid Value (VND)"
            name="bidValue"
            rules={[{ required: true, message: 'Please enter bid value' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Enter bid value"
            />
          </Form.Item>

          <Form.Item
            label="Contract Value (VND)"
            name="contractValue"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Enter contract value"
            />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value="awarded">Awarded</Option>
              <Option value="in-progress">In Progress</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
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
            <TextArea rows={4} placeholder="Enter tender package description" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              {isEdit ? 'Update Tender Package' : 'Create Tender Package'}
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => navigate('/tenders')}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TenderForm;