// ProtectedRoute.tsx
import { FC } from 'react';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';

interface IProtectedRoute {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
}

export const ProtectedRoute: FC<IProtectedRoute> = ({
  onlyUnAuth,
  children
}) => {
  const { isAuth, isLoading } = useSelector((state) => state.user);
  const location = useLocation();

  if (isLoading) {
    return <Preloader />;
  }

  if (onlyUnAuth && isAuth) {
    return <Navigate to='/' replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
