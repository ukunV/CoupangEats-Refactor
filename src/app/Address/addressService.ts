import { connect_service } from '../../../controllers/mysql';
import * as addressDao from './addressDao';

// Service: Create, Update, Delete 비즈니스 로직 처리

// 주소 추가
export const insertAddress = async function (
  userId: number,
  type: number,
  nickname: string,
  buildingName: string,
  address: string,
  detailAddress: string,
  information: string,
  lat: string,
  lng: string
) {
  const result = await connect_service(
    addressDao.insertAddress,
    'Address-insertAddress Service',
    userId,
    type,
    nickname,
    buildingName,
    address,
    detailAddress,
    information,
    lat,
    lng
  );

  return result;
};

// 주소 수정
export const updateAddress = async function (
  userId: number,
  type: number,
  nickname: string,
  buildingName: string,
  address: string,
  detailAddress: string,
  information: string,
  lat: string,
  lng: string,
  addressId: string
) {
  const result = await connect_service(
    addressDao.updateAddress,
    'Address-updateAddress Service',
    userId,
    type,
    nickname,
    buildingName,
    address,
    detailAddress,
    information,
    lat,
    lng,
    addressId
  );

  return result;
};

// 주소 삭제
export const deleteAddress = async function (addressId: string) {
  const result = await connect_service(
    addressDao.deleteAddress,
    'Address-deleteAddress Service',
    addressId
  );

  return result;
};

// 주소 목록에서 주소 선택
export const updateLocation = async function (
  addressId: number,
  userId: number,
  lat: string,
  lng: string
) {
  const result = await connect_service(
    addressDao.updateLocation,
    'Address-updateLocation Service',
    addressId,
    userId,
    lat,
    lng
  );

  return result;
};
