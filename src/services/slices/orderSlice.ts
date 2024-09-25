import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrderByNumberApi, getOrdersApi } from '../../utils/burger-api';

type TOrderState = {
  orderList: TOrder[];
  currentOrder: TOrder | null;
  isLoading: boolean;
  lastResponse: null;
  error: string | null;
};

export const initialState: TOrderState = {
  orderList: [],
  currentOrder: null,
  isLoading: true,
  lastResponse: null,
  error: null
};

export const fetchNumberOneOrder = createAsyncThunk(
  'order/fetchNumberOneOrder',
  async function (number: number) {
    const response = await getOrderByNumberApi(number);
    return response;
  }
);

export const getOrders = createAsyncThunk('order/getOrders', async function () {
  const response = await getOrdersApi();
  return response;
});

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  selectors: {
    getOrderState: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNumberOneOrder.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(fetchNumberOneOrder.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.currentOrder = action.payload.orders[0];
      })
      .addCase(fetchNumberOneOrder.rejected, (state, action) => {
        state.error = action.error as string;
        state.isLoading = false;
      })
      .addCase(getOrders.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.orderList = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.error = action.error as string;
        state.isLoading = false;
      });
  }
});

export const { getOrderState } = orderSlice.selectors;
export default orderSlice.reducer;
