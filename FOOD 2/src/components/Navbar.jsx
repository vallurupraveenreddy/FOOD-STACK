import React, { useContext } from 'react'
import './Navbar.css'
import { useState } from 'react';
import { assets } from "../assets/assets";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

// New cart/profile symbols — clean inline SVGs instead of the old bitmap icons,
// so they scale crisply and always match the site's colors in both themes.
const CartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3H4.5L5.4 5M5.4 5H20L18 12H7M5.4 5L7 12M7 12L5.6 15H18" stroke="#49557e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="19" r="1.4" fill="#49557e"/>
    <circle cx="17" cy="19" r="1.4" fill="#49557e"/>
  </svg>
);

const ProfileIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="15" cy="15" r="14" fill="#fff2ef" stroke="tomato" strokeWidth="1"/>
    <circle cx="15" cy="12" r="4.2" fill="tomato"/>
    <path d="M6.5 23.5C7.8 19.5 11 17.5 15 17.5C19 17.5 22.2 19.5 23.5 23.5" stroke="tomato" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const Navbar=({setShowLogin})=> {
  const [menu,setMenu]=useState();
  const [mobileMenuOpen,setMobileMenuOpen]=useState(false);
  const  {getTotalCartAmount,token,userName,logout,searchTerm,setSearchTerm,isAdmin,darkMode,toggleDarkMode}=useContext(StoreContext);
  const navigate=useNavigate();
  const location=useLocation();

  // new: Menu / Mobile-app / Contact-us used to be plain <a href="#id"> anchors,
  // which only worked while already on "/". Now they navigate home first (if
  // needed) and then scroll to the section, so they work from any page.
  const goToSection=(sectionId, menuName)=>{
    setMenu(menuName);
    setMobileMenuOpen(false);
    if(location.pathname !== '/'){
      navigate('/');
      setTimeout(()=>{
        document.getElementById(sectionId)?.scrollIntoView({behavior:"smooth"});
      }, 150);
    }else{
      document.getElementById(sectionId)?.scrollIntoView({behavior:"smooth"});
    }
  }

  // new: clicking the logo now always lands you at the very top of the home
  // page — previously, if you were already on "/" but scrolled down, nothing
  // visibly happened since React Router doesn't reset scroll on same-route nav.
  const goHome=(e)=>{
    e.preventDefault();
    setMenu("home");
    setMobileMenuOpen(false);
    if(location.pathname !== '/'){
      navigate('/');
    }
    window.scrollTo({top:0, behavior:"smooth"});
  }

  return (
    <div className='navbar'>
      <a href='/' onClick={goHome}><img src={assets.logo} className='logo' alt="nothing"/></a>

      {/* new: hamburger toggle — the nav links used to just disappear on mobile
          with no way to reach them at all. */}
      <button
        className="navbar-hamburger"
        onClick={()=>setMobileMenuOpen((v)=>!v)}
        aria-label="Toggle menu"
      >
        <span/><span/><span/>
      </button>

      <ul className={`navbar-menu ${mobileMenuOpen ? "open" : ""}`}>
        <a href='/' onClick={goHome} className={menu==="home"?"active":" "}>Home</a>
        <a onClick={()=>goToSection("explore-menu","menu")} className={menu==="menu"?"active":" "}>Menu</a>
        <a onClick={()=>goToSection("app-download","mobile-app")} className={menu==="mobile-app"?"active":" "}>Mobile-app</a>
        <Link to='/contact' onClick={()=>{setMenu("contact-us"); setMobileMenuOpen(false);}} className={menu==="contact-us"?"active":" "}>Contact us</Link>
        <Link to='/favorites' onClick={()=>{setMenu("favorites"); setMobileMenuOpen(false);}} className={menu==="favorites"?"active":" "}>Favorites</Link>
      </ul>
      <div className="navbar-right">
        {/* new: functional search box (was a static icon before) */}
        <div className="navbar-search-box">
          <img src={assets.search_icon} alt=""/>
          <input
            type="text"
            placeholder="Search dishes"
            value={searchTerm}
            onChange={(e)=>{
              const value = e.target.value;
              const justStarted = !searchTerm && value;
              setSearchTerm(value);
              if(location.pathname !== '/'){
                navigate('/');
              }
              if(justStarted){
                // scroll to the results once, so typing visibly does something —
                // doesn't re-scroll on every keystroke after that
                setTimeout(()=>{
                  document.getElementById("food-display")?.scrollIntoView({behavior:"smooth", block:"start"});
                }, 150);
              }
            }}
          />
          {searchTerm ? <span onClick={()=>setSearchTerm("")} className="navbar-search-clear" title="Clear search">&times;</span> : null}
        </div>
        <div className="navbar-search-icon">
          <Link to='/cart'><CartIcon/></Link>
          <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div>
        {/* new: theme toggle, beside the cart icon, visible on every page */}
        <button
          className={`navbar-theme-toggle ${darkMode ? "dark" : "light"}`}
          onClick={toggleDarkMode}
          title="Toggle light / dark mode"
          aria-label="Toggle light / dark mode"
        >
          {darkMode ? "\u{1F319}" : "\u2600\uFE0F"}
        </button>
        {!token
          ? <button onClick={()=>setShowLogin(true)}>Sign in</button>
          : <div className="navbar-profile">
              <ProfileIcon/>
              <ul className="navbar-profile-dropdown">
                <li className="navbar-username">Hi, {userName}</li>
                <li onClick={()=>navigate('/profile')}><img src={assets.profile_icon} alt=""/><p>My Profile</p></li>
                <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} alt=""/><p>Orders</p></li>
                <li onClick={()=>navigate('/favorites')}><img src={assets.parcel_icon} alt=""/><p>Favorites</p></li>
                {isAdmin && <li onClick={()=>navigate('/admin')}><img src={assets.bag_icon} alt=""/><p>Admin Dashboard</p></li>}
                <hr/>
                <li onClick={logout}><img src={assets.logout_icon} alt=""/><p>Logout</p></li>
              </ul>
            </div>
        }
      </div>
    </div>
  )
}

export default Navbar
