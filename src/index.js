import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import App from './App.js'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import House from './pages/House.js';
import News from './pages/News.js';
import Profile from './pages/Profile.js';
import CityList from './pages/CityList';
import Map from './pages/Map.js'
import './index.css';
import "react-virtualized/styles.css";
import HouseDetail from "./pages/HouseDetail.js";
import Login from './pages/Login.js';
import FormikLearn from "./pages/FormikLearn.js";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Router>
      <Routes>
        {/* 路由重定向 */}
        <Route path='/' element={<Navigate to='/home' replace></Navigate>}></Route>

        {/* 父路由 */}
        <Route path='/' element={<App></App>}>
          {/* 子路由 */}
          <Route path='/home' element={<Home></Home>}></Route>
          <Route path='/house' element={<House></House>}></Route>
          <Route path='/news' element={<News></News>}></Route>
          <Route path='/profile' element={<Profile></Profile>}></Route>
        </Route>
        
        <Route path='/cityList' element={<CityList></CityList>}></Route>
        <Route path='/map' element={<Map></Map>}></Route>
        <Route path='/detail/:id' element={<HouseDetail></HouseDetail>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/formik' element={<FormikLearn></FormikLearn>}></Route>
      </Routes>
    </Router>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
