import store  from './store'

describe('rootReducer', () => {
  it('Тестирование инициализации rootReducer', () => {
    const state = store.getState();

    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('orderDetails');
    expect(state).toHaveProperty('profileOrders');
  });
});

