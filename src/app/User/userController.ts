import * as userProvider from '../../app/User/userProvider';
import * as userService from '../../app/User/userService';
import * as baseResponse from '../../../config/baseResponseStatus';
import { response, errResponse } from '../../../config/response';
import { jwtsecret as secret_config } from '../../../config/secret';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import * as passport from 'passport';

import regexEmail from 'regex-email';

// const firebaseAdmin = require("firebase-admin");
// const serviceAccount = require("../../../config/firebase_key.json");

// firebaseAdmin.intiallizeApp({
//   Credential: firebaseAdmin.credentail.cert(serviceAccount),
// });

// salt
import user_ctrl = require('../../../controllers/user_ctrl');

// 카카오 로그인
// import { secretKey as kakao_key } from '../../../config/kakao_config';
// import { Strategy as KakaoStrategy } from 'passport-kakao';

// 카카오 주소 검색
import { getAddressInfo as kakaoMap } from '../../../controllers/kakao_ctrl';

// ncp-sens
import * as ncpSens from '../../../controllers/sens_ctrl';

// nodemailer
import { resetPasswordMail as mailer } from '../../../controllers/mail_ctrl';
import { type } from 'os';

// regex
// const regexName = /^[가-힣]+$/;
const regPhoneNum = /^\d{10,11}$/;
const regDistance = /^[0-9]+(.[0-9]+)?$/;

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
// export const getTest = async function (req, res) {
//   return res.send(response(baseResponse.SUCCESS));
// };

/**
 * API No. 1
 * API Name : 회원가입 API
 * [POST] /users/sign-up
 */
export const createUsers = async function (req: any, res: any) {
  const { email, password, name, phoneNum } = req.body;

  const { address } = req.body;

  const location = await kakaoMap(address);

  // Request Error Start

  if (!email) return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY)); // 2001

  if (email.length > 30)
    return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH)); // 2002

  if (!regexEmail.test(email))
    return res.send(response(baseResponse.SIGNUP_EMAIL_TYPE)); // 2003

  if (!password) return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY)); // 2004

  if (password.length < 8 || password.length > 20)
    return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH)); // 2005

  if (!name) return res.send(response(baseResponse.SIGNUP_NAME_EMPTY)); // 2006

  if (name.length > 10)
    return res.send(response(baseResponse.SIGNUP_NAME_LENGTH)); // 2007

  if (!phoneNum) return res.send(response(baseResponse.SIGNUP_PHONENUM_EMPTY)); // 2008

  if (!regPhoneNum.test(phoneNum))
    return res.send(response(baseResponse.SIGNUP_PHONENUM_TYPE)); // 2009

  if (typeof location === 'string')
    return res.send(errResponse(baseResponse.LOCATION_INFO_IS_NOT_VALID)); // 2076

  // Request Error End

  // Response Error Start

  const checkEmailExist = await userProvider.checkEmailExist(email);

  if (checkEmailExist === 1)
    return res.send(response(baseResponse.SIGNUP_REDUNDANT_EMAIL)); // 3001

  const checkPhoneNumExist = await userProvider.checkPhoneNumExist(phoneNum);

  if (checkPhoneNumExist === 1)
    return res.send(response(baseResponse.SIGNUP_REDUNDANT_PHONENUM)); // 3002

  // Response Error End

  // 비밀번호 암호화
  const { hashedPassword, salt } = await user_ctrl.createHashedPassword(
    password
  );

  const result = await userService.createUser(
    email,
    salt,
    hashedPassword,
    name,
    phoneNum,
    location.lat,
    location.lng
  );

  const token = await jwt.sign(
    {
      userId: result.insertId,
    }, // 토큰의 내용(payload)
    secret_config, // 비밀키
    {
      expiresIn: '365d',
      subject: 'userInfo',
    } // 유효 기간 365일
  );

  return res.send(
    response(baseResponse.SUCCESS, { userId: result.insertId, jwt: token })
  );
};

/**
 * API No. 2
 * API Name : 로그인 API
 * [POST] /users/sign-in
 */

