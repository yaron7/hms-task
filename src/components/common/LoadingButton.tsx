import React from 'react';

interface LoadingButtonProps {
  onClick: () => void;
  loading: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  onClick,
  loading,
  children,
  disabled,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`w-full flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
        loading || disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className || ''}`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;