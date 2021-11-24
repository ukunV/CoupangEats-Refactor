import * as addressProvider from '../../app/Address/addressProvider';
import * as addressService from '../../app/Address/addressService';
import * as baseResponse from '../../../config/baseResponseStatus';
import { response, errResponse } from '../../../config/response';

import { getAddressInfo as kakaoMap } from '../../../controllers/kakao_ctrl';

/**
 * API No. 5
 * API Name : 주소 추가 API (추가와 동시에 사용자 위치 변경)
 * [POST] /addresses
 */
export const createAddresses = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  const { type, nickname, buildingName, address, detailAddress, information } =
    req.body;

  const location = await kakaoMap(address);

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!address) return res.send(errResponse(baseResponse.ADDRESS_IS_EMPTY)); // 2015

  if (typeof location === 'string') {
    return res.send(errResponse(baseResponse.LOCATION_INFO_IS_NOT_VALID)); // 2076
  }

  if (type != 1 && type != 2 && type != 3)
    return res.send(errResponse(baseResponse.TYPE_IS_NOT_VALID)); // 2021

  // Request Error End

  // Response Error Start

  const checkUserExist = await addressProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await addressProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await addressProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  // Response Error End

  const result = await addressService.insertAddress(
    userId,
    type,
    nickname,
    buildingName,
    address,
    detailAddress,
    information,
    location.lat,
    location.lng
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 6
 * API Name : 주소 수정 API
 * [PATCH] /addresses/:addressId/detail
 */
export const modifyAddresses = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  const { addressId } = req.params;

  const { type, nickname, buildingName, address, detailAddress, information } =
    req.body;

  const location = await kakaoMap(address);

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!address) return res.send(errResponse(baseResponse.ADDRESS_IS_EMPTY)); // 2015

  if (typeof location === 'string') {
    return res.send(errResponse(baseResponse.LOCATION_INFO_IS_NOT_VALID)); // 2076
  }

  if (!addressId)
    return res.send(errResponse(baseResponse.ADDRESS_ID_IS_EMPTY)); // 2022

  if (type != 1 && type != 2 && type != 3)
    return res.send(errResponse(baseResponse.TYPE_IS_NOT_VALID)); // 2021

  // Request Error End

  // Response Error Start

  const checkUserExist = await addressProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await addressProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await addressProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkAddressExist = await addressProvider.checkAddressExist(addressId);

  if (checkAddressExist === 0)
    return res.send(errResponse(baseResponse.ADDRESS_IS_NOT_EXIST)); // 3007

  // Response Error End

  const result = await addressService.updateAddress(
    userId,
    type,
    nickname,
    buildingName,
    address,
    detailAddress,
    information,
    location.lat,
    location.lng,
    addressId
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 7
 * API Name : 주소 삭제 API
 * [PATCH] /addresses/:addressId/status
 */
export const deleteAddresses = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  const { addressId } = req.params;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!addressId)
    return res.send(errResponse(baseResponse.ADDRESS_ID_IS_EMPTY)); // 2022

  // Request Error End

  // Response Error Start

  const checkUserExist = await addressProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await addressProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await addressProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkAddressExist = await addressProvider.checkAddressExist(addressId);

  if (checkAddressExist === 0)
    return res.send(errResponse(baseResponse.ADDRESS_IS_NOT_EXIST)); // 3007

  // Response Error End

  const result = await addressService.deleteAddress(addressId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 8
 * API Name : 주소 목록 조회 API
 * [GET] /addresses
 */
export const selectAddresses = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  // Request Error End

  // Response Error Start

  const checkUserExist = await addressProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await addressProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await addressProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  // Response Error End

  const result = await addressProvider.selectAddress(userId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 16
 * API Name : 집/회사 주소 존재 여부 확인 API
 * [GET] /addresses/:type/house-company
 */
export const checkHouseCompany = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  const { type } = req.params;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (type != 1 && type != 2)
    return res.send(errResponse(baseResponse.TYPE_IS_NOT_VALID)); // 2021

  // Request Error End

  // Response Error Start

  const checkUserExist = await addressProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await addressProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await addressProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  // Response Error End

  const result = await addressProvider.checkHouseCompany(userId, type);

  return res.send(response(baseResponse.SUCCESS, { type, exist: result }));
};

/**
 * API No. 17
 * API Name : 주소 목록에서 주소 선택 API
 * [PATCH] /addresses/user-address
 */
export const changeLocation = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  const { addressId, address } = req.body;

  const location = await kakaoMap(address);

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!address) return res.send(errResponse(baseResponse.ADDRESS_IS_EMPTY)); // 2015

  if (typeof location === 'string') {
    return res.send(errResponse(baseResponse.LOCATION_INFO_IS_NOT_VALID)); // 2076
  }

  if (!addressId)
    return res.send(errResponse(baseResponse.ADDRESS_ID_IS_EMPTY)); // 2022

  // Request Error End

  // Response Error Start

  const checkUserExist = await addressProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await addressProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await addressProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkAddressExist = await addressProvider.checkAddressExist(addressId);

  if (checkAddressExist === 0)
    return res.send(errResponse(baseResponse.ADDRESS_IS_NOT_EXIST)); // 3007

  // Response Error End

  const result = await addressService.updateLocation(
    addressId,
    userId,
    location.lat,
    location.lng
  );

  return res.send(response(baseResponse.SUCCESS, result));
};
