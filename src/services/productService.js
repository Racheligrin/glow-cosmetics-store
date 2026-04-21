import axios from 'axios';

const API_URL = 'http://localhost:5000/products';

export const getProducts = async (filters) => {
  const { searchTerm, category, maxPrice } = filters;
  
  const params = new URLSearchParams();

  // כאן אנחנו שמים את הלוגיקה שפיצחנו יחד
  if (searchTerm) params.append('q', searchTerm.trim());
  if (category) params.append('category', category);
  if (maxPrice) params.append('price_lte', maxPrice);

  const response = await axios.get(`${API_URL}?${params.toString()}`);
  return response.data; // מחזיר רק את הנתונים
};