import * as coupon from './couponController';
import { jwtMiddleware } from '../../../config/jwtMiddleware';

export const couponRoute = (app: any) => {
  // 21. My 이츠에서 쿠폰 목록 조회 API
  app.get(
    '/coupons/my-eats/coupon-list',
    jwtMiddleware,
    coupon.getMyEatsCoupons
  );

  // 22. 카트에서 쿠폰 목록 조회 API
  app.get('/coupons/cart/coupon-list', jwtMiddleware, coupon.getCartCoupons);

  // 23. 쿠폰 등록 API
  app.post('/coupons', jwtMiddleware, coupon.createCoupons);
};
