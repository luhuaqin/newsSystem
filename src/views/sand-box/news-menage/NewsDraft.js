import React, { useEffect, useState } from 'react'
import { DeleteOutlined, EditOutlined, VerticalAlignTopOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Space, Table, Tag, Button, Modal } from 'antd';
import axios from 'axios';


export default function NewsDraft() {
  const { username } = JSON.parse(localStorage.getItem('token'))
  const [data, setData] = useState([])
  useEffect(() => {
    axios.get(`/news?auditState=0&author=${username}&_expand=category`).then(res => {
      setData(res.data)
    })
  }, [username])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text) => <span>{text}</span>,
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, record) => <Tag color='green' key={record.id}><a href={`#/news-manage/preview/${record.id}`}>{title}</a></Tag>
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'categoryId',
      render: (category) => {
        switch(category) {
          case 1: 
            return <span>时事新闻</span>
          case 2:
            return <span>环球经济</span>
          case 3:
            return <span>科学技术</span>
          case 4:
            return <span>军事世界</span>
          case 5:
            return <span>世界体育</span>
          case 6:
            return <span>生活理财</span>
          default:
            return <span>其他</span>
        } 
      }
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space size="middle">
          <Button shape="circle" danger icon={<DeleteOutlined />} onClick={() => showConfirm(record)}></Button>
          <Button shape="circle" icon={<EditOutlined />}></Button>
          <Button type='primary' shape="circle" icon={<VerticalAlignTopOutlined />}></Button>
        </Space>
      ),
    },
  ];

  const showConfirm = (record) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `确认删除${record.title}吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => { 
        setData(data.filter(item => item.id !== record.id))
        axios.delete(`/news/${record.id}`)
      }
    });
  }

  return (
    <div>
      <Table columns={columns} dataSource={data} rowKey={(item) => item.id} pagination={{pageSize: 6}} />
    </div>
  )
}
