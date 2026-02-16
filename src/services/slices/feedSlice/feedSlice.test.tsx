import { IFeedState, TOrder } from "@utils-types";
import { feedSlice, fetchFeed } from "./feedSlice";

describe('Тестирование слайса feedSlice', () => {
  const initialState: IFeedState  = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null
    };

  it('Поведение слайса при fetchFeed.pending', () => {
    const action = fetchFeed.pending('mock-request-id', undefined);
    const state = feedSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Поведение слайса при fetchFeed.fulfilled', () => {
    const mockOrder: TOrder = {
      _id: '1',
      status: 'done',
      name: 'Бургер',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      number: 12345,
      ingredients: ['ingr-1']
    };

    const payload = { success: true, orders: [mockOrder], total: 100, totalToday: 50 };
    const action = fetchFeed.fulfilled(payload, 'mock-request-id', undefined);
    const state = feedSlice.reducer(initialState, action);
    
    expect(state.orders).toEqual([mockOrder]);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(50);
    expect(state.isLoading).toBe(false);
  });

   it('Поведение слайса при fetchFeed.rejected', () => {
    const error = new Error('Ошибка загрузки');
    const action = fetchFeed.rejected(error, 'mock-request-id', undefined);
    const state = feedSlice.reducer(initialState, action);
    
    expect(state.error).toBe('Ошибка загрузки');
    expect(state.isLoading).toBe(false);
  });
});