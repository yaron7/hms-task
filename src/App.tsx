import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import Login from './components/auth/Login';
import UsersList from './components/users/UsersList';
import Registration from './components/auth/Registration';
import { AuthProvider, useAuth } from './components/auth/AuthContext';
import api from './services/api';
import Logout from './components/auth/Logout';

const AppContent = () => {
  const { isLoggedIn, userName, logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {isLoggedIn && (
        <header className="bg-white shadow-md p-4">
          <div className="container mx-auto flex items-center justify-between">
            <NavLink
              to="/users"
              className={({ isActive }) => `hover:text-blue-500 ${isActive ? 'text-blue-500 font-bold' : ''}`}
            >
            </NavLink>
            <span>Hello {userName}! 👋🏼😊</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
            {/* <Logout /> */}
          </div>
        </header>
      )
      }

      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/users" /> : <Login />} />
        <Route path="/users" element={isLoggedIn ? <UsersList /> : <Navigate to="/login" />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/users" /> : <Registration />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div >
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
