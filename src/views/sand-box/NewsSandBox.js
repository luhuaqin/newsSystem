import React, { useEffect, useState } from 'react'
import SideMenu from '../../components/sand-box/SideMenu'
import TopHeader from '../../components/sand-box/TopHeader'
import './newSandBox.css'
import { Layout } from 'antd'
import NewsRouter from '../../components/sand-box/NewsRouter'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const { Content } = Layout;

export default function NewsSandBox() {
  NProgress.start()
  useEffect(() => {
    NProgress.done()
  })
  const [collapsed, setCollapsed] = useState(false)
  return (
    <Layout hasSider style={{ height: '100%' }}>
      <SideMenu collapsed={collapsed}></SideMenu>
      <Layout className="site-layout" style={{
        marginLeft: 200,
      }}>
        <TopHeader collapsed={collapsed} changeCollapsed={() => {
          setCollapsed(!collapsed)
        }}></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px 0',
            overflow: 'auto',
            padding: 24,
            minHeight: 280
          }}
        >
          <NewsRouter />
        </Content>
      </Layout>
    </Layout>
  )
}
