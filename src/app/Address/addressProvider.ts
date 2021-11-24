import { connect_provider } from '../../../controllers/mysql';
import * as addressDao from './addressDao';

// Provider: Read 비즈니스 로직 처리

// 유저 존재 여부 확인
export const checkUserExist = async function (userId: number) {
  const result = await connect_provider(
    addressDao.checkUserExist,
    'Address-checkUserExist Provider',
    userId
  );

  return result;
};

// 주소 존재 여부 확인
export const checkAddressExist = async function (addressId: string) {
  const result = await connect_provider(
    addressDao.checkAddressExist,
    'Address-checkAddressExist Provider',
    addressId
  );

  return result;
};

// 주소 목록 조회
export const selectAddress = async function (userId: number) {
  const result = await connect_provider(
    addressDao.selectAddress,
    'Address-selectAddress Provider',
    userId
  );

  return result;
};

// 집/회사 주소 존재 여부 확인
export const checkHouseCompany = async function (userId: number, type: number) {
  const result = await connect_provider(
    addressDao.checkHouseCompany,
    'Address-checkHouseCompany Provider',
    userId,
    type
  );

  return result;
};

// 계정 정지 여부 확인
export const checkUserBlocked = async function (userId: number) {
  const result = await connect_provider(
    addressDao.checkUserBlocked,
    'Address-checkUserBlocked Provider',
    userId
  );

  return result;
};

// 계정 탈퇴 여부 확인
export const checkUserWithdrawn = async function (userId: number) {
  const result = await connect_provider(
    addressDao.checkUserWithdrawn,
    'Address-checkUserWithdrawn Provider',
    userId
  );

  return result;
};
