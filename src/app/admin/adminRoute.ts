import * as admin from './adminController';
import { jwtMiddleware } from '../../../config/jwtMiddleware';

export const adminRoute = (app: any) => {
  // 101. 주문 상태 변경 API
  app.patch('/admin/order-status', admin.updateOrderStatus);

  // 102. 라이더 위치 초기 세팅 API
  app.post('/admin/delivery/rider-arrange', admin.createRider);

  // 103. 라이더 위치 갱신 API
  app.patch('/admin/delivery/rider-location', admin.updateRider);
};
