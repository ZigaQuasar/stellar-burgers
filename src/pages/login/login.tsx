import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { loginUserApi } from '@api';
import { setCookie } from '../../utils/cookie';
import { useDispatch } from '../../services/store';
import { fetchUser } from '@slices';
import { useLocation, useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await loginUserApi({ email, password });

      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      dispatch(fetchUser());

      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Неверный email или пароль');
      } else {
        setError('Произошла неизвестная ошибка');
      }
    }
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
