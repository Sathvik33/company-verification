import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/layout/Layout';
import UserRegistration from './pages/userRegistration';
import LoginPage from './pages/Loginpage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProfileSettingsPage from './pages/ProfileSettingsPage';

const HomePage = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <h1>Welcome to our Company!</h1>
    <p>This is the main landing page for your company registration and verification application.</p>
  </div>
);

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<UserRegistration />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile-settings" element={<ProfileSettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;