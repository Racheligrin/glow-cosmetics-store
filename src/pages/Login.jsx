import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // הוספנו Link
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/userSlice';

const Login = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('אימייל לא תקין').required('שדה חובה'),
      password: Yup.string().required('שדה חובה'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/users?email=${values.email}&password=${values.password}`
        );

        if (response.data.length > 0) {
          const user = response.data[0];
          dispatch(loginUser(user));
          
          // תיקון הניווט: עוברים לדף הבית האמיתי אחרי הצלחה
          navigate('/home'); 
        } else {
          setErrorMsg('אימייל או סיסמה לא נכונים');
        }
      } catch (error) {
        setErrorMsg('שגיאה בתקשורת עם השרת');
      }
    },
  });

  return (
    <div className="login-container">
      <h1>כניסה למערכת</h1>
      {errorMsg && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMsg}</div>}
      
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>אימייל:</label>
          <input type="email" {...formik.getFieldProps('email')} />
          {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
        </div>

        <div>
          <label>סיסמה:</label>
          <input type="password" {...formik.getFieldProps('password')} />
          {formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}
        </div>

        <button type="submit">התחבר</button>
      </form>

      {/* אופציית הרשמה למשתמשים חדשים */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>עדיין אין לך חשבון?</p>
        <Link to="/register" style={{ color: '#e91e63', fontWeight: 'bold' }}>
          לחצי כאן להרשמה מהירה
        </Link>
      </div>
    </div>
  );
};

export default Login;