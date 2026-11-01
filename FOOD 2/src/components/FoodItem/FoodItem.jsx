import React, {useContext} from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext';

const FoodItem=({id,name,price,description,image})=> {

const {cartItems,addToCart,removeFromCart,isFavorite,toggleFavorite,foodRatings} = useContext(StoreContext);
const rating = foodRatings[id];

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img className="food-item-image" src={image} alt=""/>
        {/* new: "Bestseller" badge for highly-rated dishes */}
        {rating && rating.average >= 4.5 && (
          <span className="food-item-badge">&#9733; Bestseller</span>
        )}
        {/* new: favorite toggle, doesn't touch any existing markup/behaviour */}
        <span
          onClick={()=>toggleFavorite(id)}
          title={isFavorite(id)?"Remove from favorites":"Add to favorites"}
          className={`food-item-favorite ${isFavorite(id) ? "active" : ""}`}
        >
          {isFavorite(id) ? "\u2665" : "\u2661"}
        </span>
        {
          !cartItems[id]?<img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} alt=""/>
          :<div className='food-item-counter'>
             <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt=""/>
             <p>{cartItems[id]}</p>
             <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt=""/>
          </div>
        }
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
            <p>{name}</p>
            <img src={assets.rating_starts} alt=""/>
        </div>
        {rating ? <p style={{fontSize:"12px",color:"#676767",margin:"-6px 0 6px"}}>&#9733; {rating.average.toFixed(1)} ({rating.count})</p> : null}
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  )
}

export default FoodItem
