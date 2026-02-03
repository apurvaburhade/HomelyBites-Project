const BASE_URL = 'http://localhost:4000';

// Get token from localStorage
const getToken = () => localStorage.getItem('homeChefToken');

// Set headers with authorization
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

// HomeChef Authentication
export const homeChefService = {
  // Sign up
  signup: async (businessName, email, password, phoneNumber) => {
    try {
      const response = await fetch(`${BASE_URL}/homechef/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: businessName,
          email,
          password_hash: password,
          phone_number: phoneNumber,
        }),
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },

  // Sign in
  signin: async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/homechef/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.data?.token) {
        localStorage.setItem('homeChefToken', data.data.token);
        localStorage.setItem('homeChefInfo', JSON.stringify(data.data));
      }
      return data;
    } catch (error) {
      return { error: error.message };
    }
  },

  // Sign out
  signout: () => {
    localStorage.removeItem('homeChefToken');
    localStorage.removeItem('homeChefInfo');
  },

  // Get current chef info
  getCurrentChef: () => {
    const chefInfo = localStorage.getItem('homeChefInfo');
    return chefInfo ? JSON.parse(chefInfo) : null;
  },

  // Menu operations
  addMenuItem: async (name, basePrice, description, imageFile = null) => {
    try {
      const token = getToken()
      
      // Create FormData for multipart/form-data
      const formData = new FormData()
      formData.append('name', name)
      formData.append('base_price', basePrice)
      formData.append('description', description || '')
      
      // Append image if provided
      if (imageFile) {
        formData.append('image', imageFile)
      }

      const response = await fetch(`${BASE_URL}/homechef/menu`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header; let the browser set it with the boundary
        },
        body: formData,
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },

  // Get all menu items for chef
  getMenuItems: async () => {
    try {
      const response = await fetch(`${BASE_URL}/homechef/menu`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },

  // Update menu item
  updateMenuItem: async (itemId, name, basePrice, isAvailable) => {
    try {
      const response = await fetch(`${BASE_URL}/homechef/menu/${itemId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          name,
          base_price: basePrice,
          is_available: isAvailable,
        }),
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },

  // Service areas
  addServiceArea: async (pincode, deliveryFee) => {
    try {
      const response = await fetch(`${BASE_URL}/homechef/service-area`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          pincode,
          delivery_fee: deliveryFee,
        }),
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },

  // Get service areas
  getServiceAreas: async () => {
    try {
      const response = await fetch(`${BASE_URL}/homechef/service-areas`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },

  // Delete service area
  deleteServiceArea: async (areaId) => {
    try {
      const response = await fetch(`${BASE_URL}/homechef/service-areas/${areaId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },

  // Orders
  getOrders: async () => {
    try {
      const token = getToken()
      console.log('[homeChefService] Getting orders, token exists:', !!token)
      
      if (!token) {
        console.error('[homeChefService] No token found in localStorage')
        return { 
          status: 'error', 
          error: 'Authentication token not found. Please log in again.' 
        }
      }

      const response = await fetch(`${BASE_URL}/homechef/orders`, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      console.log('[homeChefService] Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('[homeChefService] HTTP error:', response.status, errorText)
        return {
          status: 'error',
          error: `Server error: ${response.status} ${response.statusText}`
        }
      }

      const data = await response.json()
      console.log('[homeChefService] Orders response:', data)
      return data
    } catch (error) {
      console.error('[homeChefService] getOrders error:', error)
      return { 
        error: `Failed to fetch orders: ${error.message}` 
      }
    }
  },

  // Get order details
  getOrderDetails: async (orderId) => {
    try {
      const response = await fetch(`${BASE_URL}/homechef/orders/${orderId}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await fetch(`${BASE_URL}/homechef/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ order_status: status }),
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },

  // Earnings
  getEarnings: async () => {
    try {
      const response = await fetch(`${BASE_URL}/homechef/earnings`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },

  // Profile
  getProfile: async () => {
    try {
      const response = await fetch(`${BASE_URL}/homechef/profile`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },

  // Update profile
  updateProfile: async (businessName, phoneNumber) => {
    try {
      const response = await fetch(`${BASE_URL}/homechef/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          business_name: businessName,
          phone_number: phoneNumber,
        }),
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },
};
