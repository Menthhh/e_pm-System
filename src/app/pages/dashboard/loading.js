import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <div
          className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"
          style={{ borderTopColor: '#3490dc' }}
        ></div>
        <p className="mt-4 text-lg text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
