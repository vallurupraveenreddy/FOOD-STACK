import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {

  const {cartItems,food_list,addToCart,removeFromCart,getTotalCartAmount,token,appliedCoupon,couponError,applyCoupon,clearCoupon}=useContext(StoreContext);
  const [promoInput,setPromoInput]=useState("");
  const [applying,setApplying]=useState(false);

  const navigate=useNavigate();

  const isCartEmpty = Object.values(cartItems).every((qty)=>!qty || qty<=0);

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal===0?0:2;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const onApplyPromo=async()=>{
    if(!promoInput.trim()) return;
    if(!token){
      navigate('/');
      return;
    }
    setApplying(true);
    await applyCoupon(promoInput.trim());
    setApplying(false);
  }

  // new: proper empty-cart state instead of just a blank list
  if(isCartEmpty){
    return (
      <div className="cart-empty">
        <span className="cart-empty-icon">🛒</span>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet. Let's fix that!</p>
        <button onClick={()=>navigate('/')}>Browse Menu</button>
      </div>
    );
  }

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
            <p>Items</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
        </div>
        <br/>
        <hr/>
        {food_list.map((item,index)=>{
             if(cartItems[item._id]>0){
              return (
                <div>
                <div className='cart-items-title cart-items-item'>
                  <img src={item.image} alt=""/>
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <div className="cart-item-qty">
                    <button type="button" onClick={()=>removeFromCart(item._id)}>−</button>
                    <p>{cartItems[item._id]}</p>
                    <button type="button" onClick={()=>addToCart(item._id)}>+</button>
                  </div>
                  <p>${item.price*cartItems[item._id]}</p>
                 </div>
                 <hr/>
               </div>
              )
             }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${subtotal}</p>
            </div>
            <hr/>
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${deliveryFee}</p>
            </div>
            {appliedCoupon?
            <>
            <hr/>
            <div className="cart-total-details">
              <p>Discount ({appliedCoupon.code})</p>
              <p>-${discount.toFixed(2)}</p>
            </div>
            </>
            :null}
            <hr/>
            <div className="cart-total-details">
              <b>Total</b>
              <b>${subtotal===0?0:total.toFixed(2)}</b>
            </div>
          </div>
          <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>IF U HAVE A PROMOCODE,ENTER IT HERE</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder='promo code' value={promoInput} onChange={(e)=>setPromoInput(e.target.value)}/>
              <button type="button" onClick={onApplyPromo} disabled={applying}>{applying?"...":"Submit"}</button>
            </div>
            {appliedCoupon && <p style={{color:"#2e7d32",fontSize:"13px",marginTop:"8px"}}>"{appliedCoupon.code}" applied — you saved ${discount.toFixed(2)}! <span style={{textDecoration:"underline",cursor:"pointer"}} onClick={clearCoupon}>Remove</span></p>}
            {couponError && <p style={{color:"tomato",fontSize:"13px",marginTop:"8px"}}>{couponError}</p>}
            <p style={{color:"#9c9c9c",fontSize:"12px",marginTop:"8px"}}>Try: WELCOME50, FIRSTORDER, FOOD20</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
