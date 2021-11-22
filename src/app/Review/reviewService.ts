import { connect_service } from '../../../controllers/mysql';
import * as reviewDao from './reviewDao';

// Service: Create, Update, Delete 비즈니스 로직 처리

// 리뷰 작성
export const createReview = async function (
  userId: number,
  orderId: number,
  imageURL: string,
  contents: string,
  point: number
) {
  const result = connect_service(
    reviewDao.createReview,
    'Review-createReview Service',
    userId,
    orderId,
    imageURL,
    contents,
    point
  );

  return result;
};

// 리뷰 삭제
export const deleteReview = async function (reviewId: string) {
  const result = connect_service(
    reviewDao.deleteReview,
    'Review-deleteReview Service',
    reviewId
  );

  return result;
};

// 리뷰 신고
export const reportReview = async function (
  userId: number,
  reviewId: string,
  selectReasonArr: number[],
  commentReason: string
) {
  const result = connect_service(
    reviewDao.reportReview,
    'Review-reportReview Service',
    userId,
    reviewId,
    selectReasonArr,
    commentReason
  );

  return result;
};

// 리뷰 수정
export const modifyReview = async function (
  reviewId: number,
  point: number,
  contents: string,
  imageURL: string
) {
  const result = connect_service(
    reviewDao.modifyReview,
    'Review-modifyReview Service',
    reviewId,
    point,
    contents,
    imageURL
  );

  return result;
};
