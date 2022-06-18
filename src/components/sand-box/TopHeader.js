import React from 'react'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { withRouter } from 'react-router-dom';
const { Header } = Layout;

function TopHeader(props) {
  const storageObj = JSON.parse(localStorage.getItem('token'))
  const { username, role:{roleName} } = storageObj

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <span>{roleName}</span>
          ),
        },
        {
          key: '2',
          label: (
            <span style={{ color: 'red' }} onClick={() => {
              localStorage.removeItem('token')
              props.history.replace('/login')
            }}>退出登录</span>
          ),
        }
      ]}
    />
  )

  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {
        props.collapsed ? <MenuUnfoldOutlined className='trigger' onClick={props.changeCollapsed}/> : <MenuFoldOutlined className='trigger' onClick={props.changeCollapsed} />
      }
      <div style={{ float: 'right' }}>
        <span>{`欢迎${username}登录`}</span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

export default withRouter(TopHeader) 
