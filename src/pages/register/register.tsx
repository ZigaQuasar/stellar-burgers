import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { registerUserApi } from '@api';
import { setCookie } from '../../utils/cookie';
import { fetchUser } from '../../services/slices/userSlice';
import { RegisterUI } from '@ui-pages';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await registerUserApi({
        name: userName,
        email,
        password
      });

      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      await dispatch(fetchUser());

      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Ошибка при регистрации');
    }
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
