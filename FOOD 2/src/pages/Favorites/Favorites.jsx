import React, { useContext } from 'react'
import './Favorites.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem'

const Favorites = () => {
  const { food_list, favoriteItems, toggleFavorite } = useContext(StoreContext);

  // Recomputed from context state on every render, so adding/removing a
  // favorite (from here or from the heart icon anywhere else in the app)
  // updates this list immediately — no refresh needed.
  const favoriteFoods = food_list.filter((item) => favoriteItems[item._id]);

  return (
    <div className='favorites'>
      <h2>Your Favorites</h2>
      {favoriteFoods.length === 0
        ? <p className='favorites-empty'>No favorites yet — tap the heart on any dish to save it here.</p>
        : <div className="favorites-list">
            {favoriteFoods.map((item) => (
              <div key={item._id} className="favorites-item">
                <FoodItem id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
                <button className="favorites-remove-btn" onClick={() => toggleFavorite(item._id)}>
                  Remove from Favorites
                </button>
              </div>
            ))}
          </div>
      }
    </div>
  )
}

export default Favorites
