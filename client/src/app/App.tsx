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
  const { userData, refetch } = useAuth();

  return (
    <Router>
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
    </Router>
  );
};

export default App;
