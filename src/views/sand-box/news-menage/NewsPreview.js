import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd';
import axios from 'axios';
import moment from 'moment';

export default function NewsPreview(props) {
  const [detailObj, setDetailObj] = useState(null)

  useEffect(() => {
    axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
      const obj = res.data
      setDetailObj(obj)
      console.log(obj)
    })
  }, [props.match.params.id])

  const auditStateList = ['未审核', '审核中', '已通过', '未通过']
  const publishStateList = ['未发布', '待发布', '已上线', '已下线']
  
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => window.history.back()}
        title={detailObj?.title}
        subTitle={detailObj?.category?.title}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">{detailObj?.author}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {
              moment(detailObj?.createTime).format('YYYY-MM-DD HH:mm:ss')
            }
          </Descriptions.Item>
          <Descriptions.Item label="发布时间">
            {
              detailObj?.publishTime ? moment(detailObj?.publishTime).format('YYYY-MM-DD HH:mm:ss'): '-'
            }
          </Descriptions.Item>
          <Descriptions.Item label="区域">{detailObj?.region}</Descriptions.Item>
          <Descriptions.Item label="审核状态">
            { auditStateList[detailObj?.auditState] }
          </Descriptions.Item>
          <Descriptions.Item label="发布状态">
            { publishStateList[detailObj?.publishState] }
          </Descriptions.Item>
          <Descriptions.Item label="访问数量">{detailObj?.view}</Descriptions.Item>
          <Descriptions.Item label="点赞数量">{detailObj?.star}</Descriptions.Item>
          <Descriptions.Item label="评论数量">{detailObj?.auditState}</Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <p style={{ textAlign: 'center' }}>内容</p>
      <div dangerouslySetInnerHTML={{
        __html: detailObj?.content
      }} style={{ border: '1px solid rgba(0, 0, 0, 0.2)', margin: '16px 24px', padding: '10px' }}>
      </div>
    </div>
  )
}
