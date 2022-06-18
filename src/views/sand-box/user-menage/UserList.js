import React, { useEffect, useMemo, useRef, useState } from 'react'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Modal, Space, Switch, Table, message } from 'antd'
import axios from 'axios'
import AddForm from '../../../components/user-menage/AddForm'

export default function UserList() {
  const { region, roleId, username } = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState([])
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [regionList, setRegionList] = useState([])
  const [rolesList, setRolesList] = useState([])
  const [isAddModal, setIsAddModal] = useState(true)
  const [currentId, setCurrentId] = useState(0)
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(true)
  const [isUpdateRegion, setIsUpdateRegion] = useState(false)
  const formRef = useRef(null)

  const roleObj = useMemo(()=>{
    return {
      '1': 'superAdmin',
      '2': 'regionAdmin',
      '3': 'regionEditor'
    }
  }, [])

  // 请求表格数据
  useEffect(() => {
    axios.get('/users?_expand=role').then(res => {
      const list = res.data
      setDataSource(roleObj[roleId] === 'superAdmin' ? list : [
        ...list.filter(item => item.username === username),
        ...list.filter(item=> item.region === region && roleObj[item.roleId] === 'regionEditor')
      ])
    })
  },[region, roleId, roleObj, username])
  // 请求区域下拉列表数据
  useEffect(() => {
    axios.get('/regions').then(res => {
      setRegionList(res.data)
    })
  },[])
  // 请求角色下拉列表数据
  useEffect(() => {
    axios.get('/roles').then(res => {
      setRolesList(res.data)
    })
  },[])

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => (
        <span>{region === '' ? '全球': region}</span>
      ),
      filters: [
        ...regionList.map(item => {
          return {
            text: item.title,
            value: item.value
          }
        }),
        {
          text: '全球',
          value: '全球'
        }
      ],
      onFilter: (value, record) => {
        if(value === '全球') {
          return record.region.indexOf(value) === -1
        }
        return record.region.indexOf(value) === 0
      },
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => (
        <span>{role?.roleName}</span>
      )
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => (
        <Switch checked={roleState} disabled={item.default} onChange={() => {
          item.roleState = !item.roleState
          setDataSource([...dataSource])
          axios.patch(`/users/${item.id}`, {
            roleState: item.roleState
          })
        }}></Switch>
      )
    },
    {
      title: '操作',
      render: (record) => (
        <Space size='middle'>
          <Button type='primary' shape='circle' icon={<EditOutlined />} disabled={record.default} onClick={() => handleChange(record)}></Button>
          <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => handleDelete(record)} disabled={record.default}></Button>
        </Space>
      )
    }
  ]

  const handleDelete = (record) => {
    Modal.confirm({
      title: `确认删除${record.username}吗？`,
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setDataSource(dataSource.filter(item => item.id !== record.id))
        axios.delete(`/users/${record.id}`)
      }
    })
  }

  const handleChange = (record) => {
    setIsAddModalVisible(true)
    setCurrentId(record.id)
    setIsAddModal(false)
    setIsUpdateRegion(true)
    if(record.roleId === 1) {
      setIsUpdateDisabled(true)
    }else {
      setIsUpdateDisabled(false)
    }
    setTimeout(() => {
      formRef.current.setFieldsValue(record)
    }, 0);
    
  }

  const addSubmit = () => {
    formRef.current.validateFields().then(value => {
      if(isAddModal) {
        axios.post(`/users`, {
          ...value,
          "roleState": true,
          "default": false,
        }).then(res => {
          message.success('添加成功');
          setDataSource([...dataSource, {
            ...res.data,
            role: rolesList.filter(item => item.id === value.roleId)[0]
          }])
        }).catch(err => {
          console.log(err)
          message.error('添加失败');
        })
      }else {
        axios.patch(`/users/${currentId}`,value).then(res => {
          setDataSource(dataSource.map(item => {
            if(item.id === currentId) {
              return {
                ...item,
                ...value,
                role: rolesList.filter(item => item.id === value.roleId)[0]
              }
            }
            return item
          }))
          message.success('修改成功')
        })
      }
      setIsAddModalVisible(false)
      formRef.current.resetFields()
    }).catch(err => {
      
    })
  }

  return (
    <div>
      <Button type='primary' icon={<PlusOutlined />} style={{ marginBottom: '5px' }} onClick={() =>{
        setIsAddModalVisible(true)
        setIsUpdateRegion(false)
        formRef.current.resetFields()
        setIsAddModal(true)
      }}>添加角色</Button>
      <Modal title={isAddModal ? '添加角色' : '修改角色'} visible={isAddModalVisible} okText="确定" cancelText="取消" onOk={addSubmit} onCancel={() => {
        setIsAddModalVisible(false)
      }}>
        <AddForm rolesList={rolesList} regionList={regionList} ref={formRef} isUpdateDisabled={isUpdateDisabled} isUpdateRegion={isUpdateRegion} />
      </Modal>
      {/* <Modal title="添加角色" visible={isEditModalVisible} onOk={editSubmit} onCancel={() => setIsEditModalVisible(false)}>
        <AddForm rolesList={rolesList} regionList={regionList} ref={formRef} />
      </Modal> */}
      <Table dataSource={dataSource} columns={columns} pagination={{pageSize:6}} rowKey={item=> item.id} />
    </div>
  )
}
