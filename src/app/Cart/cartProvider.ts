import { connect_provider, connect_service } from '../../../controllers/mysql';
import * as cartDao from './cartDao';

// Provider: Read 비즈니스 로직 처리

// 유저 존재 여부 check
export const checkUserExist = async function (userId: number) {
  const result = await connect_provider(
    cartDao.checkUserExist,
    'Cart-checkUserExist Provider',
    userId
  );

  return result;
};

// 음식점 존재 여부 check
export const checkStoreExist = async function (storeId: string) {
  const result = await connect_provider(
    cartDao.checkStoreExist,
    'Cart-checkStoreExist Provider',
    storeId
  );

  return result;
};

// 메뉴 존재 여부 check
export const checkMenuExist = async function (menuId: string) {
  const result = await connect_provider(
    cartDao.checkMenuExist,
    'Cart-checkMenuExist Provider',
    menuId
  );

  return result;
};

// 카트 상태 check
export const checkCartExist = async function (userId: number) {
  const result = await connect_provider(
    cartDao.checkCartExist,
    'Cart-checkCartExist Provider',
    userId
  );

  return result;
};

// 같은 음식점의 메뉴 여부 check
export const checkSameStore = async function (userId: number, storeId: string) {
  const result = await connect_provider(
    cartDao.checkSameStore,
    'Cart-checkSameStore Provider',
    userId,
    storeId
  );

  return result;
};

// 카트에 다른 상점이 이미 있는지 check
export const checkOtherStoreExist = async function (
  userId: number,
  storeId: string
) {
  const result = await connect_provider(
    cartDao.checkOtherStoreExist,
    'Cart-checkOtherStoreExist Provider',
    userId,
    storeId
  );

  return result;
};

// 카트에 메뉴 존재 여부 check
export const checkMenuExistAtCart = async function (
  userId: number,
  rootId: string
) {
  const result = await connect_provider(
    cartDao.checkMenuExistAtCart,
    'Cart-checkMenuExistAtCart Provider',
    userId,
    rootId
  );

  return result;
};

// 카트 조회
export const selectCart = async function (userId: number) {
  const result = await connect_provider(
    cartDao.selectCart,
    'Cart-selectCart Provider',
    userId
  );

  return result;
};

// 카트 배달비 조회
export const selectCartDeliveryFee = async function (
  storeId: string,
  totalPrice: string
) {
  const result = await connect_provider(
    cartDao.selectCartDeliveryFee,
    'Cart-selectCartDeliveryFee Provider',
    storeId,
    totalPrice
  );

  return result;
};

// 카트 최대 할인 쿠폰 조회 *
export const selectCartCoupon = async function (
  userId: number,
  storeId: string,
  totalPrice: string
) {
  const result = await connect_service(
    cartDao.selectCartCoupon,
    'Cart-selectCartCoupon Provider',
    userId,
    storeId,
    totalPrice
  );

  return result;
};

// 쿠폰 획득 여부 check
export const checkCouponObtainedExist = async function (
  userId: number,
  couponObtainedId: string
) {
  const result = await connect_provider(
    cartDao.checkCouponObtainedExist,
    'Cart-checkCouponObtainedExist Provider',
    userId,
    couponObtainedId
  );

  return result;
};

// 카트에서 선택한 쿠폰 조회
export const selectCouponChoice = async function (userId: number) {
  const result = await connect_provider(
    cartDao.selectCouponChoice,
    'Cart-selectCouponChoice Provider',
    userId
  );

  return result;
};

// 계정 정지 여부 확인
export const checkUserBlocked = async function (userId: number) {
  const result = await connect_provider(
    cartDao.checkUserBlocked,
    'Cart-checkUserBlocked Provider',
    userId
  );

  return result;
};

// 계정 탈퇴 여부 확인
export const checkUserWithdrawn = async function (userId: number) {
  const result = await connect_provider(
    cartDao.checkUserWithdrawn,
    'Cart-checkUserWithdrawn Provider',
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
    cartDao.checkPaymentExist,
    'Cart-checkPaymentExist Provider',
    userId,
    paymentId
  );

  return result;
};
