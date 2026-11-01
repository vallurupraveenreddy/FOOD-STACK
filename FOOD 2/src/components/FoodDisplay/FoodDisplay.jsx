import React, { useContext, useState } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({category}) =>{
    const {food_list,searchTerm,setSearchTerm,foodRatings}=useContext(StoreContext);
    const [sortBy,setSortBy]=useState("default");

    // new: filter by the navbar search box, on top of the existing category filter
    const query = (searchTerm||"").trim().toLowerCase();

    const visibleItems = food_list.filter((item)=>{
        const matchesCategory = category==="All"||category===item.category;
        const matchesSearch = !query
            || item.name.toLowerCase().includes(query)
            || item.category.toLowerCase().includes(query)
            || (item.description||"").toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    });

    const ratingOf = (id) => (foodRatings[id] ? foodRatings[id].average : 0);

    const sortedItems = [...visibleItems].sort((a,b)=>{
        if(sortBy==="price-asc") return a.price-b.price;
        if(sortBy==="price-desc") return b.price-a.price;
        if(sortBy==="name-asc") return a.name.localeCompare(b.name);
        if(sortBy==="rating-desc") return ratingOf(b._id)-ratingOf(a._id);
        return 0; // "default" keeps original order
    });

    const hasActiveFilters = query || (category && category!=="All") || sortBy!=="default";

    const clearFilters = () => {
        setSearchTerm("");
        setSortBy("default");
        // category itself is controlled by the parent Home page's ExploreMenu selection,
        // so clearing it here isn't possible without lifting state further — sort + search
        // are the two things this component can reset on its own.
    };

  return (
    <div className='food-display' id='food-display'>
      <div className="food-display-header">
        <h2>Top Dishes Near me</h2>
        <div className="food-display-controls">
          {/* new: sort control, additive to the existing category filter */}
          <select className="food-display-sort" value={sortBy} onChange={(e)=>setSortBy(e.target.value)}>
            <option value="default">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="rating-desc">Rating: High to Low</option>
          </select>
          {hasActiveFilters && (
            <button type="button" className="food-display-clear" onClick={clearFilters}>Clear filters</button>
          )}
        </div>
      </div>
      <div className="food-display-list">
        {sortedItems.map((item,index)=>(
            <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
        ))}
        {sortedItems.length===0 && (
          <div className="food-display-empty">
            <p>No dishes match your search.</p>
            <button type="button" onClick={clearFilters}>Clear filters</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FoodDisplay
