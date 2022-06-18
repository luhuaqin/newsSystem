import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom';
import '../../views/sand-box/newSandBox.css'
import {
  UserOutlined,
  HomeOutlined,
  SolutionOutlined,
  ReadOutlined,
  CheckSquareOutlined,
  PlusSquareOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import axios from 'axios';

const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const iconList = {
  '/home': <HomeOutlined />,
  '/user-manage': <UserOutlined />,
  '/right-manage': <SolutionOutlined />,
  '/news-manage': <ReadOutlined />,
  '/audit-manage': <CheckSquareOutlined />,
  '/publish-manage': <PlusSquareOutlined />
}

function SideMenu(props) {

  const { role:{rights} } = JSON.parse(localStorage.getItem('token'))

  const [sideList, setSideList] = useState()

  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      setSideList(res.data)
    })
  },[])

  const pagePermission = (item) => {
    return  item.pagepermisson === 1 && 
            rights.includes(item.key) && 
            getItem(item.title, item.key,iconList[item.key],item.children.length > 0 && 
            item.children.map(subItem => subItem.pagepermisson === 1 && item.children.length > 0 &&
            getItem(subItem.title, subItem.key)))
  }

  const selectedKeys = [props.location.pathname]
  const defaultOpenKeys = ['/' + props.location.pathname.split('/')[1]]
  
  return (
    <Sider trigger={null} collapsible collapsed={props.collapsed} style={{
      overflow: 'auto',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
    }}>
        <div className="logo">全球新闻发布管理系统</div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={(evt) => {
            props.history.push(evt.keyPath[0])
          }}
          selectedKeys={selectedKeys}
          defaultOpenKeys={defaultOpenKeys}
          items={sideList?.map(item => pagePermission(item))}
        />
      </Sider>
  )
}

export default withRouter(SideMenu)
