import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoadingButton from '../common/LoadingButton';

interface FormData {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
}).required();

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: 't@gmail.com',
      password: 'test1',
    }
  });
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      // await delay(1000);
      const { data } = await api.post('/login', formData);
      if (data.message === 'Login successful') {
        localStorage.setItem('firstName', data.firstName);
        login(data.firstName);
        navigate('/users');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email input */}
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                placeholder="Email"
                autoComplete="email"
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
                id="password"
                placeholder="Password"
                autoComplete="current-password"
                className={`w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password.message}</div>}
            </div>

            <LoadingButton
              onClick={handleSubmit(onSubmit)}
              loading={loading}
            >
              Login
            </LoadingButton>
          </form>
          {/* Register Button */}
          <div className="text-center mt-4">
            <span className="text-gray-600">Don't have an account? </span>
            <button
              onClick={() => navigate('/register')}
              className="text-blue-500 hover:underline font-medium"
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
