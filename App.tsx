 
import React, { useState, useEffect } from 'react';
import { AppView, User } from './types';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView(AppView.DASHBOARD);
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('admin_user', JSON.stringify(userData));
    setCurrentView(AppView.DASHBOARD);
  };

  const handleRegister = (userData: User) => {
    setUser(userData);
    localStorage.setItem('admin_user', JSON.stringify(userData));
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
    setCurrentView(AppView.LOGIN);
  };

  return (
    <div className="min-h-screen">
      {currentView === AppView.LOGIN ? (
        <LoginPage 
          onLogin={handleLogin}
          onSwitchToRegister={() => setCurrentView(AppView.REGISTER)}
        />
      ) : currentView === AppView.REGISTER ? (
        <RegisterPage 
          onRegister={handleRegister}
          onSwitchToLogin={() => setCurrentView(AppView.LOGIN)}
        />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
