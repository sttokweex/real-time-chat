// src/app/App.tsx
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { AuthPage } from '@/pages/auth-page';
import { ChatPage } from '@/pages/chat-page';
import useAuth from '@/shared/hooks/useAuth';

const App: React.FC = () => {
  const { userData, isAuthLoading, refetch } = useAuth();
  console.log(userData);

  return (
    <Router>
      <div>
        <h1>Real-Time Chat Application</h1>
        {isAuthLoading ? (
          <p>Loading...</p>
        ) : (
          <Routes>
            <Route
              path="/"
              element={userData ? <Navigate to="/chat" /> : <AuthPage />}
            />
            <Route
              path="/chat"
              element={
                userData ? (
                  <ChatPage userData={userData} refetch={refetch} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
