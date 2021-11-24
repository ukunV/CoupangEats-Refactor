import { connect_provider } from '../../../controllers/mysql';
import * as adminDao from './adminDao';

// Provider: Read 비즈니스 로직 처리

// 주문 배달완료 여부 check
export const checkOrderAlive = async function (orderId: string) {
  const result = await connect_provider(
    adminDao.checkOrderAlive,
    'admin-checkOrderAlive Provider',
    orderId
  );

  return result;
};

// 주문 상태 check (status = 1)
export const checkOrderStatus = async function (
  orderId: string,
  status: number
) {
  const result = await connect_provider(
    adminDao.checkOrderStatus,
    'admin-checkOrderStatus Provider',
    orderId,
    status
  );

  return result;
};

// 주문 존재 여부 check
export const checkOrderExist = async function (
  storeId: string,
  orderId: string
) {
  const result = await connect_provider(
    adminDao.checkOrderExist,
    'admin-checkOrderExist Provider',
    storeId,
    orderId
  );

  return result;
};
