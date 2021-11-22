import { connect_service } from '../../../controllers/mysql';
import * as storeDao from './storeDao';

// Service: Create, Update, Delete 비즈니스 로직 처리

// 음식점 즐겨찾기 추가
export const createStoreLike = async function (
  userId: number,
  storeId: string
) {
  const result = await connect_service(
    storeDao.createStoreLike,
    'Store-createStoreLike Service',
    userId,
    storeId
  );

  return result;
};

// 음식점 즐겨찾기 삭제
export const deleteStoreLike = async function (
  userId: number,
  storeIdArr: number[]
) {
  const result = await connect_service(
    storeDao.deleteStoreLike,
    'Store-deleteStoreLike Service',
    userId,
    storeIdArr
  );

  return result;
};
