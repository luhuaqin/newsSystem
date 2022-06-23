import { Button } from 'antd'
import React from 'react'
import PublishPage from '../../../components/publish-menage/PublishPage'
import useDataSource from '../../../components/publish-menage/useDataSource'

export default function PublishedNews() {
  // 2===已发布
  const { dataSource, handleRelease } = useDataSource(2)

  return (
    <div>
      <PublishPage dataSource={dataSource} button={(id) => <Button danger onClick={() => handleRelease(id)}>下线</Button>} />
    </div>
  )
}
