import { TConstructorIngredient } from "@utils-types";
import { addIngredient, clearConstructor, constructorSlice, moveIngredient, removeIngredient } from "./constructorSlice";


const mockBun: TConstructorIngredient = {
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
  id: 'unique-bun-id'
};

const mockFillingSauce: TConstructorIngredient = {
  _id: 'filling-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 2,
  fat: 14,
  carbohydrates: 18,
  calories: 20,
  price: 90,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png',
  id: 'unique-filling-1'
};

const mockFillingMain: TConstructorIngredient = {
  _id: 'filling-2',
  name: 'Мясо бессмертных моллюсков',
  type: 'main',
  proteins: 430,
  fat: 244,
  carbohydrates: 33,
  calories: 420,
  price: 1337,
  image: 'meat.png',
  image_large: 'meat-large.png',
  image_mobile: 'meat-mobile.png',
  id: 'unique-filling-2'
};

describe('Тестирование слайса constructorSlice', () => {
  const initialState = { bun: null, ingredients: [] };

  it('Слайс обрабатывает экшен добавления булки', () => {
    const state = constructorSlice.reducer(initialState, addIngredient(mockBun));
    expect(state.bun).toEqual(mockBun);
    expect(state.ingredients).toHaveLength(0);
  });

  it('Слайс обрабатывает экшен добавления начинки', () => {
    const state = constructorSlice.reducer(initialState, addIngredient(mockFillingSauce));
    expect(state.ingredients[0]).toEqual(mockFillingSauce);
    expect(state.bun).toBeNull();
  });

  it('Начинки накапливаются в массиве', () => {
    let state = constructorSlice.reducer(initialState, addIngredient(mockFillingSauce));
    state = constructorSlice.reducer(state, addIngredient(mockFillingMain));
    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients).toEqual([mockFillingSauce, mockFillingMain]);
  });

  it('Слайс обрабатывает экшен удаления ингредиента', () => {
    const stateWithFilling = { ...initialState, ingredients: [mockFillingSauce, mockFillingMain] };
    const state = constructorSlice.reducer(stateWithFilling, removeIngredient(mockFillingSauce.id));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(mockFillingMain);
  });

  it('Слайс обрабатывает экшен изменения порядка ингредиентов', () => {
    const stateWithFilling = { ...initialState, ingredients: [mockFillingSauce, mockFillingMain]};
    const state = constructorSlice.reducer(stateWithFilling, moveIngredient({ from: 0, to: 1 }));
    expect(state.ingredients[0]).toEqual(mockFillingMain);
    expect(state.ingredients[1]).toEqual(mockFillingSauce);
  });

  it('Слайс обрабатывает экшен очищения конструктора', () => {
    const filledState = {
      bun: mockBun,
      ingredients: [mockFillingSauce, mockFillingMain]
    };
    const state = constructorSlice.reducer(filledState, clearConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});