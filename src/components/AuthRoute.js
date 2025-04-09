import App from '../App.js'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { isLoginContext, setIsLoginContext } from "../utils/auth.js";
import React, { useContext, useState } from "react";
import { instance } from "../utils/api.js";

// import Home from '../pages/Home';
// import House from '../pages/House.js';
// import News from '../pages/News.js';
// import Profile from '../pages/Profile.js';
// import CityList from '../pages/CityList';
// import Map from '../pages/Map.js';
// import HouseDetail from "../pages/HouseDetail.js";
// import Login from '../pages/Login.js';
// import Rent from "../pages/Rent.js";
// import RentAdd from "../pages/RentAdd.js";
// import RentSearch from "../pages/RentSearch.js";
// import FormikLearn from "../pages/FormikLearn.js";

const Home = React.lazy(() => import('../pages/Home'))
const House = React.lazy(() => import('../pages/House.js'))
const News = React.lazy(() => import('../pages/News.js'))
const Profile = React.lazy(() => import('../pages/Profile.js'))
const CityList = React.lazy(() => import('../pages/CityList'))
const Map = React.lazy(() => import('../pages/Map.js'))
const HouseDetail = React.lazy(() => import('../pages/HouseDetail.js'))
const Login = React.lazy(() => import('../pages/Login.js'))
const Rent = React.lazy(() => import('../pages/Rent.js'))
const RentAdd = React.lazy(() => import('../pages/RentAdd.js'))
const RentSearch = React.lazy(() => import('../pages/RentSearch.js'))
const FormikLearn = React.lazy(() => import('../pages/FormikLearn.js'))

function loginRoute(isLogin) { 
    return (route) => {
        console.log('AuthRoute isLogin: ', isLogin);
        if (isLogin) {
            return route
        }
        return <Route path={route.props.path} element={<Navigate to='/login' state={{from: {pathname: route.props.path}}} replace></Navigate>}></Route>
    }
}

export default function AuthRoute() {
    const [isLogin, setIsLogin] = useState(useContext(isLoginContext))

    // 将修改登录状态函数传递给网络层
    instance.setIsLogin = setIsLogin

    return <isLoginContext.Provider value={isLogin}>
        <setIsLoginContext.Provider value={setIsLogin}>
            <React.Suspense>
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
                        {loginRoute(isLogin)(<Route path='/rent' element={<Rent></Rent>}></Route>)}
                        {loginRoute(isLogin)(<Route path='/rent/add' element={<RentAdd></RentAdd>}></Route>)}
                        {loginRoute(isLogin)(<Route path='/rent/search' element={<RentSearch></RentSearch>}></Route>)}
                        <Route path='/formik' element={<FormikLearn></FormikLearn>}></Route>
                    </Routes>
                </Router>
            </React.Suspense>
        </setIsLoginContext.Provider>
    </isLoginContext.Provider>
}