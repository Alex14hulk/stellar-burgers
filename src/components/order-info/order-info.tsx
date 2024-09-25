import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams, Params, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { getOrders } from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const location = useLocation();
  const dispatch = useDispatch();
  let orders;
  if (location.pathname.includes('feed')) {
    orders = useSelector((state) => state.feeds.orders);
  } else {
    const isOrdersExist = useSelector((state) => state.order.orderList);
    if (isOrdersExist.length === 0) {
      dispatch(getOrders());
    }
    orders = useSelector((state) => state.order.orderList);
  }
  const { number } = useParams<Params>();
  if (!number) {
    return;
  }
  const orderData = orders.find((el) => +el.number === +number);
  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.ingredients
  );

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
