import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

const schema = yup.object({
  firstname: yup.string().min(3, 'First name must be at least 3 characters').required('First name is required'),
  lastname: yup.string().min(3, 'Last name must be at least 3 characters').required('Last name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).required();

const Registration: React.FC = () => {
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Use the useForm hook with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setSuccess(null);

    try {
      await api.post('/register', data);
      setSuccess('Registration successful!');
      navigate('/login');
    } catch (err: any) {
      // Handle API errors (e.g., display an error message)
      console.error('Registration failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>
          {success && <div className="text-green-500 text-sm mb-4">{success}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* First Name input */}
            <div>
              <label htmlFor="firstname" className="block text-gray-700 font-medium mb-2">
                First Name
              </label>
              <input
                {...register('firstname')}
                type="text"
                name="firstname"
                id="firstname"
                placeholder="First Name"
                className={`w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstname ? 'border-red-500' : ''}`}
              />
              {errors.firstname && <div className="text-red-500 text-sm mt-1">{errors.firstname.message}</div>}
            </div>
            {/* Last Name input */}
            <div>
              <label htmlFor="lastname" className="block text-gray-700 font-medium mb-2">
                Last Name
              </label>
              <input
                {...register('lastname')}
                type="text"
                name="lastname"
                id="lastname"
                placeholder="Last Name"
                className={`w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastname ? 'border-red-500' : ''}`}
              />
              {errors.lastname && <div className="text-red-500 text-sm mt-1">{errors.lastname.message}</div>}
            </div>
            {/* Email input */}
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className={`w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email.message}</div>}
            </div>
            {/* Password input */}
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                className={`w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password.message}</div>}
            </div>
            <button
              type="submit"
              className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <button
            onClick={() => navigate('/login')}
            className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registration;