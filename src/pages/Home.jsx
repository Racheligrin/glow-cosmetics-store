import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService'; 

const Home = () => {
  // כל ה-Hooks חייבים להיות כאן בפנים!
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts({ searchTerm, category, maxPrice });
        console.log("Results from service:", data.length);
        
        setProducts(data);
        setDisplayedProducts(data.slice(0, ITEMS_PER_PAGE));
        setPage(1);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, [searchTerm, category, maxPrice]);

  // ה-return עכשיו נמצא בתוך הפונקציה Home
  return (
    <div style={{ padding: '20px' }}>
      <h1>מוצרי הטיפוח שלנו</h1>
      
      <div style={{ maxWidth: '800px', margin: '0 auto 40px', display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <input 
          type="text" 
          placeholder="חפש לפי שם..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '12px 20px', flex: '1', minWidth: '200px', borderRadius: '25px', border: '2px solid #f0f0f0' }}
        />
        
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '12px 20px', borderRadius: '25px', border: '2px solid #f0f0f0', cursor: 'pointer', fontWeight: '400', height: '48px', boxSizing: 'border-box' }}
        >
          <option value="">כל הקטגוריות</option>
          <option value="Face">פנים</option>
          <option value="Serums">סרומים</option>
          <option value="Body">גוף</option>
          <option value="Sunscreen">הגנה</option>
        </select>

        <input 
          type="number" 
          placeholder="מחיר מקסימלי..." 
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ padding: '12px 20px', width: '150px', borderRadius: '25px', border: '2px solid #f0f0f0', height: '48px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {products.map(product => (
          <div 
            key={product.id} 
            style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', cursor: 'pointer' }}
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <h3>{product.name}</h3>
            <p>מחיר: ₪{product.price}</p>
            <button>לפרטים נוספים</button>
          </div>
        ))}
      </div>
    </div>
  );
}; // כאן נסגרת פונקציית Home

export default Home;