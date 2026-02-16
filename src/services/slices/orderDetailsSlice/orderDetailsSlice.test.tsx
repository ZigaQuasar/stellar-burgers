import { TOrder } from "@utils-types";
import { clearOrderDetails, fetchOrderByNumber, IOrderDetailState, orderDetailsSlice } from "./orderDetailsSlice";

describe('Тестирование слайса orderDetailsSlice', () => {
  const initialState: IOrderDetailState = {
    orderData: null,
    isLoading: false,
    error: null
  };

  const mockOrder: TOrder = {
      _id: '1',
      status: 'done',
      name: 'Бургер',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      number: 12345,
      ingredients: ['ingr-1']
    };

  it('Поведение слайса при fetchOrderByNumber.pending', () => {
    const action = fetchOrderByNumber.pending('mock-request-id', 12345);
    const state = orderDetailsSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Поведение слайса при fetchOrderByNumber.fulfilled', () => {
    const action = fetchOrderByNumber.fulfilled(mockOrder, 'mock-request-id', 12345);
    const state = orderDetailsSlice.reducer(initialState, action);
    
    expect(state.orderData).toEqual(mockOrder);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

   it('Поведение слайса при fetchOrderByNumber.rejected', () => {
    const error = new Error('Ошибка загрузки');
    const action = fetchOrderByNumber.rejected(error, 'mock-request-id', 12345);
    const state = orderDetailsSlice.reducer(initialState, action);
    
    expect(state.error).toBe('Ошибка загрузки');
    expect(state.isLoading).toBe(false);
  });

  it('Слайс очищает данные заказа при вызове clearOrderDetails', () => {
    const action = fetchOrderByNumber.fulfilled(mockOrder, 'mock-request-id', 12345);
    const state = orderDetailsSlice.reducer(initialState, action);

    expect(state.orderData).toEqual(mockOrder);

    const clearedState = orderDetailsSlice.reducer(state, clearOrderDetails());

    expect(clearedState.orderData).toBeNull();
    expect(clearedState.error).toBeNull();
    expect(clearedState.isLoading).toBe(false);
  });
});