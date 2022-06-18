import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import axios from 'axios'
import Home from '../../views/sand-box/home/Home'
import RoleList from '../../views/sand-box/right-menage/RoleList'
import RightList from '../../views/sand-box/right-menage/RightList'
import UserList from '../../views/sand-box/user-menage/UserList'
import NoPermission from '../../views/sand-box/no-permission/NoPermission'
import NewsAdd from '../../views/sand-box/news-menage/NewsAdd'
import NewsDraft from '../../views/sand-box/news-menage/NewsDraft'
import NewsCategory from '../../views/sand-box/news-menage/NewsCategory'
import AuditNews from '../../views/sand-box/audit-menage/AuditNews'
import AuditNewsList from '../../views/sand-box/audit-menage/AuditNewsList'
import UnPublishedNews from '../../views/sand-box/publish-menage/UnPublishedNews'
import publishedNews from '../../views/sand-box/publish-menage/PublishedNews'
import SunsetNews from '../../views/sand-box/publish-menage/SunsetNews'
import NewsPreview from '../../views/sand-box/news-menage/NewsPreview'

const LocalRouterMap = {
  '/home': Home,
  '/right-manage/role/list': RoleList,
  '/right-manage/right/list': RightList,
  '/user-manage/list': UserList,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/category": NewsCategory,
  "/news-manage/preview/:id": NewsPreview,
  "/audit-manage/audit": AuditNews,
  "/audit-manage/list": AuditNewsList,
  "/publish-manage/unpublished": UnPublishedNews,
  "/publish-manage/published": publishedNews,
  "/publish-manage/sunset": SunsetNews
}

export default function NewsRouter() {
  const { role:{rights} } = JSON.parse(localStorage.getItem('token'))
  const [backRouteList, setBackRouteList] = useState([])
  useEffect(() => {
    Promise.all([
      axios.get('/rights'),
      axios.get('/children')
    ]).then(res => {
      setBackRouteList([...res[0].data, ...res[1].data])
    })
  },[])

  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
  }

  const checkUserPermission = (item) => {
    return rights.includes(item.key)
  }

  return (
    <Switch>
      {
        backRouteList.map(item => {
          if(checkRoute(item) && checkUserPermission(item)) {
            return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact />
          }
          return null
        })
      }

      <Redirect from='/' to='/home' exact />
      {
        backRouteList.length > 0 && <Route path='*' component={NoPermission} />
      }
    </Switch>
  )
}
