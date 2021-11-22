import { connect_provider } from '../../../controllers/mysql';
import * as reviewDao from './reviewDao';

// Provider: Read 비즈니스 로직 처리

// 유저 존재 여부 check
export const checkUserExist = async function (userId: number) {
  const result = await connect_provider(
    reviewDao.checkUserExist,
    'Review-checkUserExist Provider',
    userId
  );

  return result;
};

// 음식점 존재 여부 check
export const checkStoreExist = async function (storeId: string) {
  const result = await connect_provider(
    reviewDao.checkStoreExist,
    'Review-checkStoreExist Provider',
    storeId
  );

  return result;
};

// 최근 포토 리뷰 3개 조회
export const selectPhotoReviews = async function (storeId: string) {
  const result = await connect_provider(
    reviewDao.selectPhotoReviews,
    'Review-selectPhotoReviews Provider',
    storeId
  );

  return result;
};

// 리뷰 조회
export const selectReviewList = async function (
  storeId: string,
  page: string,
  size: string,
  condition: string,
  photoCondition: string
) {
  const result = await connect_provider(
    reviewDao.selectReviewList,
    'Review-selectReviewList Provider',
    storeId,
    page,
    size,
    condition,
    photoCondition
  );

  return result;
};

// 주문과 회원 일치 여부 check
export const checkUsersOrder = async function (
  userId: number,
  orderId: string
) {
  const result = await connect_provider(
    reviewDao.checkUsersOrder,
    'Review-checkUsersOrder Provider',
    userId,
    orderId
  );

  return result;
};

// 주문 존재 여부 check
export const checkOrderExist = async function (orderId: string) {
  const result = await connect_provider(
    reviewDao.checkOrderExist,
    'Review-checkOrderExist Provider',
    orderId
  );

  return result;
};

// 주문 취소 여부 check
export const checkOrderDeleted = async function (orderId: string) {
  const result = await connect_provider(
    reviewDao.checkOrderDeleted,
    'Review-checkOrderDeleted Provider',
    orderId
  );

  return result;
};

// 리뷰 존재 여부 check by orderId
export const checkReviewExistByOrderId = async function (orderId: string) {
  const result = await connect_provider(
    reviewDao.checkReviewExistByOrderId,
    'Review-checkReviewExistByOrderId Provider',
    orderId
  );

  return result;
};

// 리뷰 존재 여부 check by reviewId
export const checkReviewExistByReviewId = async function (reviewId: string) {
  const result = await connect_provider(
    reviewDao.checkReviewExistByReviewId,
    'Review-checkReviewExistByReviewId Provider',
    reviewId
  );

  return result;
};

// 리뷰 작성자 여부 check
export const checkReviewHost = async function (
  userId: number,
  reviewId: string
) {
  const result = await connect_provider(
    reviewDao.checkReviewHost,
    'Review-checkReviewHost Provider',
    userId,
    reviewId
  );

  return result;
};

// 해당 유저가 이미 신고했는지 check
export const checkAlreadyReport = async function (
  userId: number,
  reviewId: string
) {
  const result = await connect_provider(
    reviewDao.checkAlreadyReport,
    'Review-checkAlreadyReport Provider',
    userId,
    reviewId
  );

  return result;
};

// 내가 작성한 리뷰 조회
export const selectMyReview = async function (orderId: string) {
  const result = await connect_provider(
    reviewDao.selectMyReview,
    'Review-selectMyReview Provider',
    orderId
  );

  return result;
};

// 계정 정지 여부 확인
export const checkUserBlocked = async function (userId: number) {
  const result = await connect_provider(
    reviewDao.checkUserBlocked,
    'Review-checkUserBlocked Provider',
    userId
  );

  return result;
};

// 계정 탈퇴 여부 확인
export const checkUserWithdrawn = async function (userId: number) {
  const result = await connect_provider(
    reviewDao.checkUserWithdrawn,
    'Review-checkUserWithdrawn Provider',
    userId
  );

  return result;
};
