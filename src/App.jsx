import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import AddProduct from './pages/AddProduct';

function App() {
  const { isLoggedIn } = useSelector((state) => state.user);

  return (
    <Router>
      {isLoggedIn && <Navbar />}

      <div className="container">
        <Routes>
          {/* דפים ציבוריים - רק למי שלא מחובר */}
          <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/home" />} />
          <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/home" />} />
          
          {/* דפים מוגנים - רק למי שמחובר */}
          <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path="/product/:id" element={isLoggedIn ? <ProductDetails /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/add-product" element={isLoggedIn ? <AddProduct /> : <Navigate to="/login" />} />
          
          {/* ברירת מחדל - מפנה ללוגין או לבית */}
          <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;