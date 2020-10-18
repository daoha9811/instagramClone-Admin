import React, { useState, useEffect } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { useRequest } from '@umijs/hooks';
import { updatePostService } from '../service';

const UpdatePostForm = ({ record, setModalVisible, actionRef }) => {
  const [form] = Form.useForm();

  const { run: updatePost } = useRequest(updatePostService, {
    manual: true,
  });

  useEffect(() => {
    return form.resetFields();
  }, []);

  const hanldeFormSummit = (values) => {
    updatePost({ id: record?._id, title: values.title });
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
          label="Title"
          name="title"
          initialValue={(record?.title && record?.title) || ''}
          rules={[{ required: true, message: 'Mời nhập title bài viết' }]}
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
