import { Table, Space, Button, Modal, Tree } from 'antd'
import { DeleteOutlined, ApartmentOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import React, { useEffect, useState } from 'react'


export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [checkedKeys, setCheckedKeys] = useState([])
  const [currentId, setCurrentId] = useState(0)
  const [treeDataList, setTreeDataList] = useState([])

  // 请求表格数据
  useEffect(() => {
    axios.get('/roles').then(res => {
      setDataSource(res.data)
    })
  }, [])
  // 请求弹框树形控件数据
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      setTreeDataList(res.data)
    })
  }, [])
  // 表格数据
  const columns = [
    {
      title: '角色等级',
      dataIndex: 'roleType',
      render: (roleType) => <b>{roleType}</b>
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render: (record) => (
        <Space size="middle">
          <Button type='primary' shape="circle" icon={<ApartmentOutlined />} onClick={() => {
            setIsModalVisible(true)
            setCheckedKeys(record.rights)
            setCurrentId(record.id)
          }} />
          <Button shape="circle" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </Space>
      )
    }
  ]
  // 删除当前记录
  const handleDelete = (record) => {
    Modal.confirm({
      title: `确认删除${record.roleName}吗？`,
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {confirmDelete(record)}
    });
  }
  const confirmDelete = (record) => {
    setDataSource(dataSource.filter(item => item.id !== record.id))
    axios.delete(`/roles/${record.id}`)
  }

  const handleOk = () => {
    // 改变权限数据
    setDataSource(dataSource.map(item => {
      if(item.id === currentId) {
        return {
          ...item,
          rights: checkedKeys
        }
      }
      return item
    }))
    // 修改后端权限数据
    axios.patch(`/roles/${currentId}`, {
      rights: checkedKeys
    })
    setIsModalVisible(false)
  }
  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue.checked);
  };

  return (
    <div>
      <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)}>
          <Tree
            checkable
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            checkStrictly={true}
            treeData={treeDataList}
          />
      </Modal>
      <Table dataSource={dataSource} columns={columns} pagination={{pageSize:6}} rowKey={item => item.id} />
    </div>
  )
}
