import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Messages from './pages/Messages'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Verification from './pages/auth/Verification'
import Layout from './layout'
import ProfilePage from './pages/ProfilePage'
import { setAuthToken, getMe } from './utils/api'
import { connectSocket } from './utils/socket'
import { updateUser } from './redux/slices/auth'

export default function App() {
  const dispatch = useDispatch();
  const { token, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    const colorMode = JSON.parse(window.localStorage.getItem('color-theme'));
    const bodyClass = window.document.body.classList;
    colorMode === 'dark' ? bodyClass.add('dark') : bodyClass.remove('dark');
  }, []);

  // On refresh: restore token, socket, and fetch fresh user info
  useEffect(() => {
    if (isLoggedIn && token) {
      setAuthToken(token);
      connectSocket(token);
      // Fetch fresh user data
      getMe()
        .then((data) => {
          dispatch(updateUser(data.data.user));
        })
        .catch((err) => {
          console.error('Failed to fetch user info:', err);
        });
    }
  }, [isLoggedIn, token]);

  return (
    <Routes>
      <Route path='/' element={<Navigate to='/auth/login' />} />
      <Route path='/auth/login' element={<Login />} />
      <Route path='/auth/signup' element={<Signup />} />
      <Route path='/auth/verify' element={<Verification />} />

      <Route path='/dashboard' element={isLoggedIn ? <Layout /> : <Navigate to='/auth/login' />}>
        <Route index element={<Messages />} />
        <Route path='profile' element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
