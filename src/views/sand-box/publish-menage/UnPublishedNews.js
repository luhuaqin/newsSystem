import { Button } from 'antd'
import React from 'react'
import PublishPage from '../../../components/publish-menage/PublishPage'
import useDataSource from '../../../components/publish-menage/useDataSource'

export default function UnPublishedNews() {
  // 1===待发布
  const { dataSource, handlePublish } = useDataSource(1)

  return (
    <div>
      <PublishPage dataSource={dataSource} button={(id) => <Button type='primary' onClick={() => handlePublish(id)}>发布</Button>} />
    </div>
  )
}
