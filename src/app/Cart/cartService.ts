import { connect_service } from '../../../controllers/mysql';
import * as cartDao from './cartDao';

// Service: Create, Update, Delete 비즈니스 로직 처리

// 카트에 담기
export const createCart = async function (
  userId: number,
  storeId: string,
  menuId: string,
  amount: number,
  subIdArr: number[]
) {
  const result = await connect_service(
    cartDao.createCart,
    'Cart-createCart Service',
    userId,
    storeId,
    menuId,
    amount,
    subIdArr
  );

  return result;
};

// 메뉴 수량 변경
export const changeMenuAmount = async function (
  userId: number,
  rootId: number,
  amount: number
) {
  const result = await connect_service(
    cartDao.changeMenuAmount,
    'Cart-changeMenuAmount Service',
    userId,
    rootId,
    amount
  );

  return result;
};

// 카트 비우기
export const cleanUpCart = async function (userId: number) {
  const result = await connect_service(
    cartDao.cleanUpCart,
    'Cart-cleanUpCart Service',
    userId
  );

  return result;
};

// 카트에서 쿠폰 선택
export const changeCoupon = async function (
  userId: number,
  couponObtainedId: number
) {
  const result = await connect_service(
    cartDao.changeCoupon,
    'Cart-changeCoupon Service',
    userId,
    couponObtainedId
  );

  return result;
};

// 카트에서 쿠폰 선택 제거
export const deleteCouponChoice = async function (userId: number) {
  const result = await connect_service(
    cartDao.deleteCouponChoice,
    'Cart-deleteCouponChoice Service',
    userId
  );

  return result;
};

// 카트에서 결제수단 변경
export const changePayment = async function (
  userId: number,
  paymentId: number
) {
  const result = await connect_service(
    cartDao.changePayment,
    'Cart-changePayment Service',
    userId,
    paymentId
  );

  return result;
};

// 카트에서 특정 메뉴 삭제
export const deleteCartMenu = async function (
  userId: number,
  menuId: number,
  createdAt: string
) {
  const result = await connect_service(
    cartDao.deleteCartMenu,
    'Cart-deleteCartMenu Service',
    userId,
    menuId,
    createdAt
  );

  return result;
};
