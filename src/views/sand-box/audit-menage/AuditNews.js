import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Space, Tag, Table, Button, Popconfirm, message } from 'antd'

const roleObj = {
  '1':'superAdmin',
  "2":"admin",
  "3":"editor"
}

export default function AuditNews() {
  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axios.get(`/news?auditState=1&_expand=category`).then(res =>{
      const list = res.data
      setDataSource(roleObj[roleId] === 'superAdmin' ? list: [
        ...list.filter(item => item.author === username),
        ...list.filter(item => item.region === region && roleObj[roleId] === 'editor')
      ])
    })
  }, [username, roleId, region])

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, record) => <Tag key={record.id} color='green'>
        <a href={`#/news-manage/preview/${record.id}`}>{title}</a>
      </Tag>
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => <span>{category.title}</span>
    },
    {
      title: '操作',
      render: (_, record) => {
        return <Space>
          <Popconfirm onConfirm={() => handleApprove(record, 2, 1)} title="确定通过该新闻吗？" okText="确认" cancelText="取消">
            <Button type='primary'>通过</Button>
          </Popconfirm>

          <Popconfirm onConfirm={() => handleApprove(record, 3, 0)} title="确定驳回该新闻吗？" okText="确认" cancelText="取消">
            <Button type='primary' danger>驳回</Button>
          </Popconfirm>
        </Space>
      }
    }
  ];

  const handleApprove = (record, auditState, publishState) => {
    setDataSource(dataSource.filter((item) => item.id !== record.id))
    axios.patch(`/news/${record.id}`, {
      auditState,
      publishState
    }).then(res => {
      message.success('操作成功')
    }).catch(err => {
      console.log(err)
      message.error('操作失败')
    })
  }

  return (
    <div>
      <Table columns={columns} dataSource={dataSource} rowKey={item=>item.id} pagination={{ pageSize: 6 }} />
    </div>
  )
}
