import React from 'react'
import { TabBar } from 'antd-mobile'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import './assets/fonts/iconfont.css'
import './App.scss'

function App() {
  const tabs = [
    {
      key: '/home',
      title: '首页',
      icon: 'icon-ind',
    },
    {
      key: '/house',
      title: '找房',
      icon: 'icon-findHouse',
    },
    {
      key: '/news',
      title: '资讯',
      icon: 'icon-infom',
    },
    {
      key: '/profile',
      title: '我的',
      icon: 'icon-my',
    },
  ]

  const location = useLocation()
  const navigate = useNavigate()
  console.log('-----', location.pathname);

  console.log('App state: ', location.state);
  
  return (<div className='app'>
    <div className='app-content'>
      <Outlet></Outlet>
    </div>
    <TabBar activeKey={location.pathname} defaultActiveKey='home' safeArea onChange={(key) => navigate(key)}>
      {tabs.map(item => (
        <TabBar.Item 
          key={item.key} 
          icon={(active) => active ? <i className={`active iconfont ${item.icon}`} /> : <i className={`iconfont ${item.icon}`} />} 
          title={(active) => active ? <span className={`active`}>{item.title}</span> : <span>{item.title}</span>} 
        />
      ))}
    </TabBar>
  </div>)
}

export default App;
