import React, { useEffect, useState } from 'react'
import { PageHeader, Steps, Button, Space, Form, Input, Select, message } from 'antd'
import './news.css'
import axios from 'axios';
import NewsEditor from '../../../components/news-menage/NewsEditor';

const { Step } = Steps;
const { Option } = Select;

export default function NewsAdd(props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const [newsContent, setNewsContent] = useState('')
  const [formInfo, setFormInfo] = useState({})
  const [form] = Form.useForm();

  const { region, username, roleId } = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    axios.get('/categories').then(res => {
      setCategoryList(res.data)
    })
  }, [])

  const handleNext = () => {
    if(currentStep === 0) {
      form.validateFields().then(res => {
        setFormInfo(res)
        setCurrentStep(currentStep+1)
      }).catch(err => {
        console.log(err)
      })
    }else {
      if(newsContent === "" || newsContent.trim() === "<p></p>") {
        message.error('新闻内容不能为空')
      }else {
        console.log(formInfo, newsContent)
        setCurrentStep(currentStep+1) 
      }
    }
  }

  const handleSaveSubmit = (auditState) => {
    axios.post('/news', {
      ...formInfo,
      "content": newsContent,
      "region": region ? region : "全球",
      "author": username,
      "roleId": roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      "publishTime": 0
    }).then(res => {
      props.history.push(auditState === 0 ? '/news-manage/draft': '/audit-manage/list')
    })
  }

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
      />

      <Steps current={currentStep}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>

      <Form form={form} style={{ marginTop: '20px' }}>
        <div className={currentStep === 0 ? '' : 'hidden'}>
          <Form.Item name='title' label="新闻标题" rules={[
            {
              required: true,
            },
          ]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="categoryId" label="新闻分类" rules={[
            {
              required: true,
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
        </div>

        <div className={currentStep === 1 ? '' : 'hidden'}>
          <NewsEditor getContent={(value) => {
            setNewsContent(value)
          }}/>
        </div>

        <div className={currentStep === 2 ? '' : 'hidden'}>
          
        </div>
      </Form>

      <div className='btn'>
        <Space>
          {
            currentStep !== 0 && <Button onClick={() => {
              setCurrentStep(currentStep-1)
            }}>上一步</Button>
          }
          {
            currentStep < 2 && <Button type='primary' onClick={() => handleNext()}>下一步</Button>
          }
          {
            currentStep === 2 && <span>
              <Space>
                <Button className='draftBtn' onClick={() => handleSaveSubmit(0)}>保存草稿</Button>
                <Button type="primary" danger onClick={() => handleSaveSubmit(1)}>提交审核</Button>
              </Space>
            </span>
          }
        </Space>
      </div>
    </div>
  )
}