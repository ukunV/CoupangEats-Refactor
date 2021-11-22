import express from 'express';
import compression from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';

import { userRoute } from '../src/app/User/userRoute';
import { storeRoute } from '../src/app/Store/storesRoute';
import { addressRoute } from '../src/app/Address/addressRoute';
import { cartRoute } from '../src/app/Cart/cartRoute';
import { couponRoute } from '../src/app/Coupon/couponRoute';
import { reviewRoute } from '../src/app/Review/reviewRoute';
import { paymentRoute } from '../src/app/Payment/paymentRoute';
import { orderRoute } from '../src/app/Order/orderRoute';
import { adminRoute } from '../src/app/admin/adminRoute';

module.exports = function () {
  const app = express();

  app.use(compression());

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.use(methodOverride());

  app.use(cors());
  // app.use(express.static(process.cwd() + '/public'));

  /* App (Android, iOS) */
  // TODO: 도메인을 추가할 경우 이곳에 Route를 추가하세요.
  userRoute(app);
  storeRoute(app);
  addressRoute(app);
  cartRoute(app);
  couponRoute(app);
  reviewRoute(app);
  paymentRoute(app);
  orderRoute(app);
  adminRoute(app);

  return app;
};