export const userLogIn = async function (req: any, res: any) {
  const { email, password } = req.body;

  // Request Error Start

  if (!email) return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY)); // 2001

  if (email.length > 30)
    return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH)); // 2002

  if (!regexEmail.test(email))
    return res.send(response(baseResponse.SIGNUP_EMAIL_TYPE)); // 2003

  if (!password) return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY)); // 2004

  if (password.length < 8 || password.length > 20)
    return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH)); // 2005

  // Request Error End

  // Response Error Start

  const checkEmailExist = await userProvider.checkEmailExist(email);

  if (checkEmailExist === 0)
    return res.send(response(baseResponse.SIGNIN_EMAIL_NOT_EXIST)); // 3003

  const checkEmailBlocked = await userProvider.checkEmailBlocked(email);

  if (checkEmailBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkEmailWithdrawn = await userProvider.checkEmailWithdrawn(email);

  if (checkEmailWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkPassword = await userProvider.checkPassword(email, password);

  if (checkPassword === -1)
    return res.send(response(baseResponse.SIGNIN_PASSWORD_WRONG)); // 3004

  // Response Error End

  const selectUserId = await userProvider.selectUserId(email);

  const token = await jwt.sign(
    {
      userId: selectUserId,
    }, // 토큰의 내용(payload)
    secret_config, // 비밀키
    {
      expiresIn: '365d',
      subject: 'userInfo',
    } // 유효 기간 365일
  );

  return res.send(
    response(baseResponse.SUCCESS, { userId: checkPassword, jwt: token })
  );
};

/**
 * API No. 3
 * API Name : 로그아웃 API
 * [POST] /users/sign-out
 */

export const userLogOut = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  //Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  //Request Error End

  // Response Error Start

  const checkUserExist = await userProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await userProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await userProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  // Response Error End

  res.clearCookie('x-access-token');

  return res.send(response(baseResponse.SUCCESS, 'Logout Successfully'));
};

/**
 * API No. 4
 * API Name : 유저 주소 변경 API
 * [PATCH] /users/address
 */

// export const changeAddress = async function (req, res) {
//   const { userId } = req.verifiedToken;
//   const { lat, lng } = req.body;

//   //Request Error Start

//   if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

//   // 위도 범위
//   if ((lat < 33) | (lat > 43))
//     return res.send(errResponse(baseResponse.LATITUDE_IS_NOT_VALID)); // 2013

//   // 경도 범위
//   if ((lng < 124) | (lng > 132))
//     return res.send(errResponse(baseResponse.LONGTITUDE_IS_NOT_VALID)); // 2014

//   //Request Error End

//   // Response Error Start

//   const checkUserExist = userProvider.checkUserExist(userId);

//   if (checkUserExist === 0)
//     return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

//   // Response Error End

//   const result = await userService.updateAddress(lat, lng, userId);

//   return res.send(response(baseResponse.SUCCESS, result));
// };

/**
 * API No. 9
 * API Name : 홈 화면 조회 API
 * [GET] /users/home
 * query string: encodedAddress
 */

