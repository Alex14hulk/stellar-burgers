import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { getCookie, setCookie, deleteCookie } from '../../utils/cookie';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TRegisterData
} from '../../utils/burger-api';

interface TUserState {
  isAuthChecked: boolean;
  isAuth: boolean;
  userInfo: TUser | null;
  authUserError: string | null;
  authUserRequest: boolean;
  registerUserError: string | null;
  registerUserRequest: boolean;
}

const initialState: TUserState = {
  isAuthChecked: false,
  isAuth: false,
  userInfo: null,
  authUserError: null,
  authUserRequest: false,
  registerUserError: null,
  registerUserRequest: false
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: Omit<TRegisterData, 'name'>) =>
    await loginUserApi({ email, password })
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (regData: TRegisterData) => await registerUserApi(regData)
);

export const getUser = createAsyncThunk(
  'user/getUser',
  async () => await getUserApi()
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authCheck: (state) => {
      state.isAuthChecked = true;
    },
    setUserStor: (state, action) => {
      state.userInfo = action.payload;
    },
    userLogout: (state) => {
      state.userInfo = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.authUserRequest = true;
        state.authUserError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authUserRequest = false;
        state.authUserError =
          typeof action.payload === 'string'
            ? action.payload
            : typeof action.error.message === 'string'
              ? action.error.message
              : 'Произошла неизвестная ошибка';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userInfo = action.payload.user;
        state.authUserRequest = false;
        state.isAuth = true;
        state.isAuthChecked = true;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
      })
      .addCase(registerUser.pending, (state) => {
        state.registerUserRequest = true;
        state.registerUserError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerUserRequest = false;
        state.registerUserError =
          typeof action.payload === 'string'
            ? action.payload
            : typeof action.error.message === 'string'
              ? action.error.message
              : 'Произошла неизвестная ошибка';
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userInfo = action.payload.user;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
        state.registerUserRequest = false;
        state.isAuth = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.userInfo = action.payload.user;
        state.isAuthChecked = true;
      });
  }
});

const { authCheck, userLogout } = userSlice.actions;

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  async (_, { dispatch }) => {
    try {
      if (getCookie('accessToken')) {
        await dispatch(getUser());
      }
    } finally {
      dispatch(authCheck());
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { dispatch }) => {
    logoutApi()
      .then(() => {
        localStorage.clear();
        deleteCookie('accessToken');
        dispatch(userLogout());
      })
      .catch(() => {
        console.log('Ошибка выполнения выхода');
      });
  }
);

export default userSlice.reducer;
