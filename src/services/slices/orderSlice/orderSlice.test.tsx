import { TOrder } from "@utils-types";
import { orderSlice, createOrder, closeOrderModal, IOrderState } from "./orderSlice";

describe('Тестирование слайса orderSlice', () => {
  const initialState: IOrderState  = {
    orderRequest: false,
    orderModalData: null,
    error: null
  };

  const mockIngredients = ['bun-1', 'main-2'];

  const mockOrder: TOrder = {
    _id: 'order-1',
    status: 'done',
    name: 'Краторный бургер',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 12345,
    ingredients: mockIngredients
  };

  it('Поведение слайса при createOrder.pending', () => {
    const action = createOrder.pending('mock-request-id', mockIngredients);
    const state = orderSlice.reducer(initialState, action);

    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Поведение слайса при createOrder.fulfilled', () => {
    const action = createOrder.fulfilled(mockOrder,'mock-request-id', mockIngredients);
    const state = orderSlice.reducer(initialState, action);
    
    expect(state.orderModalData).toEqual(mockOrder);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBeNull();
  });

  it('Поведение слайса при createOrder.rejected', () => {
    const error = new Error('Ошибка загрузки');
    const action = createOrder.rejected(error, 'mock-request-id', mockIngredients);
    const state = orderSlice.reducer(initialState, action);
    
    expect(state.error).toBe('Ошибка загрузки');
    expect(state.orderRequest).toBe(false);
  });

  it('должен очищать модальное окно заказа при вызове closeOrderModal', () => {
    const action = createOrder.fulfilled(mockOrder,'mock-request-id', mockIngredients);
    const state = orderSlice.reducer(initialState, action);

    expect(state.orderModalData).toEqual(mockOrder);

    const finalState = orderSlice.reducer(state, closeOrderModal());
    expect(finalState.orderModalData).toBeNull();
  });
});