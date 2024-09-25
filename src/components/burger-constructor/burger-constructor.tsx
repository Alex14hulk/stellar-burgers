import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  resetModal,
  saveBurger
} from '../../services/slices/burger-constructor-slice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector((state) => state.user.isLoggedIn);
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(
    (state) => state.burgerConstructor.burgerConstructorItems
  );

  const ingredients = constructorItems.ingredients.map((i) => i._id);
  const bun = constructorItems.bun?._id;
  const arr = bun ? [bun, ...ingredients, bun] : ingredients;

  const orderRequest = useSelector(
    (state) => state.burgerConstructor.orderRequest
  );

  const orderModalData = useSelector(
    (state) => state.burgerConstructor.orderModalData
  );

  const onOrderClick = () => {
    if (isAuth && constructorItems.bun) {
      dispatch(saveBurger(arr));
    } else if (isAuth && !constructorItems.bun) {
      return;
    } else if (!isAuth) {
      navigate('/login');
    }
  };

  const closeOrderModal = () => {
    dispatch(resetModal());
  };

  const totalBunPrice = constructorItems.bun
    ? constructorItems.bun.price * 2
    : 0;
  const totalIngredientsPrice = constructorItems.ingredients.reduce(
    (total, ingredient) => total + ingredient.price,
    0
  );
  const price = useMemo(
    () => totalBunPrice + totalIngredientsPrice,
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
