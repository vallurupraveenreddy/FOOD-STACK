import React, { useContext, useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/cart/Cart'
import PlaceOrder from './pages/Placeorder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LogonPopup/LoginPopup'
import Favorites from './pages/Favorites/Favorites'
import MyOrders from './pages/MyOrders/MyOrders'
import Profile from './pages/Profile/Profile'
import AdminDashboard from './pages/Admin/AdminDashboard'
import Contact from './pages/Contact/Contact'
import NotFound from './pages/NotFound/NotFound'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import { StoreContext } from './context/StoreContext'

const App=()=>{
  const [showLogin,setShowLogin]=useState(false);
  const { toast } = useContext(StoreContext);
  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
    {/* new: lightweight toast notifications for cart/favorites/login/coupon feedback */}
    {toast && (
      <div className={`app-toast ${toast.type}`}>{toast.message}</div>
    )}
    <div className='app'>
      <Navbar setShowLogin={setShowLogin}/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/order" element={<PlaceOrder/>}/>
        <Route path="/favorites" element={<Favorites/>}/>
        <Route path="/myorders" element={<MyOrders/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/admin" element={<AdminDashboard/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </div>
    <ScrollToTop/>
    <Footer/>
    </>
    
    
  )
}

export default App
