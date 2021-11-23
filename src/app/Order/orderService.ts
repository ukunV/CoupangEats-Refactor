import { connect_service } from '../../../controllers/mysql';
import * as orderDao from './orderDao';

// Service: Create, Update, Delete 비즈니스 로직 처리

// 주문 정보 생성
export const createOrder = async function (
  userId: number,
  storeId: number,
  addressId: number,
  paymentId: number,
  deliveryFee: number,
  discount: number,
  finalPrice: number
) {
  const result = await connect_service(
    orderDao.createOrder,
    'Order-createOrder Service',
    userId,
    storeId,
    addressId,
    paymentId,
    deliveryFee,
    discount,
    finalPrice
  );

  return result;
};

// 주문 정보 생성 -> 쿠폰 상태 변경
export const changeCouponStatus = async function (couponObtainedId: number) {
  const result = await connect_service(
    orderDao.changeCouponStatus,
    'Order-changeCouponStatus Service',
    couponObtainedId
  );

  return result;
};

// 주문 정보 생성 -> 카트 상태 변경
export const changeCartStatus = async function (
  userId: number,
  rootIdArr: number[]
) {
  const result = await connect_service(
    orderDao.changeCartStatus,
    'Order-changeCartStatus Service',
    userId,
    rootIdArr
  );

  return result;
};
