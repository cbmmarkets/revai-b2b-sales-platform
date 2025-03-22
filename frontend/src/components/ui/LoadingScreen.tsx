import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
        <h2 className="text-xl font-medium text-gray-700">{message}</h2>
        <p className="mt-2 text-sm text-gray-500">This may take a few moments.</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
