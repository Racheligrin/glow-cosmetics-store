import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const { currentUser, isLoggedIn } = useSelector((state) => state.user);

  useEffect(() => {
    // משיכת פרטי המוצר
    axios.get(`http://localhost:5000/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));

    // משיכת חוות הדעת של המוצר הספציפי
    axios.get(`http://localhost:5000/reviews?productId=${id}`)
      .then(res => setReviews(res.data));
  }, [id]);

  const handleAddReview = async () => {
    if (!newReview.trim()) return;
    
    const reviewData = {
      productId: id,
      userName: currentUser.name,
      userId: currentUser.id,
      text: newReview,
      date: new Date().toLocaleDateString()
    };

    try {
      const res = await axios.post('http://localhost:5000/reviews', reviewData);
      setReviews([...reviews, res.data]);
      setNewReview('');
    } catch (err) {
      console.error("שגיאה בהוספת ביקורת", err);
    }
  };

  // פונקציית מחיקה - חדש!
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("האם את בטוחה שברצונך למחוק את חוות הדעת הזו?")) {
      try {
        await axios.delete(`http://localhost:5000/reviews/${reviewId}`);
        // עדכון ה-State כדי שהתגובה תיעלם מהמסך מיד
        setReviews(reviews.filter(rev => rev.id !== reviewId));
      } catch (err) {
        console.error("שגיאה במחיקת הביקורת", err);
      }
    }
  };

  if (!product) return <div>טוען נתונים...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '30px' }}>
        <img src={product.image} alt={product.name} style={{ width: '300px', borderRadius: '15px' }} />
        <div>
          <h1>{product.name}</h1>
          <p style={{ fontSize: '20px', color: '#555' }}>קטגוריה: {product.category}</p>
          <h2 style={{ color: '#e91e63' }}>מחיר: ₪{product.price}</h2>
          <p>מספר רכישות: {product.salesCount}</p>
        </div>
      </div>

      <hr style={{ margin: '40px 0' }} />

      <h3>חוות דעת של לקוחות</h3>
      {reviews.length === 0 ? <p>עוד אין חוות דעת למוצר זה. תהיי הראשונה!</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {reviews.map(rev => (
            <li key={rev.id} style={{ background: '#f9f9f9', padding: '15px', marginBottom: '10px', borderRadius: '8px', position: 'relative' }}>
              <strong>{rev.userName}</strong> ({rev.date}):
              <p>{rev.text}</p>
              
              {/* כפתור מחיקה - מופיע רק לכותב התגובה או למנהל (דרישת פרויקט) */}
              {(isLoggedIn && (currentUser.id === rev.userId || currentUser.role === 'admin')) && (
                <button 
                  onClick={() => handleDeleteReview(rev.id)}
                  style={{ 
                    position: 'absolute', top: '10px', left: '10px', 
                    color: 'red', border: 'none', background: 'none', 
                    cursor: 'pointer', fontSize: '12px' 
                  }}
                >
                  מחיקה 🗑️
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {isLoggedIn ? (
        <div style={{ marginTop: '20px' }}>
          <h4>הוסיפי חוות דעת:</h4>
          <textarea 
            value={newReview} 
            onChange={(e) => setNewReview(e.target.value)}
            style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            placeholder="מה דעתך על המוצר?"
          />
          <button onClick={handleAddReview} style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#e91e63', color: 'white', border: 'none', borderRadius: '5px' }}>
            שלחי חוות דעת
          </button>
        </div>
      ) : (
        <p style={{ color: 'blue', backgroundColor: '#e3f2fd', padding: '10px', borderRadius: '5px' }}>יש להתחבר כדי להוסיף חוות דעת.</p>
      )}
    </div>
  );
};

export default ProductDetails;