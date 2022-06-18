import React, { useEffect, useState } from 'react'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Table, Tag, Button, Space, Modal, Popover, Switch } from 'antd'
import axios from 'axios'

export default function RightList() {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      const list = res.data
      list.forEach(item => {
        if(item.children?.length === 0) {
          list[0].children = ''
        }
      })
      setDataSource(list)
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) =>  <b> { id } </b>,
    },
    {
      title: '权限名称',
      dataIndex: 'title'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) =>  <Tag color={'green'} key={key}> { key } </Tag>,
    },
    {
      title: '操作',
      render: (record) => (
        <Space size="middle">
          <Popover content={<Switch checked={record.pagepermisson} onChange={() => {
            record.pagepermisson = record.pagepermisson === 1 ? 0 : 1
            setDataSource([...dataSource])
            if(record.grade === 1) {
              axios.patch(`/rights/${record.id}`, {
                pagepermisson: record.pagepermisson
              })
            }else {
              axios.patch(`/children/${record.id}`, {
                pagepermisson: record.pagepermisson
              })
            }
          }}></Switch>} 
                    title="页面配置项" 
                    trigger={record.pagepermisson === undefined ? '' : "click"}>
            <Button type='primary' shape="circle" icon={<EditOutlined />} disabled={record.pagepermisson === undefined} />
          </Popover>
          
          <Button shape="circle" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  const handleDelete = (record) => {
    Modal.confirm({
      title: `确认删除${record.title}吗？`,
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {confirmDelete(record)}
    });
  }

  const confirmDelete = (record) => {
    console.log(record)
    if(record.grade === 1) {
      setDataSource(dataSource.filter(item => item.id !== record.id))
      axios.delete(`/rights/${record.id}`)
    }else {
      const list = dataSource.filter(item => item.id === record.rightId)
      list[0].children = list[0].children.filter(item => item.id !== record.id)
      setDataSource([...dataSource])
      axios.delete(`/children/${record.id}`)
    }
    
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{pageSize:6}} />
    </div>
  )
}
