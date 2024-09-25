import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getOrders } from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrders());
  }, []);
  const orders: TOrder[] = useSelector((state) => state.order.orderList);

  return <ProfileOrdersUI orders={orders} />;
};
