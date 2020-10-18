import React, { useState, useEffect } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { useRequest } from '@umijs/hooks';
import { updateUserService } from '../service';

const UpdatePostForm = ({ record, setModalVisible, actionRef }) => {
  const [form] = Form.useForm();

  const { run: updateUser } = useRequest(updateUserService, {
    manual: true,
  });

  useEffect(() => {
    return form.resetFields();
  }, []);

  const hanldeFormSummit = (values) => {
    updateUser({ id: record?._id, name: values.name, password: values.password});
    notification.open({
        message: 'Cập nhật thành công',
        duration: 1
      });
    setModalVisible(false);
    actionRef?.current?.reload();
  };

  return (
    <>
      <Form form={form} name="basic" onFinish={hanldeFormSummit} initialValues={{ remember: true }}>
        <Form.Item
          label="Tên"
          name="name"
          initialValue={(record?.name && record?.name) || ''}
          rules={[{ required: true, message: 'Mời nhập tên' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Gmail"
          name="gmail"
          initialValue={(record?.gmail && record?.gmail) || ''}
          rules={[{ required: true, message: 'Mời nhập gmail' }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          initialValue={(record?.password && record?.password) || ''}
          rules={[{ required: true, message: 'Mời nhập mật khẩu' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Sửa
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default UpdatePostForm;
