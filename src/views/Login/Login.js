import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Form, Input, Button, message } from 'antd'
import './Login.css'
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles";
import options from './bgParticlesOpt'
import axios from 'axios'


export default function Login(props) {

  const onFinish = (value) => {
    console.log(value)
    axios.get(`/users?_expand=role&username=${value.username}&password=${value.password}&roleState=true`).then(res => {
      if(res.data.length ===0) {
        if(res.data.roleState) {
          message.error('用户名或密码错误')
        }
        message.warning('您暂无权限登录该系统')
      }else {
        localStorage.setItem('token', JSON.stringify(res.data[0]))
        props.history.push('/')
      }
    })
  }

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div style={{ background: '#45497b', height: '100%', overflow: 'hidden' }}>
      <Particles id="tsparticles" init={particlesInit} options={options} />
      <div style={{ position: 'fixed', zIndex: 99, height: '80px', paddingLeft: '90%', marginTop: '20px' }}>
        <a href='#/news'>查看新闻</a>
      </div>
      <div className='loginContainer'>
        <div className='loginTitle'>全球新闻发布管理系统</div>
        <Form
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
