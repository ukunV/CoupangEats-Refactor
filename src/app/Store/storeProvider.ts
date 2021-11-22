import * as storeDao from './storeDao';
import { connect_provider } from '../../../controllers/mysql';

// Provider: Read 비즈니스 로직 처리

// 음식 카테고리 조회
export const selectFoodCategory = async function () {
  const result = await connect_provider(
    storeDao.selectFoodCategory,
    'Store-selectFoodCategory Provider'
  );

  return result;
};

// 유저 존재 여부 check
export const checkUserExist = async function (userId: number) {
  const result = await connect_provider(
    storeDao.checkUserExist,
    'Store-checkUserExist Provider',
    userId
  );

  return result;
};

// 카테고리 존재 여부 check
export const checkCategoryExist = async function (categoryId: string) {
  const result = await connect_provider(
    storeDao.checkCategoryExist,
    'Store-checkCategoryExist Provider',
    categoryId
  );

  return result;
};

// 새로 들어왔어요 목록 조회 by userId
export const selectNewStoreByUserId = async function (
  userId: number,
  categoryId: string
) {
  const result = await connect_provider(
    storeDao.selectNewStoreByUserId,
    'Store-selectNewStoreByUserId Provider',
    userId,
    categoryId
  );

  return result;
};

// 새로 들어왔어요 목록 조회 by address
export const selectNewStoreByAddress = async function (
  lat: string,
  lng: string,
  categoryId: string
) {
  const result = await connect_provider(
    storeDao.selectNewStoreByAddress,
    'Store-selectNewStoreByAddress Provider',
    lat,
    lng,
    categoryId
  );

  return result;
};

// 음식점 조회 by categoryId and userId
export const selectStoresByCategoryIdAndUserId = async function (
  userId: number,
  categoryCondition: string,
  page: string,
  size: string,
  filterCondition: string,
  cheetahCondition: string,
  deliveryFeeCondition: string,
  minPriceCondition: string,
  couponCondition: string
) {
  const result = await connect_provider(
    storeDao.selectStoresByCategoryIdAndUserId,
    'Store-selectStoresByCategoryIdAndUserId Provider',
    userId,
    categoryCondition,
    page,
    size,
    filterCondition,
    cheetahCondition,
    deliveryFeeCondition,
    minPriceCondition,
    couponCondition
  );

  return result;
};

// 음식점 조회 by categoryId and address
export const selectStoresByCategoryIdAndAddress = async function (
  lat: string,
  lng: string,
  categoryCondition: string,
  page: string,
  size: string,
  filterCondition: string,
  cheetahCondition: string,
  deliveryFeeCondition: string,
  minPriceCondition: string,
  couponCondition: string
) {
  const result = await connect_provider(
    storeDao.selectStoresByCategoryIdAndAddress,
    'Store-selectStoresByCategoryIdAndAddress',
    lat,
    lng,
    categoryCondition,
    page,
    size,
    filterCondition,
    cheetahCondition,
    deliveryFeeCondition,
    minPriceCondition,
    couponCondition
  );

  return result;
};

// 음식점 존재 여부 check
export const checkStoreExist = async function (storeId: string) {
  const result = await connect_provider(
    storeDao.checkStoreExist,
    'Store-checkStoreExist Provider',
    storeId
  );

  return result;
};

// 음식점 상세페이지 조회
export const selectStore = async function (storeId: string) {
  const result = await connect_provider(
    storeDao.selectStore,
    'Store-selectStore Provider',
    storeId
  );

  return result;
};

// 음식점 배달비 자세히
export const selectStoreDelivery = async function (storeId: string) {
  const result = await connect_provider(
    storeDao.selectStoreDelivery,
    'Store-selectStoreDelivery Provider',
    storeId
  );

  return result;
};

// 음식점 매장/원산지 정보 조회
export const selectStoreInfo = async function (storeId: string) {
  const result = await connect_provider(
    storeDao.selectStoreInfo,
    'Store-selectStoreInfo Provider',
    storeId
  );

  return result;
};

// 메뉴 존재 여부 check
export const checkMenuExist = async function (menuId: string) {
  const result = await connect_provider(
    storeDao.checkMenuExist,
    'Store-checkMenuExist Provider',
    menuId
  );

  return result;
};

// 메인 메뉴 조회 check
export const selectMainMenu = async function (menuId: string) {
  const result = await connect_provider(
    storeDao.selectMainMenu,
    'Store-selectMainMenu Provider',
    menuId
  );

  return result;
};

// 이미 좋아요 클릭 여부 check
export const checkStoreLike = async function (userId: number, storeId: string) {
  const result = await connect_provider(
    storeDao.checkStoreLike,
    'Store-checkStoreLike Provider',
    userId,
    storeId
  );

  return result;
};

// 즐겨찾기 목록 조회
export const selectStoreLike = async function (
  userId: number,
  filterCondition: string
) {
  const result = await connect_provider(
    storeDao.selectStoreLike,
    'Store-selectStoreLike Provider',
    userId,
    filterCondition
  );

  return result;
};

// 계정 정지 여부 확인
export const checkUserBlocked = async function (userId: number) {
  const result = await connect_provider(
    storeDao.checkUserBlocked,
    'Store-checkUserBlocked Provider',
    userId
  );

  return result;
};

// 계정 탈퇴 여부 확인
export const checkUserWithdrawn = async function (userId: number) {
  const result = await connect_provider(
    storeDao.checkUserWithdrawn,
    'Store-checkUserWithdrawn Provider',
    userId
  );

  return result;
};
