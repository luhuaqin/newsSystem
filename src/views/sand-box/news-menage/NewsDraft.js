import React, { useEffect, useState } from 'react'
import { DeleteOutlined, EditOutlined, VerticalAlignTopOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Space, Table, Tag, Button, Modal, Form, message, Popconfirm } from 'antd';
import axios from 'axios';
// import NewsEditor from '../../../components/news-menage/NewsEditor';
import EditModel from '../../../components/news-menage/EditModel';

// const { Option } = Select

export default function NewsDraft(props) {
  const { username } = JSON.parse(localStorage.getItem('token'))
  const [data, setData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [categoryList, setCategoryList] = useState([])
  const [newsContent, setNewsContent] = useState('')
  const [currentNewsId, setCurrentNewsId] = useState(0)
  const [form] = Form.useForm();

  useEffect(() => {
    axios.get(`/news?auditState=0&author=${username}&_expand=category`).then(res => {
      setData(res.data)
    })
  }, [username])

  useEffect(() => {
    axios.get('/categories').then(res => {
      setCategoryList(res.data)
    })
  }, [])

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
      dataIndex: 'category',
      render: (category) => <span>{category.title}</span>
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space size="middle">
          <Button shape="circle" danger icon={<DeleteOutlined />} onClick={() => showConfirm(record)}></Button>
          <Button shape="circle" icon={<EditOutlined />} onClick={() => handleEdit(record)}></Button>
          <Popconfirm title="确认提交审核吗？" okText="确认" cancelText="取消" onConfirm={() => confirm(record.id)}>
            <Button type='primary' shape="circle" icon={<VerticalAlignTopOutlined />}></Button>
          </Popconfirm>
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

  const handleEdit = (record) => {
    form.setFieldsValue(record)
    setNewsContent(record.content)
    setCurrentNewsId(record.id)
    setIsModalVisible(true)
  }

  const confirm = (recordId) => {
    axios.patch(`/news/${recordId}`, {
      "auditState": 1,
    }).then(res => {
      message.success('提交成功')
      setData(data.filter(item => item.id !== recordId))
      props.history.push('/news-manage/draft')
    }).catch(err => {
      message.error('提交失败')
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
      <Table columns={columns} dataSource={data} rowKey={(item) => item.id} pagination={{pageSize: 6}} />
      <EditModel isModalVisible={isModalVisible} closeVisible={closeVisible} form={form} categoryList={categoryList} getContent={getContent} newsContent={newsContent} currentNewsId={currentNewsId} />
    </div>
  )
}
