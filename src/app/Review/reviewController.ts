import * as reviewProvider from '../../app/Review/reviewProvider';
import * as reviewService from '../../app/Review/reviewService';
import { baseResponse } from '../../../config/baseResponseStatus';
import { response, errResponse } from '../../../config/response';

// regular expression
const regPage = /^[0-9]/;
const regSize = /^[0-9]/;
const regSelectedReason = /^[0-9]/;

/**
 * API No. 32
 * API Name : 최근 포토 리뷰 3개 조회 API
 * [GET] /reviews/:storeId/photo-review
 * path variable: storeId
 */
export const getPhotoReviews = async function (req: any, res: any) {
  const { storeId } = req.params;

  // Request Error Start

  if (!storeId) return res.send(errResponse(baseResponse.STORE_ID_IS_EMPTY)); // 2026

  // Request Error End

  // Response Error Start

  const checkStoreExist = await reviewProvider.checkStoreExist(storeId);

  if (checkStoreExist === 0)
    return res.send(errResponse(baseResponse.STORE_IS_NOT_EXIST)); // 3008

  // Response Error End

  const result = await reviewProvider.selectPhotoReviews(storeId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 33
 * API Name : 리뷰 조회 API
 * [GET] /reviews/:storeId/review-list
 * path variable: storeId
 * query string: (page, size), (filter, photoFilter)
 */
export const getReviewList = async function (req: any, res: any) {
  const { storeId } = req.params;

  let { page } = req.query;
  const { size } = req.query;

  const { filter, photoFilter } = req.query;

  // Request Error Start

  if (!storeId) return res.send(errResponse(baseResponse.STORE_ID_IS_EMPTY)); // 2026

  if (photoFilter != 0 && photoFilter != 1 && photoFilter != '')
    return res.send(errResponse(baseResponse.PHOTO_FILTER_IS_NOT_VALID)); // 2036

  if (filter != 1 && filter != 2 && filter != 3 && filter != 4 && filter != '')
    return res.send(errResponse(baseResponse.FILTER_IS_NOT_VALID)); // 2028

  if (!page) return res.send(errResponse(baseResponse.PAGE_IS_EMPTY)); // 2017

  if (!regPage.test(page))
    return res.send(errResponse(baseResponse.PAGE_IS_NOT_VALID)); // 2018

  if (!size) return res.send(errResponse(baseResponse.SIZE_IS_EMPTY)); // 2019

  if (!regSize.test(size))
    return res.send(errResponse(baseResponse.SIZE_IS_NOT_VALID)); // 2020

  // Request Error End

  page = size * (page - 1);

  // Response Error Start

  const checkStoreExist = await reviewProvider.checkStoreExist(storeId);

  if (checkStoreExist === 0)
    return res.send(errResponse(baseResponse.STORE_IS_NOT_EXIST)); // 3008

  // Response Error End

  let condition = 'order by ';

  if (filter === '1') condition += 'r.createdAt desc';
  else if (filter === '2') condition += 'rlc.count desc, r.createdAt desc';
  else if (filter === '3') condition += 'r.point desc, r.createdAt desc';
  else if (filter === '4') condition += 'r.point asc, r.createdAt desc';
  else condition += 'r.createdAt desc';

  let photoCondition;

  if (photoFilter === '1') photoCondition = 'and isPhoto = 1';
  else photoCondition = '';

  const result = await reviewProvider.selectReviewList(
    storeId,
    page,
    size,
    condition,
    photoCondition
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 34
 * API Name : 리뷰 작성 API
 * [POST] /reviews/detail
 */
export const createReview = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  const { orderId, imageURL, contents, point } = req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!orderId) return res.send(errResponse(baseResponse.ORDER_ID_IS_EMPTY)); // 2040

  if (!point) return res.send(errResponse(baseResponse.POINT_IS_EMPTY)); // 2039

  if (point != 1 && point != 2 && point != 3 && point != 4 && point != 5)
    return res.send(errResponse(baseResponse.POINT_IS_NOT_VALID)); // 2038

  if (contents.length < 10)
    return res.send(errResponse(baseResponse.CONTENTS_IS_SHORT)); // 2041

  // Request Error End

  // Response Error Start

  const checkUserExist = await reviewProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await reviewProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await reviewProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkUsersOrder = await reviewProvider.checkUsersOrder(userId, orderId);

  if (checkUsersOrder === 0)
    return res.send(errResponse(baseResponse.ORDER_IS_NOT_USERS)); // 3030

  const checkOrderExist = await reviewProvider.checkOrderExist(orderId);

  if (checkOrderExist === 0)
    return res.send(errResponse(baseResponse.ORDER_IS_NOT_EXIST)); // 3027

  const checkOrderDeleted = await reviewProvider.checkOrderDeleted(orderId);

  if (checkOrderDeleted === 0)
    return res.send(errResponse(baseResponse.ORDER_IS_DELETED)); // 3028

  const checkReviewExistByOrderId =
    await reviewProvider.checkReviewExistByOrderId(orderId);

  if (checkReviewExistByOrderId === 1)
    return res.send(errResponse(baseResponse.REVIEW_ALREADY_EXIST)); // 3029

  // Response Error End

  const result = await reviewService.createReview(
    userId,
    orderId,
    imageURL,
    contents,
    point
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 35
 * API Name : 리뷰 삭제 API
 * [PATCH] /reviews
 */
export const deleteReview = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  const { reviewId } = req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!reviewId) return res.send(errResponse(baseResponse.REVIEW_ID_IS_EMPTY)); // 2042

  // Request Error End

  // Response Error Start

  const checkUserExist = await reviewProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await reviewProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await reviewProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkReviewExistByReviewId =
    await reviewProvider.checkReviewExistByReviewId(reviewId);

  if (checkReviewExistByReviewId === 0)
    return res.send(errResponse(baseResponse.REVIEW_IS_NOT_EXIST)); // 3031

  const checkReviewHost = await reviewProvider.checkReviewHost(
    userId,
    reviewId
  );

  if (checkReviewHost === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_REVIEW_HOST)); // 3032

  // Response Error End

  const result = await reviewService.deleteReview(reviewId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 36
 * API Name : 리뷰 신고 API
 * [POST] /reviews
 */
export const reportReview = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  const { reviewId } = req.params;

  const { selectReasonArr, commentReason } = req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!reviewId) return res.send(errResponse(baseResponse.REVIEW_ID_IS_EMPTY)); // 2042

  if (selectReasonArr.length === 0)
    return res.send(
      errResponse(baseResponse.CHOOSE_MORE_THAN_ONE_SELECT_REASON)
    ); // 2043

  for (let i = 0; i < selectReasonArr.length; i++) {
    if (!regSelectedReason.test(selectReasonArr[i]))
      return res.send(
        errResponse(baseResponse.SELECT_REASON_TYPE_IS_NOT_VALID)
      ); // 2045

    if (!(selectReasonArr[i] in [1, 2, 3, 4, 5, 6, 7, 8]))
      return res.send(
        errResponse(baseResponse.SELECT_REASON_TYPE_IS_NOT_VALID)
      ); // 2045
  }

  if (commentReason.length < 10)
    return res.send(errResponse(baseResponse.COMMENT_REASON_IS_SHORT)); // 2044

  // Request Error End

  // Response Error Start

  const checkUserExist = await reviewProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await reviewProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await reviewProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkReviewExistByReviewId =
    await reviewProvider.checkReviewExistByReviewId(reviewId);

  if (checkReviewExistByReviewId === 0)
    return res.send(errResponse(baseResponse.REVIEW_IS_NOT_EXIST)); // 3031

  const checkReviewHost = await reviewProvider.checkReviewHost(
    userId,
    reviewId
  );

  if (checkReviewHost === 1)
    return res.send(errResponse(baseResponse.REVIEW_CAN_REPORTED_BY_OTHERS)); // 3033

  const checkAlreadyReport = await reviewProvider.checkAlreadyReport(
    userId,
    reviewId
  );

  if (checkAlreadyReport === 1)
    return res.send(errResponse(baseResponse.USER_ALREADY_REPORT)); // 3034

  // Response Error End

  const result = await reviewService.reportReview(
    userId,
    reviewId,
    selectReasonArr,
    commentReason
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 37
 * API Name : 내가 작성한 리뷰 조회 API
 * [GET] /reviews/:orderId/review-detail
 */
export const getMyReview = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  const { orderId } = req.params;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!orderId) return res.send(errResponse(baseResponse.ORDER_ID_IS_EMPTY)); // 2040

  // Request Error End

  // Response Error Start

  const checkUserExist = await reviewProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await reviewProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await reviewProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkOrderExist = await reviewProvider.checkOrderExist(orderId);

  if (checkOrderExist === 0)
    return res.send(errResponse(baseResponse.ORDER_IS_NOT_EXIST)); // 3027

  const checkOrderDeleted = await reviewProvider.checkOrderDeleted(orderId);

  if (checkOrderDeleted === 0)
    return res.send(errResponse(baseResponse.ORDER_IS_DELETED)); // 3028

  const checkUsersOrder = await reviewProvider.checkUsersOrder(userId, orderId);

  if (checkUsersOrder === 0)
    return res.send(errResponse(baseResponse.ORDER_IS_NOT_USERS)); // 3030

  const checkReviewExistByOrderId =
    await reviewProvider.checkReviewExistByOrderId(orderId);

  if (checkReviewExistByOrderId === 0)
    return res.send(errResponse(baseResponse.REVIEW_IS_NOT_EXIST)); // 3031

  // Response Error End

  const result = await reviewProvider.selectMyReview(orderId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 38
 * API Name : 리뷰 수정 API
 * [PATCH] /reviews/detail
 */
export const modifyReview = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  const { reviewId } = req.body;

  const { point, contents, imageURL } = req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!reviewId) return res.send(errResponse(baseResponse.REVIEW_ID_IS_EMPTY)); // 2042

  if (!point) return res.send(errResponse(baseResponse.POINT_IS_EMPTY)); // 2039

  if (point != 1 && point != 2 && point != 3 && point != 4 && point != 5)
    return res.send(errResponse(baseResponse.POINT_IS_NOT_VALID)); // 2038

  if (contents.length < 10)
    return res.send(errResponse(baseResponse.CONTENTS_IS_SHORT)); // 2041

  // Request Error End

  // Response Error Start

  const checkUserExist = await reviewProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await reviewProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await reviewProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkReviewExistByReviewId =
    await reviewProvider.checkReviewExistByReviewId(reviewId);

  if (checkReviewExistByReviewId === 0)
    return res.send(errResponse(baseResponse.REVIEW_IS_NOT_EXIST)); // 3031

  const checkReviewHost = await reviewProvider.checkReviewHost(
    userId,
    reviewId
  );

  if (checkReviewHost === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_REVIEW_HOST)); // 3032

  // Response Error End

  const result = await reviewService.modifyReview(
    reviewId,
    point,
    contents,
    imageURL
  );

  return res.send(response(baseResponse.SUCCESS, result));
};
