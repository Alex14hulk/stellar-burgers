import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser, TOrder } from '@utils-types';
import { setCookie, deleteCookie } from '../../utils/cookie';
import {
  TRegisterData,
  registerUserApi,
  TLoginData,
  loginUserApi,
  getUserApi,
  getOrdersApi,
  updateUserApi,
  logoutApi
} from '../../utils/burger-api';

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async function (data: TRegisterData) {
    const response = await registerUserApi(data);
    return response;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async function (data: TLoginData) {
    const response = await loginUserApi(data);
    return response;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async function () {
    const response = await logoutApi();
    return response;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async function (data: TRegisterData) {
    const response = await updateUserApi(data);
    return response;
  }
);

export const getAllUserOrdersThunk = createAsyncThunk(
  'constructor/getAllUserOrdersThunk',
  async function () {
    const response = await getOrdersApi();
    return response;
  }
);

export const checkIsUserLogged = createAsyncThunk(
  'constructor/checkIsUserLogged',
  async function () {
    const response = await getUserApi();
    return response;
  }
);

export type TUserState = {
  userInfo: TUser;
  isLoggedIn: boolean;
  error: string | null;
  isLoading: boolean;
  orderData: TOrder | null;
  allUserOrders: TOrder[];
};

export const initialState: TUserState = {
  userInfo: { email: '', name: '' },
  isLoggedIn: false,
  error: null,
  isLoading: true,
  orderData: null,
  allUserOrders: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload.user;
        setCookie('accessToken', action.payload.accessToken);
        state.isLoggedIn = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error as string;
        state.isLoading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload.user;
        setCookie('accessToken', action.payload.accessToken);
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.isLoading = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = { email: '', name: '' };
        deleteCookie('accessToken');
        state.isLoggedIn = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error as string;
        state.isLoading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload.user;
        state.isLoggedIn = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error as string;
        state.isLoading = false;
      })
      .addCase(getAllUserOrdersThunk.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getAllUserOrdersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allUserOrders = action.payload;
      })
      .addCase(getAllUserOrdersThunk.rejected, (state, action) => {
        state.error = action.error as string;
        state.isLoading = false;
      })
      .addCase(checkIsUserLogged.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(checkIsUserLogged.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload.user;
        state.isLoggedIn = true;
      })
      .addCase(checkIsUserLogged.rejected, (state, action) => {
        state.error = action.error as string;
        state.isLoading = false;
      });
  }
});

export default userSlice.reducer;
