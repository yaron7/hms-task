import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { User } from '../../types/User';
import { useNavigate } from 'react-router-dom';
import UserItem from './UserItem';

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/users');
        setUsers(data);
      } catch (err: any) {
        navigate('/login');

        // if (err.response) {
        //   if (err.response.status === 401) {
        //     localStorage.setItem('isLoggedIn', 'false');
        //     navigate('/login');
        //   } else {
        //     setError('Failed to fetch users. Please try again later.');
        //     console.error('Error fetching users:', err.response.data);
        //   }
        // } else if (err.request) {
        //   setError('Network error. Please check your connection.');
        //   console.error('No response received:', err.request);
        // } else {
        //   setError('Failed to fetch users.');
        //   console.error('Error setting up request:', err.message);
        // }
      }

      setLoading(false);
    };

    fetchUsers();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Conditional rendering for empty users array
  if (!users || users.length === 0) {
    return (
      <div className="container mx-auto p-8">
        <p>No users found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">User List</h2>
          <ul>
            {users.map((user: User) => (
              <UserItem key={user.id} user={user} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UsersList;