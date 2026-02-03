import React, { useContext, useMemo } from 'react'
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({category, searchQuery}) => {

    const {food_list} = useContext(StoreContext)

    // Filter items based on category and search query
    const filteredItems = useMemo(() => {
        return food_list.filter((item) => {
            // Check category filter
            const categoryMatch = category === "All" || category === item.category;
            
            if (!categoryMatch) return false;
            
            // If no search query, show all items matching category
            if (!searchQuery || searchQuery.trim() === "") {
                return true;
            }
            
            // Perform case-insensitive search on item name, chef name, and business name
            const searchLower = searchQuery.toLowerCase();
            
            const itemNameMatch = item.name.toLowerCase().includes(searchLower);
            const chefNameMatch = item.chef_id && item.chef_id.toString().toLowerCase().includes(searchLower);
            const businessNameMatch = item.business_name && item.business_name.toLowerCase().includes(searchLower);
            
            return itemNameMatch || chefNameMatch || businessNameMatch;
        });
    }, [food_list, category, searchQuery]);

  return (
    <div className='food-display' id='food-display'>
        <h2>Top dishes near you</h2>
        {filteredItems.length > 0 ? (
            <div className='food-display-list'>
              {filteredItems.map((item, index) => (
                <FoodItem 
                    key={index} 
                    id={item._id} 
                    name={item.name} 
                    description={item.description} 
                    price={item.price} 
                    image={item.image}
                />
              ))}
            </div>
        ) : (
            <div className='no-results'>
                <p>No dishes found matching your search.</p>
            </div>
        )}
    </div>
  )
}

export default FoodDisplay
