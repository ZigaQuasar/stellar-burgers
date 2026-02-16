import { TIngredient } from "@utils-types";
import { fetchIngredients, IIngredientsState, ingredientsSlice } from "./ingredientsSlice";

describe('Тестирование слайса ingredientsSlice', () => {
  const initialState: IIngredientsState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  it('Поведение слайса при fetchIngredients.pending', () => {
    const action = fetchIngredients.pending('mock-request-id', undefined);
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Поведение слайса при fetchIngredients.fulfilled', () => {
    const mockBun: TIngredient = {
      _id: 'bun-1',
      name: 'Краторная булка',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 43,
      calories: 444,
      price: 1255,
      image: 'bun.png',
      image_large: 'bun-large.png',
      image_mobile: 'bun-mobile.png',
    };

    const payload = [mockBun];
    const action = fetchIngredients.fulfilled(payload, 'mock-request-id', undefined);
    const state = ingredientsSlice.reducer(initialState, action);
    
    expect(state.ingredients).toEqual([mockBun]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

   it('Поведение слайса при fetchIngredients.rejected', () => {
    const error = new Error('Ошибка загрузки');
    const action = fetchIngredients.rejected(error, 'mock-request-id', undefined);
    const state = ingredientsSlice.reducer(initialState, action);
    
    expect(state.error).toBe('Ошибка загрузки');
    expect(state.isLoading).toBe(false);
  });
});