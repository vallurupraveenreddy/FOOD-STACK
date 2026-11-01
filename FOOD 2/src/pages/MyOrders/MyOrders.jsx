import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const STEPS = ["PLACED", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];

const StatusStepper = ({ status }) => {
  if (status === "CANCELLED") {
    return <p className="my-orders-cancelled">&#10060; Order Cancelled</p>;
  }
  const currentIndex = STEPS.indexOf(status);
  return (
    <div className="my-orders-stepper">
      {STEPS.map((step, i) => (
        <div key={step} className={`my-orders-step ${i <= currentIndex ? "done" : ""}`}>
          <span className="my-orders-step-dot">{i <= currentIndex ? "\u2713" : "\u25cb"}</span>
          <span className="my-orders-step-label">{step.replace(/_/g, " ")}</span>
        </div>
      ))}
    </div>
  );
};

const RateDishForm = ({ foodItemId, foodName, addReview, onDone }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setSaving(true);
    setError("");
    try {
      await addReview(foodItemId, rating, comment);
      onDone();
    } catch (err) {
      setError(err.message || "Could not save your review.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="my-orders-rate-form">
      <p>Rate {foodName}</p>
      <div className="my-orders-rate-stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} onClick={() => setRating(n)} className={n <= rating ? "filled" : ""}>&#9733;</span>
        ))}
      </div>
      <textarea rows={2} placeholder="Write a short review (optional)" value={comment} onChange={(e) => setComment(e.target.value)} />
      {error && <p className="my-orders-error">{error}</p>}
      <div className="my-orders-rate-actions">
        <button type="button" onClick={submit} disabled={saving}>{saving ? "Saving..." : "Submit"}</button>
        <button type="button" className="my-orders-cancel" onClick={onDone} disabled={saving}>Cancel</button>
      </div>
    </div>
  );
};

const MyOrders = () => {
  const { token, fetchMyOrders, addReview, addToCart, showToast } = useContext(StoreContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingItem, setRatingItem] = useState(null); // foodItemId currently being rated
  const [ratedItems, setRatedItems] = useState({}); // { foodItemId: true } for this session

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchMyOrders();
      setOrders(data || []);
    } catch (err) {
      setError(err.message || "Could not load your orders. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const reorder = (order) => {
    order.items.forEach((it) => {
      for (let i = 0; i < it.quantity; i++) {
        addToCart(String(it.foodItem.id));
      }
    });
    showToast && showToast("Items added to your cart");
    navigate('/cart');
  };

  if (!token) {
    return <div className='my-orders'><p>Please login to see your order history.</p></div>;
  }

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      {loading && <p>Loading your orders...</p>}
      {error && <p className='my-orders-error'>{error}</p>}
      {!loading && !error && orders.length === 0 && <p>You haven't placed any orders yet.</p>}

      <div className="container">
        {orders.map((order, index) => (
          <div key={index} className='my-orders-order-card'>
            <div className="my-orders-order-header">
              <span>Order #{order.id}</span>
              <span>{order.createdAt ? new Date(order.createdAt).toLocaleString(undefined,{ dateStyle:"medium", timeStyle:"short" }) : ""}</span>
            </div>
            <div className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>
                {order.items.map((it, i) => (
                  i === order.items.length - 1
                    ? `${it.foodItem.name} x ${it.quantity}`
                    : `${it.foodItem.name} x ${it.quantity}, `
                ))}
              </p>
              <p>${order.amount.toFixed(2)}</p>
              <p>Items: {order.items.length}</p>
              <p>{order.paymentMethod === "ONLINE" ? "Online (simulated)" : "Cash on Delivery"}</p>
              <div className="my-orders-order-buttons">
                <button onClick={() => reorder(order)}>Reorder</button>
                <button onClick={loadOrders}>Refresh</button>
              </div>
            </div>
            {order.street && (
              <p className="my-orders-address">
                Delivering to: {order.street}, {order.city}, {order.state} {order.zipCode}, {order.country}
              </p>
            )}

            <StatusStepper status={order.status} />

            {order.status === "DELIVERED" && (
              <div className="my-orders-review-row">
                {order.items.map((it) => {
                  const key = `${order.id}-${it.foodItem.id}`;
                  const isRating = ratingItem === key;
                  const alreadyRated = ratedItems[key];
                  return (
                    <div key={key} className="my-orders-review-item">
                      {alreadyRated
                        ? <p className="my-orders-thanks">&#10003; Thanks for rating {it.foodItem.name}!</p>
                        : isRating
                          ? <RateDishForm
                              foodItemId={it.foodItem.id}
                              foodName={it.foodItem.name}
                              addReview={addReview}
                              onDone={() => { setRatingItem(null); setRatedItems((p)=>({...p,[key]:true})); }}
                            />
                          : <button className="my-orders-rate-btn" onClick={() => setRatingItem(key)}>
                              Rate {it.foodItem.name}
                            </button>
                      }
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrders
