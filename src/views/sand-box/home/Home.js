import React, { useEffect, useRef, useState } from 'react'
import { PieChartOutlined, EllipsisOutlined, EditOutlined, BarChartOutlined } from '@ant-design/icons';
import { Card, Col, Row, Avatar, List, Tag, Drawer } from 'antd'
import axios from 'axios'
import * as echarts from 'echarts'
import _ from 'lodash'

const { Meta } = Card
export default function Home() {
  const { username, role:{roleName}, region } = JSON.parse(localStorage.getItem('token'))
  const [mostViewList, setMostViewList] = useState([])
  const [mostStartList, setMostStartList] = useState([])
  const [ownNewsList, setOwnNewsList] = useState([])
  const [visible, setVisible] = useState(false)
  const [initPie, setInitPie] = useState(null)
  const barRef = useRef()
  const pieRef = useRef()

  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res => {
      setMostViewList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category&_sort=start&_order=desc&_limit=6`).then(res => {
      setMostStartList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category`).then(res => {
      runBar(_.groupBy(res.data, item => item.category.title))
      setOwnNewsList(res.data)
    })
    return () => {
      window.onresize = null
    }
   }, [])

  const runBar = (obj) => {
    let myChart = echarts.init(barRef.current);
    let option;

    option = {
      title: {
        text: '新闻数量统计图'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      legend: {
        data:['数量']
      },
      xAxis: {
        type: 'category',
        data: Object.keys(obj),
        axisLabel: {
          rotate: '45',
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        minInterval: 1
      },
      series: [
        {
          data: Object.values(obj).map(item=>item.length),
          type: 'bar',
          name: '数量',
          barWidth: 20,
        }
      ]
    };

    option && myChart.setOption(option);

    window.onresize = () => {
      myChart.resize()
    }
  }

  const runPie = () => {
    const ownListData = ownNewsList.filter(item => item.author === username)
    const pieObjData = _.groupBy(ownListData, item => item.category.title)
    const pieList = []
    for (const item in pieObjData) {
      if (Object.hasOwnProperty.call(pieObjData, item)) {
        pieList.push({
          value: pieObjData[item].length,
          name: item
        })
      }
    }
    
    let myChart;
    if(!initPie) {
      myChart = echarts.init(pieRef.current)
      setInitPie(myChart)
    }else {
      myChart = initPie
    }
    let option;

    option = {
      title: {
        text: '当前用户新闻分类图示',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: pieList,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }

  const showDrawer = () => {
    setVisible(true)
    setTimeout(() => {
      runPie()
    }, 0);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <div className="site-card-wrapper">
      <Drawer
        width='500px'
        title='个人新闻分类'
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <div ref={pieRef} style={{ height: '350px', width: '100%', marginTop: '20px' }}></div>
      </Drawer>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" extra={<BarChartOutlined />}>
            <List
              size="small"
              dataSource={mostViewList}
              renderItem={(item) => <List.Item>
                <Tag key={item.id} color="green">
                  <a href={`#/news-manage/preview/${item.id}`}>
                    {item.title}
                  </a>
                </Tag>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title='用户点赞最多' extra={<BarChartOutlined />} >
            <List
              size="small"
              dataSource={mostStartList}
              renderItem={(item) => <List.Item>
                <Tag key={item.id} color="blue">
                  <a href={`#/news-manage/preview/${item.id}`}>
                    {item.title}
                  </a>
                </Tag>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <PieChartOutlined key="pie" onClick={showDrawer} />,
              <EditOutlined key="pie" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={<p><b>{region ? region : "全球"}</b> <span>{roleName}</span></p>}
            />
          </Card>
        </Col>
      </Row>
      
      <div ref={barRef} style={{ height: '260px', width: '100%', marginTop: '20px' }}></div>

    </div>
  )
}
