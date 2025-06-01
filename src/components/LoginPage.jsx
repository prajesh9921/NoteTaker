import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogIn, FileText } from 'lucide-react';

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <FileText size={60} className="text-blue-600 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to NoteTaker
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Your personal space for capturing thoughts, ideas, and important notes.
          Sign in to get started.
        </p>
        <button
          onClick={() => loginWithRedirect()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <LogIn size={20} />
          Sign In with Auth0
        </button>
      </div>
    </div>
  );
};

export default LoginPage; 