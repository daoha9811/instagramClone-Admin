import React, { useState, useCallback, useRef } from 'react';
import { Divider, Modal, Form } from 'antd';
import ProTable from '@ant-design/pro-table';
import { useRequest } from '@umijs/hooks';
import UpdatePostForm from './components/updatePostForm';
import { queryPost, removePostService } from './service';

const PostTable = () => {
  const { confirm } = Modal;

  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState('');
  const actionRef = useRef();

  const { run: removePost, data: dataRemovePost } = useRequest(removePostService, {
    manual: true,
  });

  const handleRemovePost = useCallback((id, action) => {
    confirm({
      title: 'Bạn có muốn xoá bài đăng này không ?',
      onOk() {
        removePost(id);
        action?.reload();
      },
      okText: 'Đồng ý',
      cancelText: 'Huỷ',
    });
  }, []);

  const handleUpdatePost = useCallback((record) => {
    setModalVisible(true);
    setCurrentRecord(record);
  },[]);

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'userName',
    },
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Ảnh',
      dataIndex: 'img',
      render: (_, record) => (
        <>
          <img width="100" height="100" src={record?.img} />
        </>
      ),
    },
    {
      title: 'Lượt thích',
      dataIndex: 'likes',
    },
    {
      title: 'Hành động',
      dataIndex: '_id',
      render: (_, record, index, action) => {
        return (
          <>
            <a onClick={() => handleRemovePost(record._id, action)}>Xoá</a>
            <Divider type="vertical" />
            <a onClick={() => handleUpdatePost(record)}>Sửa</a>
          </>
        );
      },
    },
  ];
  return (
    <>
      <ProTable
        headerTitle="Quản lý bài đăng"
        actionRef={actionRef}
        request={(params, sorter, filter) => queryPost({ ...params, sorter, filter })}
        columns={columns}
        pagination={{
          defaultCurrent: 5,
        }}
      />
      <Modal
        footer={null}
        visible={modalVisible}
        title="Sửa bài viết"
        onCancel={() => {
          setModalVisible(false);
          setCurrentRecord('');
          actionRef?.current?.reload();
        }}
      >
        {modalVisible && (
          <UpdatePostForm
            setModalVisible={setModalVisible}
            actionRef={actionRef}
            record={currentRecord}
          />
        )}
      </Modal>
    </>
  );
};

export default PostTable;
