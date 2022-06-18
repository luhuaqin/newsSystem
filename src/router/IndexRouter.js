import React from 'react'
import { Redirect } from 'react-router-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import Login from '../views/Login/Login'
import NewsSandBox from '../views/sand-box/NewsSandBox'

export default function IndexRouter() {
  return (
    <HashRouter>
      <Switch>
        <Route path='/login' component={Login}/>
        <Route path='/' render={() => localStorage.getItem('token') ? <NewsSandBox /> : <Redirect to='/login' />} />
      </Switch>
    </HashRouter>
  )
}
