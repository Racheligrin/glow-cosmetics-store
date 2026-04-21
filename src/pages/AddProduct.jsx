import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  // הגבלת גישה - אם המשתמש לא מנהל, הוא מועבר לדף הבית
  if (!currentUser || currentUser.role !== 'admin') {
    return <div style={{ padding: '20px' }}>אין לך הרשאה לגשת לדף זה.</div>;
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      category: 'Face', // ברירת מחדל לאתר טיפוח
      image: '',
      salesCount: 0
    },
    validationSchema: Yup.object({
      name: Yup.string().required('שם המוצר חובה'),
      price: Yup.number().positive('מחיר חייב להיות חיובי').required('חובה להזין מחיר'),
      category: Yup.string().required('חובה לבחור קטגוריה'),
      image: Yup.string().url('חובה להזין קישור תקין לתמונה').required('חובה להוסיף תמונה'),
    }),
    onSubmit: async (values) => {
      try {
        // 1. שמירה בשרת (JSON Server)
        const response = await axios.post('http://localhost:5000/products', values);
        
        // 2. שמירה ב-LocalStorage (דרישה מההנחיות)
        const existingProducts = JSON.parse(localStorage.getItem('added_products') || '[]');
        localStorage.setItem('added_products', JSON.stringify([...existingProducts, response.data]));

        setSuccess(true);
        setTimeout(() => navigate('/'), 2000); // חזרה לדף הבית אחרי 2 שניות
      } catch (error) {
        console.error("שגיאה בהוספת מוצר:", error);
      }
    },
  });

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>הוספת מוצר טיפוח חדש</h1>
      
      {success && <div style={{ color: 'green', fontWeight: 'bold' }}>המוצר נוסף בהצלחה! מעביר לדף הבית...</div>}

      <form onSubmit={formik.handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>שם המוצר:</label>
          <input type="text" {...formik.getFieldProps('name')} style={{ width: '100%', padding: '8px' }} />
          {formik.touched.name && formik.errors.name && <div style={{ color: 'red' }}>{formik.errors.name}</div>}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>מחיר:</label>
          <input type="number" {...formik.getFieldProps('price')} style={{ width: '100%', padding: '8px' }} />
          {formik.touched.price && formik.errors.price && <div style={{ color: 'red' }}>{formik.errors.price}</div>}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>קטגוריה:</label>
          <select {...formik.getFieldProps('category')} style={{ width: '100%', padding: '8px' }}>
            <option value="Face">פנים</option>
            <option value="Body">גוף</option>
            <option value="Serums">סרומים</option>
            <option value="Sunscreen">הגנה מהשמש</option>
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>קישור לתמונה:</label>
          <input type="text" {...formik.getFieldProps('image')} style={{ width: '100%', padding: '8px' }} placeholder="http://..." />
          {formik.touched.image && formik.errors.image && <div style={{ color: 'red' }}>{formik.errors.image}</div>}
        </div>

        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#e91e63', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          הוסף מוצר
        </button>
      </form>
    </div>
  );
};

export default AddProduct;