import { connect_provider } from '../../../controllers/mysql';
import * as couponDao from './couponDao';

// Provider: Read 비즈니스 로직 처리

// 유저 존재 여부 확인
export const checkUserExist = async function (userId: number) {
  const result = await connect_provider(
    couponDao.checkUserExist,
    'Coupon-checkUserExist Provider',
    userId
  );

  return result;
};

// 음식점 존재 여부 check
export const checkStoreExist = async function (storeId: string) {
  const result = await connect_provider(
    couponDao.checkStoreExist,
    'Coupon-checkStoreExist Provider',
    storeId
  );

  return result;
};

// My 이츠에서 쿠폰 목록 조회
export const selectMyEatsCoupons = async function (userId: number) {
  const result = await connect_provider(
    couponDao.selectMyEatsCoupons,
    'Coupon-selectMyEatsCoupons Provider',
    userId
  );

  return result;
};

// 카트에서 쿠폰 목록 조회
export const selectCartCoupons = async function (
  userId: number,
  storeId: string,
  totalPrice: string
) {
  const result = await connect_provider(
    couponDao.selectCartCoupons,
    'Coupon-selectCartCoupons Provider',
    userId,
    storeId,
    totalPrice
  );

  return result;
};

// 쿠폰 존재 여부 check
export const checkCouponExist = async function (number: string) {
  const result = await connect_provider(
    couponDao.checkCouponExist,
    'Coupon-checkCouponExist Provider',
    number
  );

  return result;
};

// 쿠폰 만료 여부 check
export const checkCouponAlive = async function (number: string) {
  const result = await connect_provider(
    couponDao.checkCouponAlive,
    'Coupon-checkCouponAlive Provider',
    number
  );

  return result;
};

// 쿠폰 소지 여부 check
export const checkCouponObtained = async function (
  userId: number,
  number: string
) {
  const result = await connect_provider(
    couponDao.checkCouponObtained,
    'Coupon-checkCouponObtained Provider',
    userId,
    number
  );

  return result;
};

// 계정 정지 여부 확인
export const checkUserBlocked = async function (userId: number) {
  const result = await connect_provider(
    couponDao.checkUserBlocked,
    'Coupon-checkUserBlocked Provider',
    userId
  );

  return result;
};

// 계정 탈퇴 여부 확인
export const checkUserWithdrawn = async function (userId: number) {
  const result = await connect_provider(
    couponDao.checkUserWithdrawn,
    'Coupon-checkUserWithdrawn Provider',
    userId
  );

  return result;
};
