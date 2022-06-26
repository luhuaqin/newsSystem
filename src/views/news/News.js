import { Card, Col, List, PageHeader, Row, Tag } from 'antd'
import axios from 'axios'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'

export default function News(props) {
  const [newsList, setNewsList] = useState([])
  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category').then(res => {
      // setNewsList(res.data)
      setNewsList(Object.entries(_.groupBy(res.data, item => item.category.title)))
    })
  }, [])
  
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="全球大新闻"
        subTitle="查看新闻"
      />
      <div className="site-card-wrapper">
        <Row gutter={[16, 16]}>
          {
            newsList?.map(item => {
              return (
                <Col span={8} key={item[0]}>
                  <Card
                    title={item[0]}
                    hoverable={true}
                    key={item[0]}
                  >
                    <List
                      size="small"
                      key={item[1][0].id}
                      pagination={{
                        pageSize: 3
                      }}
                      dataSource={item[1]}
                      renderItem={(item) => <List.Item key={item.id}>
                        <Tag key={item.id} color='blue' onClick={() => {
                          props.history.push(`/detail/${item.id}`)
                        }}>
                          {item.title}
                        </Tag>
                      </List.Item>}
                    />
                  </Card>
                </Col>
              )
            })
          }
        </Row>
      </div>
    </div>
  )
}
