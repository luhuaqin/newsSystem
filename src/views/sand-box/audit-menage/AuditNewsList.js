import { Button, Form, message, notification, Popconfirm, Space, Table, Tag } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import EditModel from '../../../components/news-menage/EditModel'

const auditStateList = ['未审核', '审核中', '已通过', '未通过']
const tagColors = ['black', 'orange', 'green', 'red']

export default function AuditNewsList(props) {
  const { username } = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState([])
  const [form] = Form.useForm();
  const [newsContent, setNewsContent] = useState('')
  const [currentNewsId, setCurrentNewsId] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  useEffect(() => {
    axios.get(`/news?username=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res =>{
      setDataSource(res.data)
    })
  }, [username])

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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState, record) => <Tag key={record.id} color={tagColors[auditState]}>{auditStateList[auditState]}</Tag>
    },
    {
      title: '操作',
      render: (_, record) => {
        return <Space>
          {
            record.auditState === 2 && <Popconfirm onConfirm={() => handlePublish(record)} title="确定发布该新闻新闻吗？" okText="确认" cancelText="取消">
              <Button type='primary'>发布</Button>
            </Popconfirm>
          }
          {
            record.auditState === 1 && <Popconfirm onConfirm={() => handleRevert(record)} title="确定撤销该新闻吗？" okText="确认" cancelText="取消">
            <Button type='primary' danger>撤销</Button>
          </Popconfirm>
          }
          {
            record.auditState === 3 && <Button onClick={() => handleEdit(record)}>修改</Button>
          }
        </Space>
      }
    }
  ]

  const handleEdit = (record) => {
    form.setFieldsValue(record)
    setNewsContent(record.content)
    setCurrentNewsId(record.id)
    setIsModalVisible(true)
  }

  const handleRevert = (record) => {
    setDataSource(dataSource.filter(item => item.id !== record.id))
    axios.patch(`/news/${record.id}`, {
      auditState: 0
    }).then(res => {
      message.success('撤销完成')
    }).catch(err => {
      message.error('撤销失败')
    })
  }

  const handlePublish = (record) => {
    setDataSource(dataSource.filter(item => item.id !== record.id))
    axios.patch(`/news/${record.id}`, {
      publishState: 2,
      publishTime: Date.now()
    }).then(res => {
      message.success('发布成功')
      // const h = createElement('a', {href:'#/publish-manage/published', innerHTML: '【发布管理/已发布】'})
      notification.info({
        message: `通知`,
        description: 
          `您可以到【发布管理/已发布】中查看已发布的新闻`,
      });
    }).catch(err => {
      message.error('发布失败')
    })
  }

  const getContent = (value) => {
    setNewsContent(value)
  }

  const closeVisible = () => {
    setIsModalVisible(false)
  }


  return (
    <div>
      <Table columns={columns} dataSource={dataSource} rowKey={item=>item.id} pagination={{ pageSize: 6 }} />
      <EditModel closeVisible={closeVisible} isModalVisible={isModalVisible} form={form} getContent={getContent} newsContent={newsContent} currentNewsId={currentNewsId} />
    </div>
  )
}
