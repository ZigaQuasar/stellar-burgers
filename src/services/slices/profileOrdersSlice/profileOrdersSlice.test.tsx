import { TOrder } from "@utils-types";
import { fetchProfileOrders, IProfileOrdersState, profileOrdersSlice } from "./profileOrdersSlice";

describe('Тестирование слайса profileOrdersSlice', () => {
  const initialState: IProfileOrdersState = {
    orders: [],
    isLoading: false,
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

  it('Поведение слайса при fetchProfileOrders.pending', () => {
    const action = fetchProfileOrders.pending('mock-request-id', undefined);
    const state = profileOrdersSlice.reducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Поведение слайса при fetchProfileOrders.fulfilled', () => {
    const action = fetchProfileOrders.fulfilled([mockOrder],'mock-request-id', undefined);
    const state = profileOrdersSlice.reducer(initialState, action);
    
    expect(state.orders).toEqual([mockOrder]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('Поведение слайса при fetchProfileOrders.rejected', () => {
    const error = new Error('Ошибка загрузки');
    const action = fetchProfileOrders.rejected(error, 'mock-request-id', undefined);
    const state = profileOrdersSlice.reducer(initialState, action);
    
    expect(state.error).toBe('Ошибка загрузки');
    expect(state.isLoading).toBe(false);
  });
});