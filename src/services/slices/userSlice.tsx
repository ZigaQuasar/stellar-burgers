import { getUserApi, logoutApi, TRegisterData, updateUserApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { getCookie } from '../../utils/cookie';

interface IUserState {
  user: TUser | null;
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: IUserState = {
  user: null,
  isAuth: false,
  isLoading: false,
  error: null
};

export const fetchUser = createAsyncThunk('user/fetch', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  document.cookie = 'accessToken=; Max-Age=0; path=/';
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    hydrateAuth: (state) => {
      const accessToken = getCookie('accessToken');
      state.isAuth = !!accessToken;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить профиль';
        state.isAuth = false;
        state.user = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось обновить профиль';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuth = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка при выходе';
      });
  }
});

export const { clearUserError, hydrateAuth } = userSlice.actions;
export default userSlice.reducer;
