import { expect } from '@jest/globals';
import store, { rootReducer } from '../store';

describe('Тест store', () => {
  test('Тест RootReducer', () => {
    const rootReducerTest = rootReducer(undefined, { type: 'action' });
    expect(rootReducerTest).toEqual(store.getState());
  });
}); 