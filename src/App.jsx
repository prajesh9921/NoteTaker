import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginPage from './components/LoginPage';
import NotesApp from './components/NotesApp';

const App = () => {
  const { isLoading, error, isAuthenticated } = useAuth0();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops... something went wrong</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated ? <NotesApp /> : <LoginPage />}
    </div>
  );
};

export default App; 