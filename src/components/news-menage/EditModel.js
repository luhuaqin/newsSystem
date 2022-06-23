import { Form, Input, message, Modal, Select } from 'antd'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import NewsEditor from './NewsEditor'
import { withRouter } from 'react-router-dom';

const { Option } = Select

function EditModel(props) {
  const [categoryList, setCategoryList] = useState([])

  useEffect(() => {
    axios.get('/categories').then(res => {
      setCategoryList(res.data)
    })
  }, [])
  
  const handleOk = () => {
    props.form.validateFields().then(res => {
      if(props.newsContent === "" || props.newsContent.trim() === "<p></p>") {
        message.error('新闻内容不能为空')
      }else {
        axios.patch(`/news/${props.currentNewsId}`, {
          ...res,
          "content": props.newsContent,
          "auditState": 0,
        }).then(res => {
          console.log(res)
          message.success('更新成功')
          props.history.push('/news-manage/draft')
        }).catch(err => {
          message.error('更新失败')
        })
        props.closeVisible()
      }
    }).catch(err => {
      console.log(err)
    })    
  };
  
  return (
    <Modal title="修改新闻内容" visible={props.isModalVisible} onOk={() => handleOk()} onCancel={() => props.closeVisible()} okText="保存" cancelText="取消" forceRender={true}>
      <Form form={props.form} style={{ marginTop: '20px' }}>
        <Form.Item name='title' label="新闻标题" rules={[
          {
            required: true, message: '请输入新闻标题'
          },
        ]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item name="categoryId" label="新闻分类" rules={[
          {
            required: true, message: '请选择新闻分类'
          },
        ]}>
          <Select
            placeholder="请选择"
            allowClear
          >
            {
              categoryList.map(item => <Option key={item.id} value={item.id}>{item.title}</Option>)
            }
          </Select>
        </Form.Item>
      </Form>
      <NewsEditor getContent={(value) => {
        props.getContent(value)
      }} content={props.newsContent}/>
    </Modal>
  )
}

export default withRouter(EditModel)
