import { message, Modal, notification } from "antd"
import axios from "axios"
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react"

function useDataSource(type){
  const { username } = JSON.parse(localStorage.getItem('token'))

  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    axios.get(`/news?username=${username}&publishState=${type}&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [username, type])


  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认',
      icon: <ExclamationCircleOutlined />,
      content: '您确认删除该新闻吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setDataSource(dataSource.filter(item=>item.id!==id))
        axios.delete(`/news/${id}`).then(res=>{
          message.success('删除成功')
        })
      }
    });
  }

  const handlePublish = (id) => {
    Modal.confirm({
      title: '确认',
      icon: <ExclamationCircleOutlined />,
      content: '您确认发布该新闻吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setDataSource(dataSource.filter(item=>item.id!==id))
        axios.patch(`/news/${id}`, {
          "publishState": 2,
          "publishTime":Date.now()
        }).then(res=>{
          notification.info({
            message: `通知`,
            description:
              `您可以到【发布管理/已经发布】中查看您的新闻`,
            placement:"bottomRight"
          });
        })
      }
    });
  }

  const handleRelease = (id) => {
    Modal.confirm({
      title: '确认',
      icon: <ExclamationCircleOutlined />,
      content: '您确认下线该新闻吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setDataSource(dataSource.filter(item=>item.id!==id))
        axios.patch(`/news/${id}`, {
          "publishState": 3,
        }).then(res=>{
          notification.info({
            message: `通知`,
            description:
              `您可以到【发布管理/已下线】中查看您的新闻`,
            placement:"bottomRight"
          });
        })
      }
    });
  }


  return {
    dataSource,
    handleRelease,
    handlePublish,
    handleDelete
  }
}

export default useDataSource
