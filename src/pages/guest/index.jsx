import React, { useState, useCallback, useRef } from 'react';
import { Divider, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import { useRequest } from '@umijs/hooks';
import UpdateUserForm from './components/updateUserForm';
import { queryUsers, removeUserService } from './service';

const PostTable = () => {
  const { confirm } = Modal;

  const { run: removeUser, data: dataRemoveUser } = useRequest(removeUserService, {
    manual: true,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState('');
  const actionRef = useRef();

  const handleRemoveUser = useCallback((id, action) => {
    confirm({
      title: 'Bạn có muốn xoá người dùng này không ?',
      onOk() {
        removeUser(id);
        action?.reload();
      },
      okText: 'Đồng ý',
      cancelText: 'Huỷ',
    });
  }, []);

  const handleUpdateUser = useCallback((record) => {
    setModalVisible(true);
    setCurrentRecord(record);
  }, []);

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'gmail',
    },
    {
      title: 'Avatar',
      dataIndex: 'img',
      render: (_, record) => (
        <>
          <img width="100" height="100" src={record?.avatar} />
        </>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: '_id',
      render: (_, record, index, action) => (
        <>
          <a onClick={() => handleRemoveUser(record._id, action)}>Xoá</a>
          <Divider type="vertical" />
          <a onClick={() => handleUpdateUser(record) }>Sửa</a>
        </>
      ),
    },
  ];

  return (
    <>
      <ProTable
        headerTitle="Quản lý người dùng"
        request={(params, sorter, filter) => queryUsers({ ...params, sorter, filter })}
        columns={columns}
        actionRef={actionRef}
        pagination={{
          defaultCurrent: 5,
        }}
      />
      <Modal
        footer={null}
        visible={modalVisible}
        title="Sửa user"
        onCancel={() => {
          setModalVisible(false);
          setCurrentRecord('');
          actionRef?.current?.reload();
        }}
      >
        {modalVisible && (
          <UpdateUserForm
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
