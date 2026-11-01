import React from 'react'
import './Header.css'

function Header() {
  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Order your favourite food here</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. 
          Laboriosam reiciendis aut, amet reprehenderit dicta eaque?
        </p>

        <button 
  onClick={() => {
    document.getElementById("explore-menu").scrollIntoView({
      behavior: "smooth"
    });
  }}
>
  View Menu
</button>
      </div>
    </div>
  )
}

export default Header