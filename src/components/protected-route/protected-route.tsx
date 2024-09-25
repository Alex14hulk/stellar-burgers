import { Navigate, useLocation } from 'react-router-dom';
import React from 'react';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  publicRoute?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  publicRoute,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);

  if (publicRoute && isUserLoggedIn) {
    const redirectTo = location.state?.from || { pathname: '/' };
    return <Navigate replace to={redirectTo} />;
  }

  if (!isUserLoggedIn) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};
