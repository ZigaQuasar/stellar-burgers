import { fetchUser, hydrateAuth, IUserState, logout, updateUser, userSlice } from "@slices";
import { TUser } from "@utils-types";
import * as cookieUtils from '../../../utils/cookie';

describe('Тестирование слайса userSlice', () => {
  const initialState: IUserState = {
    user: null,
    isAuth: false,
    isLoading: false,
    error: null
  };

  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Тестовый пользователь'
  };

  it('Поведение слайса при fetchUser.pending', () => {
    const action = fetchUser.pending('mock-request-id', undefined);
    const state = userSlice.reducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuth).toBe(false);
  });

  it('Поведение слайса при fetchUser.fulfilled', () => {
    const action = fetchUser.fulfilled(mockUser,'mock-request-id', undefined);
    const state = userSlice.reducer(initialState, action);
    
    expect(state.user).toEqual(mockUser);
    expect(state.isAuth).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('Поведение слайса при fetchUser.rejected', () => {
    const error = new Error('Ошибка авторизации');
    const action = fetchUser.rejected(error, 'mock-request-id', undefined);
    const state = userSlice.reducer(initialState, action);
    
    expect(state.error).toBe('Ошибка авторизации');
    expect(state.isLoading).toBe(false);
    expect(state.isAuth).toBe(false);
    expect(state.user).toBeNull();
  });

  it('Поведение слайса при updateUser.pending', () => {
    const action = updateUser.pending('mock-request-id', {name:'Обновленное имя'});
    const state = userSlice.reducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Поведение слайса при updateUser.fulfilled', () => {
    const updatedUser = { ...mockUser, name: 'Обновленное имя'};
    const action = updateUser.fulfilled(updatedUser, 'mock-request-id', {name:'Обновленное имя'});
    const state = userSlice.reducer(initialState, action);
    
    expect(state.user).toEqual(updatedUser);
    expect(state.isLoading).toBe(false);
  });

  it('Поведение слайса при updateUser.rejected', () => {
    const error = new Error('Ошибка обновления');
    const authAction = fetchUser.fulfilled(mockUser,'mock-request-id', undefined);
    const authState = userSlice.reducer(initialState, authAction);

    const action = updateUser.rejected(error, 'mock-request-id', {name:'Обновленное имя'});
    const state = userSlice.reducer(authState, action);
    
    expect(state.error).toBe('Ошибка обновления');
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser); 
    expect(state.isAuth).toBe(true);
  });

  it('Поведение слайса при logout.fulfilled', () => {
    const authAction = fetchUser.fulfilled(mockUser,'mock-request-id', undefined);
    const authState = userSlice.reducer(initialState, authAction);

    const action = logout.fulfilled(undefined,'mock-request-id', undefined);
    const state = userSlice.reducer(authState, action);
    
    expect(state.user).toBeNull();
    expect(state.isAuth).toBe(false);
    expect(state.error).toBeNull();
  });

  it('Поведение слайса при logout.rejected', () => {
    const error = new Error('Ошибка выхода');
    const authAction = fetchUser.fulfilled(mockUser,'mock-request-id', undefined);
    const authState = userSlice.reducer(initialState, authAction);

    const action = logout.rejected(error, 'mock-request-id', undefined);
    const state = userSlice.reducer(authState, action);
    
    expect(state.error).toBe('Ошибка выхода');
    expect(state.isAuth).toBe(true); 
    expect(state.user).toEqual(mockUser);
  });

  it('Слайс должен устанавливать isAuth при вызове hydrateAuth', () => {
    jest.spyOn(cookieUtils, 'getCookie').mockReturnValue('test-token');
    
    const state = userSlice.reducer(initialState, hydrateAuth());
    expect(state.isAuth).toBe(true);
  });
});