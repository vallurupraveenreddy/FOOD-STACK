import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const LoginPopup=({setShowLogin})=> {
    const [currState,setCurrState]=useState("Login")
    const {login,register} = useContext(StoreContext);

    // ---- new: real backend-backed auth state ----
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState("");
    const [loading,setLoading]=useState(false);

    const onSubmit=async(event)=>{
        event.preventDefault();
        setError("");
        setLoading(true);
        try{
            if(currState==="Login"){
                await login(email,password);
            }else{
                await register(name,email,password);
            }
            setShowLogin(false);
        }catch(err){
            setError(err.message || "Something went wrong. Please try again.");
        }finally{
            setLoading(false);
        }
    }

  return (
    <div className='login-popup'>
      <form className='login-popup-container' onSubmit={onSubmit}>
        <div className='login-popup-title'>
            <h2>{currState}</h2>
            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt=""/>
        </div>
        <div className="login-popup-inputs">
          {currState==="Login"?<></>:<input value={name} onChange={(e)=>setName(e.target.value)} type='text' placeholder="Your name" required/>}
            
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder='Your email' required/>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="password" required minLength={currState==="Login"?undefined:8}/>
        </div>
        {error?<p style={{color:"tomato",fontSize:"13px",margin:0}}>{error}</p>:null}
        <button type="submit" disabled={loading}>{loading?"Please wait...":(currState==="Sign Up"?"Create account":"Login")}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required/>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis.</p>
        </div>
        {currState==="Login"?
       <p>Create a new account?<span onClick={()=>setCurrState("Sign Up")}>Click Here</span></p>:
       <p>Already have an account?<span onClick={()=>setCurrState("Login")}>Login here</span></p>
        } 
        </form>
    </div>
  )
}

export default LoginPopup;