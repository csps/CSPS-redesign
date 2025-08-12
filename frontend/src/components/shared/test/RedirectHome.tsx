import DashboardPage from '@/pages/Dashboard/DashboardPage';
import HomePage from '@/pages/Home/HomePage';
import { useAuthStore } from '@/store/authStore'
import React from 'react'
import { Navigate } from 'react-router-dom';

const RedirectHome = () => {

  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  if(isAuthenticated){
    return <DashboardPage />
  }

  return <HomePage />
}

export default RedirectHome