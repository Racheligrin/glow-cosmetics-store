import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { loginUser } from '../redux/userSlice';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      password: currentUser?.password || '', // בהנחיות מבקשים אפשרות לערוך הכל
    },
    enableReinitialize: true, // מאפשר לטופס להתעדכן כשהנתונים מה-Redux מגיעים
    validationSchema: Yup.object({
      name: Yup.string().required('שדה חובה'),
      email: Yup.string().email('אימייל לא תקין').required('שדה חובה'),
      password: Yup.string().min(6, 'לפחות 6 תווים').required('שדה חובה'),
    }),
    onSubmit: async (values) => {
      try {
        // עדכון בשרת (JSON Server) לפי ה-ID של המשתמש
        const response = await axios.put(`http://localhost:5000/users/${currentUser.id}`, {
          ...currentUser,
          ...values
        });

        // עדכון הנתונים ב-Redux כדי שהשם ב-Navbar ישתנה מיד
        dispatch(loginUser(response.data));
        setMessage('הפרטים עודכנו בהצלחה! ✨');
      } catch (error) {
        console.error("שגיאה בעדכון הפרטים:", error);
        setMessage('חלה שגיאה בעדכון הפרטים.');
      }
    },
  });

  if (!currentUser) return <div>יש להתחבר כדי לצפות בפרופיל.</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>הפרופיל שלי</h1>
      <p>כאן תוכל לעדכן את הפרטים האישיים שלך.</p>

      {message && <div style={{ color: 'green', marginBottom: '15px' }}>{message}</div>}

      <form onSubmit={formik.handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>שם מלא:</label>
          <input type="text" {...formik.getFieldProps('name')} style={{ width: '100%', padding: '8px' }} />
          {formik.touched.name && formik.errors.name && <div style={{ color: 'red' }}>{formik.errors.name}</div>}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>אימייל:</label>
          <input type="email" {...formik.getFieldProps('email')} style={{ width: '100%', padding: '8px' }} />
          {formik.touched.email && formik.errors.email && <div style={{ color: 'red' }}>{formik.errors.email}</div>}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>סיסמה:</label>
          <input type="password" {...formik.getFieldProps('password')} style={{ width: '100%', padding: '8px' }} />
          {formik.touched.password && formik.errors.password && <div style={{ color: 'red' }}>{formik.errors.password}</div>}
        </div>

        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>
          עדכן פרטים
        </button>
      </form>
    </div>
  );
};

export default Profile;