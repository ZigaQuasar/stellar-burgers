import { getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface IOrderDetailState {
  orderData: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IOrderDetailState = {
  orderData: null,
  isLoading: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetch',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

export const orderDetailsSlice = createSlice({
  name: 'orderDetail',
  initialState,
  reducers: {
    clearOrderDetails: (state) => {
      state.orderData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderData = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить заказ';
      });
  }
});

export const { clearOrderDetails } = orderDetailsSlice.actions;
export default orderDetailsSlice.reducer;
