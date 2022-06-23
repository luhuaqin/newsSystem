import { Table, Tag } from 'antd'
import React from 'react'

export default function PublishPage(props) {
  const columns =[
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
      render: (_, record) => {
        return <div>
          {props.button(record.id)}
        </div>
      }
    }
  ]

  return (
    <div>
      <Table dataSource={props.dataSource} columns={columns} rowKey={item => item.id} pagination={{ pageSize: 6 }} />
    </div>
  )
}
