import { connect_provider } from '../../../controllers/mysql';
import * as orderDao from './orderDao';

// Provider: Read 비즈니스 로직 처리

// 유저 존재 여부 check
export const checkUserExist = async function (userId: number) {
  const result = await connect_provider(
    orderDao.checkUserExist,
    'Order-checkUserExist Provider',
    userId
  );

  return result;
};

// 계정 정지 여부 확인
export const checkUserBlocked = async function (userId: number) {
  const result = await connect_provider(
    orderDao.checkUserBlocked,
    'Order-checkUserBlocked Provider',
    userId
  );

  return result;
};

// 계정 탈퇴 여부 확인
export const checkUserWithdrawn = async function (userId: number) {
  const result = await connect_provider(
    orderDao.checkUserWithdrawn,
    'Order-checkUserWithdrawn Provider',
    userId
  );

  return result;
};

// 결제수단 존재 여부 check
export const checkPaymentExist = async function (
  userId: number,
  paymentId: string
) {
  const result = await connect_provider(
    orderDao.checkPaymentExist,
    'Order-checkPaymentExist Provider',
    userId,
    paymentId
  );

  return result;
};

// 쿠폰 존재 여부 check
export const checkCouponExist = async function (
  userId: number,
  couponObtainedId: string
) {
  const result = await connect_provider(
    orderDao.checkCouponExist,
    'Order-checkCouponExist Provider',
    userId,
    couponObtainedId
  );

  return result;
};

// 주문내역 조회
export const selectOrderList = async function (userId: number) {
  const result = await connect_provider(
    orderDao.selectOrderList,
    'Order-selectOrderList Provider',
    userId
  );

  return result;
};

// 주문내역 존재 여부 check
export const checkOrderExist = async function (
  userId: number,
  orderId: string
) {
  const result = await connect_provider(
    orderDao.checkOrderExist,
    'Order-checkOrderExist Provider',
    userId,
    orderId
  );

  return result;
};

// 영수증 조회
export const selectOrderReceipt = async function (orderId: string) {
  const result = await connect_provider(
    orderDao.selectOrderReceipt,
    'Order-selectOrderReceipt Provider',
    orderId
  );

  return result;
};

// 배달 현황 조회
export const getDeliveryStatus = async function (orderId: string) {
  const result = await connect_provider(
    orderDao.getDeliveryStatus,
    'Order-getDeliveryStatus Provider',
    orderId
  );

  return result;
};
