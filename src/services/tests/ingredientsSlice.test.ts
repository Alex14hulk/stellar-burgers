import { TIngredient } from '../../utils/types';
import reducer, {
  initialState,
  fetchIngredients
} from '../slices/ingredientsSlice';

describe('ingredients reducer', () => {
  it('isLoading с false на true', () => {
    const action = fetchIngredients.pending('', undefined);
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
  });

  it('Сохранение нового ингредиента и изменение isLoading на false', () => {
    const ingredients: TIngredient[] = [
      {
        _id: 'test1000asd69nnn5c799823f7b9001vmyu111d',
        name: 'Булка Звездный Лорд',
        type: 'bun',
        proteins: 1050,
        fat: 1,
        carbohydrates: 220,
        calories: 150000,
        price: 5000,
        image: 'image.jpg',
        image_mobile: 'image_mobile.jpg',
        image_large: 'image_large.jpg'
      }
    ];
    const action = fetchIngredients.fulfilled(ingredients, '', undefined);
    const state = reducer(initialState, action);
    expect(state.ingredients).toEqual(ingredients);
    expect(state.isLoading).toBe(false);
  });

  it('Сохранение error и изменение isLoading на false', () => {
    const error = 'Failed';
    const action = fetchIngredients.rejected(new Error(), '', undefined, error);
    const state = reducer(initialState, action);
    expect(state.error).toBe(error);
    expect(state.isLoading).toBe(false);
  });
});
