import { Navigate, useLocation } from 'react-router-dom';
import React from 'react';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  publicRoute?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  publicRoute,
  children
}: ProtectedRouteProps) => {
  const { isAuthChecked, userInfo } = useSelector(
    (state: RootState) => state.user
  );
  const location = useLocation();
  const dispatch = useDispatch();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (publicRoute && userInfo) {
    return <Navigate replace to='/profile' />;
  }

  if (!userInfo) {
    if (!onlyUnAuth && !publicRoute) {
      return <Navigate replace to='/login' />;
    }
  }

  if (userInfo && onlyUnAuth) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
