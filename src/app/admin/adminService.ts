import { connect_service } from '../../../controllers/mysql';
import * as adminDao from './adminDao';

// Service: Create, Update, Delete 비즈니스 로직 처리

// 주문 상태 변경(주문 수락됨)
export const updateOrderStatus = async function (
  orderId: number,
  status: number
) {
  const result = await connect_service(
    adminDao.updateOrderStatus,
    'admin-updateOrderStatus Service',
    orderId,
    status
  );

  return result;
};

// 라이더 위치 초기 세팅
export const createRider = async function (storeId: number, orderId: number) {
  const result = await connect_service(
    adminDao.createRider,
    'admin-createRider Service',
    storeId,
    orderId
  );

  return result;
};

// 라이더 위치 갱신
export const updateRider = async function (
  orderId: number,
  lat: string,
  lng: string
) {
  const result = await connect_service(
    adminDao.updateRider,
    'admin-updateRider Service',
    orderId,
    lat,
    lng
  );

  return result;
};
