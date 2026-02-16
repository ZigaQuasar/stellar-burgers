import { rootReducer } from './store'

describe('rootReducer', () => {
  it('Тестирование инициализации rootReducer', () => {
    const initialState = rootReducer(undefined, {type: 'UNKNOWN_ACTION'});

    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('order');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('orderDetails');
    expect(initialState).toHaveProperty('profileOrders');
  });
});

