import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/userSlice';

const Navbar = () => {
  const { currentUser, isLoggedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Link style={{ margin: '10px' }} to="/home">דף הבית</Link>
        <Link style={{ margin: '10px' }} to="/profile">פרופיל אישי</Link>
        
        {currentUser?.role === 'admin' && (
          <Link style={{ margin: '10px', color: 'blue', fontWeight: 'bold' }} to="/add-product">ניהול: הוספת מוצר</Link>
        )}
        
        <button onClick={handleLogout} style={{ marginRight: '10px', cursor: 'pointer' }}>התנתק</button>
      </div>

      <div>
        שלום, <strong>{currentUser.name}</strong> ({currentUser.role})
      </div>
    </nav>
  );
};

export default Navbar;