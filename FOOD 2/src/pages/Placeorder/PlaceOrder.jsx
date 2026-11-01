import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'

const  PlaceOrder=()=> {
  const {getTotalCartAmount,token,placeOrder,setCartItems,appliedCoupon}=useContext(StoreContext);
  const navigate=useNavigate();

  // step: "form" -> "payment" (only for ONLINE) -> "success"
  const [step,setStep]=useState("form");

  const [data,setData]=useState({
    firstName:"", lastName:"", email:"", street:"",
    city:"", state:"", zipCode:"", country:"", phone:""
  });
  const [paymentMethod,setPaymentMethod]=useState("COD");
  const [error,setError]=useState("");
  const [submitting,setSubmitting]=useState(false);
  const [placedOrder,setPlacedOrder]=useState(null);

  // ---- simulated payment fields (no real gateway; nothing is sent anywhere) ----
  const [payTab,setPayTab]=useState("upi");
  const [upiId,setUpiId]=useState("");
  const [card,setCard]=useState({ number:"", name:"", expiry:"", cvv:"" });

  const onChangeHandler=(event)=>{
    const {name,value}=event.target;
    setData((prev)=>({...prev,[name]:value}));
  }

  const subtotal = getTotalCartAmount();
  const deliveryFee = 2;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const submitOrder=async()=>{
    setError("");
    if(!token){
      setError("Please login first so your order can be saved to your account.");
      return;
    }
    setSubmitting(true);
    try{
      const order = await placeOrder({...data, paymentMethod});
      setPlacedOrder(order);
      setCartItems({});
      setStep("success");
    }catch(err){
      setError(err.message || "Could not place order. Is the backend running?");
      setStep("form");
    }finally{
      setSubmitting(false);
    }
  }

  const onDeliverySubmit=(event)=>{
    event.preventDefault();
    setError("");
    if(paymentMethod==="ONLINE"){
      setStep("payment");
    }else{
      submitOrder();
    }
  }

  const onPaySubmit=(event)=>{
    event.preventDefault();
    setError("");
    // purely simulated — validate the fields look filled in, then "process" briefly
    if(payTab==="upi" && !upiId.trim()){
      setError("Enter a UPI ID to continue.");
      return;
    }
    if(payTab==="card" && (!card.number || !card.name || !card.expiry || !card.cvv)){
      setError("Fill in all card details to continue.");
      return;
    }
    setSubmitting(true);
    setTimeout(()=>{
      submitOrder();
    }, 900); // brief simulated processing delay
  }

  // ---------------- Success screen ----------------
  if(step==="success"){
    return (
      <div className="order-success">
        <div className="order-success-icon">&#10003;</div>
        <h2>Order Placed Successfully!</h2>
        <p>
          {paymentMethod==="COD"
            ? "Your order has been placed. Pay in cash when it arrives."
            : "Your simulated payment went through and your order has been placed."}
        </p>
        {placedOrder && <p className="order-success-total">Order #{placedOrder.id} &middot; Total ${placedOrder.amount.toFixed(2)}</p>}
        <p className="order-success-eta">Estimated delivery: 30–40 minutes</p>
        <div className="order-success-actions">
          <button onClick={()=>navigate('/myorders')}>Track My Order</button>
          <button className="order-success-secondary" onClick={()=>navigate('/')}>Back to Menu</button>
        </div>
      </div>
    );
  }

  // ---------------- Simulated payment screen ----------------
  if(step==="payment"){
    return (
      <div className="payment-screen">
        <h2>Payment</h2>
        <p className="payment-amount">Amount to pay: <b>${total.toFixed(2)}</b></p>
        <p className="payment-disclaimer">This is a simulated payment for demo purposes — no real transaction occurs.</p>

        <div className="payment-tabs">
          <button type="button" className={payTab==="upi"?"active":""} onClick={()=>setPayTab("upi")}>UPI</button>
          <button type="button" className={payTab==="card"?"active":""} onClick={()=>setPayTab("card")}>Card</button>
        </div>

        <form onSubmit={onPaySubmit} className="payment-form">
          {payTab==="upi" ? (
            <div className="payment-field">
              <label>UPI ID</label>
              <input type="text" placeholder="yourname@upi" value={upiId} onChange={(e)=>setUpiId(e.target.value)} />
            </div>
          ) : (
            <>
              <div className="payment-field">
                <label>Card Number</label>
                <input type="text" maxLength={19} placeholder="1234 5678 9012 3456" value={card.number} onChange={(e)=>setCard((p)=>({...p,number:e.target.value}))} />
              </div>
              <div className="payment-field">
                <label>Name on Card</label>
                <input type="text" placeholder="Name on card" value={card.name} onChange={(e)=>setCard((p)=>({...p,name:e.target.value}))} />
              </div>
              <div className="payment-multi">
                <div className="payment-field">
                  <label>Expiry</label>
                  <input type="text" placeholder="MM/YY" maxLength={5} value={card.expiry} onChange={(e)=>setCard((p)=>({...p,expiry:e.target.value}))} />
                </div>
                <div className="payment-field">
                  <label>CVV</label>
                  <input type="password" maxLength={4} placeholder="123" value={card.cvv} onChange={(e)=>setCard((p)=>({...p,cvv:e.target.value}))} />
                </div>
              </div>
            </>
          )}

          {error && <p className="payment-error">{error}</p>}

          <div className="payment-actions">
            <button type="submit" disabled={submitting}>{submitting ? "Processing..." : `Pay $${total.toFixed(2)}`}</button>
            <button type="button" className="payment-back" onClick={()=>setStep("form")} disabled={submitting}>Back</button>
          </div>
        </form>
      </div>
    );
  }

  // ---------------- Delivery form (default) ----------------
  return (
    <form className='place-order' onSubmit={onDeliverySubmit}>
       <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
           <input name="firstName" value={data.firstName} onChange={onChangeHandler} type="text" placeholder='First Name' required/>
           <input name="lastName" value={data.lastName} onChange={onChangeHandler} type="text" placeholder='Last Name' required/>
        </div>
      
       <input name="email" value={data.email} onChange={onChangeHandler} type="email" placeholder="Email address" required/>
       <input name="street" value={data.street} onChange={onChangeHandler} type="text" placeholder='street' required/>
      
       <div className="multi-fields">
           <input name="city" value={data.city} onChange={onChangeHandler} type="text" placeholder='City' required/>
           <input name="state" value={data.state} onChange={onChangeHandler} type="text" placeholder='State' required/>
        </div>
        <div className="multi-fields">
           <input name="zipCode" value={data.zipCode} onChange={onChangeHandler} type="text" placeholder='Zip-code' required/>
           <input name="country" value={data.country} onChange={onChangeHandler} type="text" placeholder='Country' required/>
        </div>
        <input name="phone" value={data.phone} onChange={onChangeHandler} type="text" placeholder='Phone' required/>

        {/* payment method — COD places the order immediately; ONLINE goes to a simulated payment step */}
        <p className="title" style={{marginTop:"20px", fontSize:"18px"}}>Payment Method</p>
        <div className="payment-method-group">
          <label className={`payment-method-option ${paymentMethod==="COD" ? "selected" : ""}`}>
            <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod==="COD"} onChange={()=>setPaymentMethod("COD")}/>
            <span className="payment-method-icon">💵</span>
            <div>
              <p className="payment-method-title">Cash on Delivery</p>
              <p className="payment-method-desc">Pay with cash when your order arrives</p>
            </div>
          </label>
          <label className={`payment-method-option ${paymentMethod==="ONLINE" ? "selected" : ""}`}>
            <input type="radio" name="paymentMethod" value="ONLINE" checked={paymentMethod==="ONLINE"} onChange={()=>setPaymentMethod("ONLINE")}/>
            <span className="payment-method-icon">💳</span>
            <div>
              <p className="payment-method-title">Online Payment</p>
              <p className="payment-method-desc">UPI or Card — simulated for this demo</p>
            </div>
          </label>
        </div>
        </div>
        <div className="place-order-right">
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
              <b>${total.toFixed(2)}</b>
            </div>
          </div>
          {error?<p style={{color:"tomato",fontSize:"13px"}}>{error}</p>:null}
          <button type="submit" disabled={submitting}>
            {submitting ? "PLACING ORDER..." : paymentMethod==="ONLINE" ? "CONTINUE TO PAYMENT" : "PLACE ORDER (COD)"}
          </button>
        </div>
       
       </div>
    </form>
  )
}

export default PlaceOrder