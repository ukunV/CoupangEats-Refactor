import * as userDao from './userDao';
import { connect_service } from '../../../controllers/mysql';

// Service: Create, Update, Delete 비즈니스 로직 처리

// 유저 회원가입
export const createUser = async function (
  email: string,
  salt: string,
  hashedPassword: string,
  name: string,
  phoneNum: string,
  lat: string,
  lng: string
) {
  const result = connect_service(
    userDao.createUser,
    'User-createUser Service',
    email,
    salt,
    hashedPassword,
    name,
    phoneNum,
    lat,
    lng
  );

  return result;
};

// 아이디 찾기 - 인증번호 전송 및 저장
export const updateAuthNumByPhoneNum = async function (
  phoneNum: string,
  authNum: string
) {
  const result = connect_service(
    userDao.updateAuthNumByPhoneNum,
    'User-updateAuthNumByPhoneNum Service',
    phoneNum,
    authNum
  );

  return result;
};

// 비밀번호 찾기 - 인증번호 전송 및 저장
export const updateAuthNumByEmail = async function (
  email: string,
  authNum: string
) {
  const result = connect_service(
    userDao.updateAuthNumByEmail,
    'User-updateAuthNumByEmail Service',
    email,
    authNum
  );

  return result;
};

// 비밀번호 찾기 - 인증번호 확인 및 비밀번호 재설정
export const updatePassword = async function (
  hashedPassword: string,
  salt: string,
  email: string
) {
  const result = connect_service(
    userDao.updatePassword,
    'User-updatePassword Service',
    hashedPassword,
    salt,
    email
  );

  return result;
};
