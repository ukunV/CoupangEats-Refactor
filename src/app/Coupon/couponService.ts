import { connect_service } from '../../../controllers/mysql';
import * as couponDao from './couponDao';

// Service: Create, Update, Delete 비즈니스 로직 처리

// 쿠폰 등록
export const createCoupons = async function (userId: number, number: string) {
  const result = await connect_service(
    couponDao.createCoupons,
    'Coupon-createCoupons Service',
    userId,
    number
  );

  return result;
};