export const getHome = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  const { encodedAddress } = req.query;
  const address = decodeURIComponent(encodedAddress);
  const location = await kakaoMap(address);

  // Request Error Start

  if (typeof location === 'string') {
    return res.send(errResponse(baseResponse.LOCATION_INFO_IS_NOT_VALID)); // 2076
  }

  // Request Error End

  // Response Error Start

  if (userId) {
    const checkUserExist = await userProvider.checkUserExist(userId);

    if (checkUserExist === 0)
      return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

    const checkUserBlocked = await userProvider.checkUserBlocked(userId);

    if (checkUserBlocked === 1)
      return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

    const checkUserWithdrawn = await userProvider.checkUserWithdrawn(userId);

    if (checkUserWithdrawn === 1)
      return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

    // Response Error End

    const result = await userProvider.selectHomeByUserId(userId);

    return res.send(response(baseResponse.SUCCESS, result));
  }

  const result = await userProvider.selectHomebyAddress(
    address,
    location.lat,
    location.lng
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 27
 * API Name : 이벤트 목록 조회 API
 * [GET] /users/my-eats/event-list
 */

export const getEventList = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  //Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  //Request Error End

  // Response Error Start

  const checkUserExist = await userProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await userProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await userProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  // Response Error End

  const result = await userProvider.selectEventList(userId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 28
 * API Name : 이벤트 상세페이지 조회 API
 * [GET] /users/my-eats/:eventId/event-detail
 * query string: distance
 */

export const getEvent = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  const { eventId } = req.params;

  const { distance } = req.query;

  //Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!eventId) return res.send(errResponse(baseResponse.EVENT_ID_IS_EMPTY)); // 2030

  if (!regDistance.test(distance))
    return res.send(errResponse(baseResponse.DISTANCE_IS_NOT_VALID)); // 2031

  //Request Error End

  // Response Error Start

  const checkUserExist = await userProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await userProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await userProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkEventExist = await userProvider.checkEventExist(eventId);

  if (checkEventExist === 0)
    return res.send(errResponse(baseResponse.EVENT_IS_NOT_EXIST)); // 3022

  // Response Error End

  const result = await userProvider.selectEvent(eventId, distance);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 29
 * API Name : 이벤트 페이지 스토어로 이동 API
 *            가장 가까운 프랜차이즈 음식점으로 이동
 * [GET] /users/my-eats/event/franchise-store
 * query string: franchiseId, distance
 */

export const eventToStore = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  const { franchiseId, distance } = req.query;

  //Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!franchiseId)
    return res.send(errResponse(baseResponse.FRANCHISE_ID_IS_EMPTY)); // 2035

  if (!regDistance.test(distance))
    return res.send(errResponse(baseResponse.DISTANCE_IS_NOT_VALID)); // 2031

  //Request Error End

  // Response Error Start

  const checkUserExist = await userProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await userProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await userProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkFranchiseExist = await userProvider.checkFranchiseExist(
    franchiseId
  );

  if (checkFranchiseExist === 0)
    return res.send(errResponse(baseResponse.FRANCHISE_IS_NOT_EXIST)); // 3024

  // Response Error End

  const result = await userProvider.eventToStore(userId, franchiseId, distance);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 30
 * API Name : 공지사항 목록 조회 API
 * [GET] /users/my-eats/notice-list
 */

export const getNoticeList = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  //Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  //Request Error End

  // Response Error Start

  const checkUserExist = await userProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await userProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await userProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  // Response Error End

  const result = await userProvider.selectNoticeList();

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 31
 * API Name : 공지사항 세부페이지 조회 API
 * [GET] /users/my-eats/:noticeId/notice-detail
 * path variable: noticeId
 */

export const getNotice = async function (req: any, res: any) {
  const { userId } = req.verifiedToken;

  const { noticeId } = req.params;

  //Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!noticeId) return res.send(errResponse(baseResponse.NOTICE_ID_IS_EMPTY)); // 2032

  //Request Error End

  // Response Error Start

  const checkUserExist = await userProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await userProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await userProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkNoticeExist = await userProvider.checkNoticeExist(noticeId);

  if (checkNoticeExist === 0)
    return res.send(errResponse(baseResponse.NOTICE_IS_NOT_EXIST)); // 3025

  // Response Error End

  const result = await userProvider.selectNotice(noticeId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 62
 * API Name : 아이디 찾기 - 인증번호 전송 및 저장 API
 * [PATCH] /users/user-account/auth
 */
export const findEmail = async function (req: any, res: any) {
  const { userName, phoneNum } = req.body;

  //Request Error Start

  if (!userName) return res.send(response(baseResponse.SIGNUP_NAME_EMPTY)); // 2006

  if (!phoneNum) return res.send(response(baseResponse.SIGNUP_PHONENUM_EMPTY)); // 2008

  if (!regPhoneNum.test(phoneNum))
    return res.send(response(baseResponse.SIGNUP_PHONENUM_TYPE)); // 2009

  //Request Error End

  // Response Error Start

  const checkMatchUserWithPhoneNum =
    await userProvider.checkMatchUserWithPhoneNum(userName, phoneNum);

  if (checkMatchUserWithPhoneNum === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  // Response Error End

  const authNum = ncpSens.createAuthNum();

  ncpSens.messageAuth(1, phoneNum, authNum);

  const result = await userService.updateAuthNumByPhoneNum(phoneNum, authNum);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 63
 * API Name : 아이디 찾기 - 인증번호 확인 및 이메일 제공 API
 * [GET] /users/user-account
 */
export const getEmail = async function (req: any, res: any) {
  const { phoneNum, authNum } = req.query;

  //Request Error Start

  if (!phoneNum) return res.send(response(baseResponse.SIGNUP_PHONENUM_EMPTY)); // 2008

  if (!authNum) return res.send(response(baseResponse.AUTH_NUM_IS_EMPTY)); // 2081

  if (!regPhoneNum.test(phoneNum))
    return res.send(response(baseResponse.SIGNUP_PHONENUM_TYPE)); // 2009

  //Request Error End

  // Response Error Start

  const checkAuthNum = await userProvider.checkAuthNumByPhoneNum(
    phoneNum,
    authNum
  );

  if (checkAuthNum === 0)
    return res.send(errResponse(baseResponse.AUTH_NUM_IS_NOT_MATCH)); // 3047

  // Response Error End

  const result = await userProvider.selectEmail(phoneNum);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 64
 * API Name : 비밀번호 찾기 - 인증번호 전송 및 저장 API
 * [PATCH] /users/user-password/auth
 * type: 1-휴대폰인증 / 2-이메일인증
 */
export const findPassword = async function (req: any, res: any) {
  const { userName, email, type } = req.body;

  //Request Error Start

  if (!userName) return res.send(response(baseResponse.SIGNUP_NAME_EMPTY)); // 2006

  if (!email) return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY)); // 2001

  if (!type) return res.send(response(baseResponse.AUTH_TYPE_IS_EMPTY)); // 2079

  if (type != 1 && type != 2)
    return res.send(response(baseResponse.AUTH_TYPE_IS_NOT_VALID)); // 2080

  //Request Error End

  // Response Error Start

  const checkMatchUserWithEmail = await userProvider.checkMatchUserWithEmail(
    userName,
    email
  );

  if (checkMatchUserWithEmail === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  // Response Error End

  const authNum = ncpSens.createAuthNum();

  if (type === 1) {
    const phoneNum = await userProvider.selectPhoneNum(email);

    ncpSens.messageAuth(2, phoneNum, authNum);
  } else mailer(authNum, email);

  const result = await userService.updateAuthNumByEmail(email, authNum);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 65
 * API Name : 비밀번호 찾기 - 인증번호 확인 및 비밀번호 재설정 API
 * [PATCH] /users/user-password/reset
 */
export const updatePassword = async function (req: any, res: any) {
  const { authNum, password, checkPassword, email } = req.body;

  //Request Error Start

  if (!authNum) return res.send(response(baseResponse.AUTH_NUM_IS_EMPTY)); // 2081

  if (!password) return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY)); // 2004

  if (password.length < 8 || password.length > 20)
    return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH)); // 2005

  if (!checkPassword)
    return res.send(response(baseResponse.CHECK_PASSWORD_IS_EMPTY)); // 2082

  if (password != checkPassword)
    return res.send(response(baseResponse.PASSWORD_IS_DIFFERENT)); // 2083

  if (!email) return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY)); // 2001

  //Request Error End

  // Response Error Start

  const checkAuthNumByEmail = await userProvider.checkAuthNumByEmail(
    email,
    authNum
  );

  if (checkAuthNumByEmail === 0)
    return res.send(errResponse(baseResponse.AUTH_NUM_IS_NOT_MATCH)); // 3047

  // Response Error End

  const { hashedPassword, salt } = await user_ctrl.createHashedPassword(
    password
  );

  const result = await userService.updatePassword(hashedPassword, salt, email);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 66
 * API Name : 카카오 로그인 API
 * [POST] /users/kakao-login
 */

// // client start
// passport.use(
//   'kakao-login',
//   new KakaoStrategy(
//     {
//       clientID: kakao_key,
//       callbackURL: '/auth/kakao/callback',
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       console.log(accessToken);
//       console.log(profile);
//     }
//   )
// );
// // client end

// export const kakaoLogin = async function (req: any, res: any) {
//   const { accessToken } = req.body;

//   if (!accessToken)
//     return res.send(errResponse(baseResponse.ACCESS_TOKEN_IS_EMPTY)); // 2084

//   try {
//     let kakao_profile;

//     try {
//       kakao_profile = await axios.get('https://kapi.kakao.com/v2/user/me', {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': 'application/json',
//         },
//       });
//     } catch (err) {
//       return res.send(errResponse(baseResponse.ACCESS_TOKEN_IS_NOT_VALID)); // 2085
//     }

//     const kakao_data = kakao_profile.data.kakao_account;
//     const kakao_name = kakao_data.profile.nickname;
//     const kakao_email = kakao_data.email;

//     const checkEmailExist = await userProvider.checkEmailExist(kakao_email);

//     if (checkEmailExist === 1) {
//       const selectUserId = await userProvider.selectUserId(kakao_email);

//       const token = await jwt.sign(
//         {
//           userId: selectUserId,
//         },
//         secret_config,
//         {
//           expiresIn: '365d',
//           subject: 'userInfo',
//         }
//       );
//       return res.send(
//         response(baseResponse.SUCCESS, {
//           userId: selectUserId,
//           jwt: token,
//           message: '소셜로그인에 성공하셨습니다.',
//         })
//       );
//     } else {
//       const result = { name: kakao_name, email: kakao_email };

//       return res.send(
//         response(baseResponse.SUCCESS, {
//           message: '회원가입이 가능합니다.',
//           result,
//         })
//       );
//     }
//   } catch (err) {
//     res.send(errResponse(baseResponse.SUCCESS, err));
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };
