import { Button } from 'antd'
import React from 'react'
import PublishPage from '../../../components/publish-menage/PublishPage'
import useDataSource from '../../../components/publish-menage/useDataSource'

export default function SunsetNews() {
  // 3===已下线
  const { dataSource, handleDelete } = useDataSource(3)

  return (
    <div>
      <PublishPage dataSource={dataSource} button={(id) => <Button type='primary' danger onClick={() => handleDelete(id)}>删除</Button>} />
    </div>
  )
}

