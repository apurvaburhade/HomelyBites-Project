import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";
export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const[cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000"
    const [token, setToken] = useState('')
    const [customer, setCustomer] = useState(null)
    const [userRole, setUserRole] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [dynamicFoodList, setDynamicFoodList] = useState(food_list)

    const addToCart = (itemId) => {
        if(!cartItems[itemId]){
            setCartItems((prev)=>({...prev,[itemId]:1}))
        }
        else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems){
            if (cartItems[item] > 0){
                let itemInfo = dynamicFoodList.find((product)=>product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }  
        }
        return totalAmount;
    }

    // Fetch menu data from backend
    const fetchMenuData = async (authToken) => {
        try {
            console.log('[StoreContext] Fetching menu data from API...')
            const response = await fetch(`${url}/customer/dashboard/home`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            
            console.log('[StoreContext] API Response:', data)
            
            if (data.status === 'success' && data.data && data.data.popularItems) {
                console.log(`[StoreContext] Found ${data.data.popularItems.length} popular items`)
                
                // Transform backend menu items to match food_list format
                const transformedItems = data.data.popularItems.map((item) => {
                    const foodItem = {
                        _id: item.item_id.toString(),
                        name: item.name,
                        image: item.image_url || null,
                        price: parseFloat(item.base_price),
                        description: item.description,
                        category: "All",
                        chef_id: item.chef_id,
                        business_name: item.business_name
                    }
                    console.log(`  [Transform] "${item.name}" - image_url: "${item.image_url}"`)
                    return foodItem
                })
                
                console.log('[StoreContext] Successfully transformed items, updating state...')
                // Merge with hardcoded list to ensure we always have some items
                setDynamicFoodList([...transformedItems, ...food_list])
            } else {
                console.log('[StoreContext] Invalid API response, using hardcoded menu')
                // Fallback to hardcoded list if API fails
                setDynamicFoodList(food_list)
            }
        } catch (error) {
            console.error('[StoreContext] Error fetching menu data:', error)
            // Fallback to hardcoded list if API fails
            setDynamicFoodList(food_list)
        }
    }

    useEffect(()=>{
        console.log('[StoreContext] useEffect initializing...')
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("userRole");
        
        if (storedToken) {
            console.log('[StoreContext] User authenticated, fetching menu data')
            setToken(storedToken);
            setUserRole(storedRole);
            setIsAuthenticated(true);
            
            // Fetch menu data from backend
            fetchMenuData(storedToken)
            
            // Fetch customer profile
            fetch(`${url}/customer/dashboard/settings`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success' && data.data) {
                    setCustomer(data.data);
                }
            })
            .catch(err => console.error('Error fetching customer profile:', err))
        } else {
            // Use hardcoded list if not authenticated
            setDynamicFoodList(food_list)
        }
    },[])

    const contextValue = {
        food_list: dynamicFoodList,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        customer,
        setCustomer,
        userRole,
        setUserRole,
        isAuthenticated,
        setIsAuthenticated
    }


    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}


export default StoreContextProvider;