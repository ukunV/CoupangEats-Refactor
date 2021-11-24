import * as adminProvider from '../../app/admin/adminProvider';
import * as adminService from '../../app/admin/adminService';
import * as baseResponse from '../../../config/baseResponseStatus';
import { response, errResponse } from '../../../config/response';

import { getAddressInfo as kakaoMap } from '../../../controllers/kakao_ctrl';

/**
 * API No. 101
 * API Name : 주문 상태 변경 API
 * [PATCH] /admin/order-status
 */
export const updateOrderStatus = async function (req: any, res: any) {
  const { orderId } = req.body;

  let { status } = req.body;
  status = parseInt(status);

  // Request Error Start

  if (!orderId) return res.send(errResponse(baseResponse.ORDER_ID_IS_EMPTY)); // 2040

  if (!status) return res.send(errResponse(baseResponse.ORDER_STATUS_IS_EMPTY)); // 2077

  if (!(status in [2, 3, 4, 5]))
    return res.send(errResponse(baseResponse.ORDER_STATUS_IS_NOT_VALID)); // 2078

  // Request Error End

  // Response Error Start

  const checkOrderStatus = await adminProvider.checkOrderStatus(
    orderId,
    status - 1
  );

  if (checkOrderStatus === 0 && status == 2)
    return res.send(errResponse(baseResponse.ORDER_IS_NOT_WAIT_STATUS)); // 3043

  if (checkOrderStatus === 0 && status == 3)
    return res.send(errResponse(baseResponse.ORDER_IS_NOT_WAIT_STATUS)); // 3044

  if (checkOrderStatus === 0 && status == 4)
    return res.send(errResponse(baseResponse.ORDER_IS_NOT_WAIT_STATUS)); // 3045

  if (checkOrderStatus === 0 && status == 5)
    return res.send(errResponse(baseResponse.ORDER_IS_NOT_WAIT_STATUS)); // 3046

  // Response Error End

  const result = await adminService.updateOrderStatus(orderId, status);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 102
 * API Name : 라이더 위치 초기 세팅 API
 * [POST] /admin/delivery/rider-arrange
 */
export const createRider = async function (req: any, res: any) {
  const { storeId, orderId } = req.body;

  // Request Error Start

  if (!orderId) return res.send(errResponse(baseResponse.ORDER_ID_IS_EMPTY)); // 2040

  // Request Error End

  // Response Error Start

  const checkOrderExist = await adminProvider.checkOrderExist(storeId, orderId);

  if (checkOrderExist === 0)
    return res.send(errResponse(baseResponse.ORDER_IS_NOT_EXIST)); // 3027

  // Response Error End

  const result = await adminService.createRider(storeId, orderId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 103
 * API Name : 라이더 위치 갱신 API
 * [PATCH] /admin/delivery/rider-location
 */
export const updateRider = async function (req: any, res: any) {
  const { orderId, address } = req.body;

  const location = await kakaoMap(address);

  // Request Error Start

  if (typeof location === 'string')
    return res.send(errResponse(baseResponse.LOCATION_INFO_IS_NOT_VALID)); // 2076

  // Request Error End

  // Response Error Start

  const checkOrderAlive = await adminProvider.checkOrderAlive(orderId);

  if (checkOrderAlive === 0)
    return res.send(errResponse(baseResponse.ORDER_IS_FINISHED)); // 3042

  // Response Error End

  const result = await adminService.updateRider(
    orderId,
    location.lat,
    location.lng
  );

  return res.send(response(baseResponse.SUCCESS, result));
};
