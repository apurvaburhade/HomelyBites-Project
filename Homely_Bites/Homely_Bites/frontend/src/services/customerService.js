const BASE_URL = 'http://localhost:4000';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Set headers with authorization
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

export const customerService = {
  // Get all active home chefs
  getAllChefs: async () => {
    try {
      const response = await fetch(`${BASE_URL}/homechef/all`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },

  // Get home chef profile
  getChefProfile: async (chefId) => {
    try {
      const response = await fetch(`${BASE_URL}/homechef/${chefId}/profile`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },

  // Get home chef menu items
  getChefMenu: async (chefId) => {
    try {
      const response = await fetch(`${BASE_URL}/homechef/${chefId}/menu`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },

  // Search home chefs by business name
  searchChefs: async (businessName) => {
    try {
      const response = await fetch(`${BASE_URL}/homechef/search/${businessName}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  },
};
