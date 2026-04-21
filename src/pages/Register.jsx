// import React, { useState } from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// const Register = () => {
//   const [isSuccess, setIsSuccess] = useState(false);

//   const formik = useFormik({
//     initialValues: {
//       name: '',
//       email: '',
//       password: '',
//       role: 'user', // ברירת מחדל משתמש רגיל
//     },
//     // ולידציה לפי דרישות הפרויקט [cite: 15]
//     validationSchema: Yup.object({
//       name: Yup.string().required('שדה חובה'),
//       email: Yup.string().email('אימייל לא תקין').required('שדה חובה'),
//       password: Yup.string()
//         .min(6, 'לפחות 6 תווים')
//         .matches(/[a-z]/, 'חובה אות קטנה אחת לפחות')
//         .matches(/[A-Z]/, 'חובה אות גדולה אחת לפחות')
//         .matches(/[0-9]/, 'חובה ספרה אחת לפחות')
//         .required('שדה חובה'),
//     }),
//     onSubmit: async (values) => {
//       try {
//         // שליחה לשרת ה-JSON שהקמנו [cite: 6, 7]
//         await axios.post('http://localhost:5000/users', values);
//         setIsSuccess(true); // הצגת הודעת הצלחה 
//       } catch (error) {
//         console.error("שגיאה ברישום:", error);
//       }
//     },
//   });

//   if (isSuccess) {
//     return (
//       <div style={{ textAlign: 'center', marginTop: '50px' }}>
//         <h2>ההרשמה הצליחה! 🎉</h2>
//         <p>עכשיו את יכולה להיכנס למערכת.</p>
//         <Link to="/login">לחצי כאן למעבר לדף התחברות</Link> {/* לינק ללוגין  */}
//       </div>
//     );
//   }
// console.log("Errors:", formik.errors);
// console.log("Values:", formik.values);
//   return (
//     <div className="register-container">
//       <h1>הרשמה לאתר</h1>
//       <form onSubmit={formik.handleSubmit}>
//         <div>
//           <label>שם מלא:</label>
//           <input type="text" name="name" {...formik.getFieldProps('name')} />
//           {formik.touched.name && formik.errors.name ? <div>{formik.errors.name}</div> : null}
//         </div>

//         <div>
//           <label>אימייל:</label>
//           <input type="email" name="email" {...formik.getFieldProps('email')} />
//           {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
//         </div>

//         <div>
//           <label>סיסמה:</label>
//           <input type="password" name="password" {...formik.getFieldProps('password')} />
//           {formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}
//         </div>

//         <button type="submit">הירשם</button>
//       </form>
//     </div>
//   );
// };

// export default Register;
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ייבוא הניווט

const Register = () => {
  const navigate = useNavigate(); // הגדרת הניווט

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: 'user' // ברירת מחדל למשתמש רגיל
    },
    validationSchema: Yup.object({
      name: Yup.string().required('שם חובה'),
      email: Yup.string().email('אימייל לא תקין').required('שדה חובה'),
      password: Yup.string()
        .min(6, 'לפחות 6 תווים')
        .matches(/[A-Z]/, 'חובה אות גדולה אחת')
        .matches(/[a-z]/, 'חובה אות קטנה אחת')
        .matches(/[0-9]/, 'חובה מספר אחד')
        .required('שדה חובה'),
    }),
    onSubmit: async (values) => {
      try {
        // 1. שמירת המשתמש החדש ב-db.json
        await axios.post('http://localhost:5000/users', values);
        
        // 2. הודעה למשתמש
        alert('נרשמת בהצלחה! כעת תועברי לדף ההתחברות.');
        
        // 3. מעבר אוטומטי לדף ההתחברות
        navigate('/login'); 
      } catch (error) {
        console.error("שגיאה בהרשמה:", error);
        alert('משהו השתבש בהרשמה, נסי שוב.');
      }
    },
  });

  return (
    <div className="register-container">
      <h1>הרשמה לאתר הטיפוח</h1>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <input type="text" placeholder="שם מלא" {...formik.getFieldProps('name')} />
          {formik.touched.name && formik.errors.name && <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '5px' }}>{formik.errors.name}</div>}
        </div>
        
        <div>
          <input type="email" placeholder="אימייל" {...formik.getFieldProps('email')} />
          {formik.touched.email && formik.errors.email && <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '5px' }}>{formik.errors.email}</div>}
        </div>
        
        <div>
          <input type="password" placeholder="סיסמה" {...formik.getFieldProps('password')} />
          {formik.touched.password && formik.errors.password && <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '5px' }}>{formik.errors.password}</div>}
        </div>
        
        <button type="submit">הירשמי עכשיו</button>
      </form>
    </div>
  );
};

export default Register;