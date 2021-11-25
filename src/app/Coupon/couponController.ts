import * as couponProvider from '../../app/Coupon/couponProvider';
import * as couponService from '../../app/Coupon/couponService';
import { baseResponse } from '../../../config/baseResponseStatus';
import { response, errResponse } from '../../../config/response';

// regular expression
const regPrice = /^[0-9]/;

/**
 * API No. 21
 * API Name : My 이츠에서 쿠폰 목록 조회 API
 * [GET] /coupons/my-eats/coupon-list
 */
export const getMyEatsCoupons = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  // Request Error End

  // Response Error Start

  const checkUserExist = await couponProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await couponProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await couponProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  // Response Error End

  const result = await couponProvider.selectMyEatsCoupons(userId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 22
 * API Name : 카트에서 쿠폰 목록 조회 API
 * [GET] /coupons/cart/coupon-list
 * query string: storeId, totalPrice
 */
export const getCartCoupons = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  const { storeId, totalPrice } = req.query;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!storeId) return res.send(errResponse(baseResponse.STORE_ID_IS_EMPTY)); // 2026

  if (!totalPrice)
    return res.send(errResponse(baseResponse.TOTAL_PRICE_ID_IS_EMPTY)); // 2027

  if (!regPrice.test(totalPrice))
    return res.send(errResponse(baseResponse.PRICE_IS_NOT_VALID)); // 2025

  // Request Error End

  // Response Error Start

  const checkUserExist = await couponProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await couponProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await couponProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkStoreExist = await couponProvider.checkStoreExist(storeId);

  if (checkStoreExist === 0)
    return res.send(errResponse(baseResponse.STORE_IS_NOT_EXIST)); // 3008

  // Response Error End

  const result = await couponProvider.selectCartCoupons(
    userId,
    storeId,
    totalPrice
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 23
 * API Name : 쿠폰 등록 API
 * [POST] /coupons
 */
export const createCoupons = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  const { number } = req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  // Request Error End

  // Response Error Start

  const checkUserExist = await couponProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await couponProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await couponProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkCouponExist = await couponProvider.checkCouponExist(number);

  if (checkCouponExist === 0)
    return res.send(errResponse(baseResponse.COUPON_IS_NOT_EXIST)); // 3015

  const checkCouponAlive = await couponProvider.checkCouponAlive(number);

  if (checkCouponAlive === 0)
    return res.send(errResponse(baseResponse.COUPON_IS_NOT_VALID)); // 3016

  const checkCouponObtained = await couponProvider.checkCouponObtained(
    userId,
    number
  );

  if (checkCouponObtained === 1)
    return res.send(errResponse(baseResponse.COUPON_AlREADY_OBTAINED)); // 3017

  // Response Error End

  const result = await couponService.createCoupons(userId, number);

  return res.send(response(baseResponse.SUCCESS, result));
};
