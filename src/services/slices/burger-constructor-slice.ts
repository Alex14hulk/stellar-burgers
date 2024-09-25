import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';

export const saveBurger = createAsyncThunk(
  'constructor/saveBurger',
  async function (orderData: string[]) {
    const response = await orderBurgerApi(orderData);
    return response;
  }
);

export type TBurgerConstructorState = {
  isLoading: boolean;
  burgerConstructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: {
    isLoading: false,
    burgerConstructorItems: {
      bun: null,
      ingredients: []
    },
    orderRequest: false,
    orderModalData: null,
    error: null
  } as TBurgerConstructorState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const id = nanoid();
      const payload: TConstructorIngredient = { ...action.payload, id };
      if (action.payload.type === 'bun') {
        state.burgerConstructorItems.bun = payload;
      } else {
        state.burgerConstructorItems.ingredients.push(payload);
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.burgerConstructorItems.ingredients =
        state.burgerConstructorItems.ingredients.filter(
          (i) => i.id !== action.payload
        );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      state.burgerConstructorItems.ingredients.splice(
        action.payload,
        0,
        state.burgerConstructorItems.ingredients.splice(
          action.payload - 1,
          1
        )[0]
      );
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      state.burgerConstructorItems.ingredients.splice(
        action.payload,
        0,
        state.burgerConstructorItems.ingredients.splice(
          action.payload + 1,
          1
        )[0]
      );
    },
    resetModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveBurger.pending, (state) => {
        state.isLoading = true;
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(saveBurger.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderRequest = false;
        state.error = null;
        state.orderModalData = action.payload.order;
        state.burgerConstructorItems = {
          bun: null,
          ingredients: []
        };
      })
      .addCase(saveBurger.rejected, (state, action) => {
        state.isLoading = false;
        state.orderRequest = false;
        state.error = action.error as string;
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetModal
} = constructorSlice.actions;
export default constructorSlice.reducer;
