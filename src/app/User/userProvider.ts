import { connect_provider } from '../../../controllers/mysql';
import * as userDao from './userDao';
import * as user_ctrl from '../../../controllers/user_ctrl';

// Provider: Read 비즈니스 로직 처리

// 이메일 존재 여부 확인
export const checkEmailExist = async function (email: string) {
  const result = await connect_provider(
    userDao.checkEmailExist,
    'User-checkEmailExist Provider',
    email
  );

  return result;
};

// 전화번호 존재 여부 확인
export const checkPhoneNumExist = async function (phoneNum: string) {
  const result = await connect_provider(
    userDao.checkPhoneNumExist,
    'User-checkPhoneNumExist Provider',
    phoneNum
  );

  return result;
};

// 비밀번호 확인
export const checkPassword = async function (email: string, password: string) {
  const salt = await connect_provider(
    userDao.getSalt,
    'User-checkPassword Provider',
    email
  );

  const hashedPassword = await user_ctrl.makePasswordHashed(salt, password);

  const result = await connect_provider(
    userDao.checkPassword,
    'User-checkPassword Provider',
    email,
    hashedPassword
  );

  return result;
};

// 유저 존재 여부 확인
export const checkUserExist = async function (userId: string) {
  const result = await connect_provider(
    userDao.checkUserExist,
    'User-checkUserExist Provider',
    userId
  );

  return result;
};

// 홈 화면 조회 by userId
export const selectHomeByUserId = async function (userId: string) {
  const result = await connect_provider(
    userDao.selectHomeByUserId,
    'User-selectHomeByUserId Provider',
    userId
  );

  return result;
};

// 홈 화면 조회 by address
export const selectHomebyAddress = async function (
  address: string,
  lat: string,
  lng: string
) {
  const result = await connect_provider(
    userDao.selectHomebyAddress,
    'User-selectHomebyAddress Provider',
    address,
    lat,
    lng
  );

  return result;
};

// 이벤트 목록 조회
export const selectEventList = async function (userId: string) {
  const result = await connect_provider(
    userDao.selectEventList,
    'User-selectEventList Provider',
    userId
  );

  return result;
};

// 이벤트 존재 여부 check
export const checkEventExist = async function (eventId: string) {
  const result = await connect_provider(
    userDao.checkEventExist,
    'User-checkEventExist Provider',
    eventId
  );

  return result;
};

// 이벤트 상세페이지 조회
export const selectEvent = async function (eventId: string, distance: string) {
  const result = await connect_provider(
    userDao.selectEvent,
    'User-selectEvent Provider',
    eventId,
    distance
  );

  return result;
};

// 프랜차이즈 존재 여부 check
export const checkFranchiseExist = async function (franchiseId: string) {
  const result = await connect_provider(
    userDao.checkFranchiseExist,
    'User-checkFranchiseExist Provider',
    franchiseId
  );

  return result;
};

// 이벤트 페이지 스토어로 이동
export const eventToStore = async function (
  userId: string,
  franchiseId: string,
  distance: string
) {
  const result = await connect_provider(
    userDao.eventToStore,
    'User-eventToStore Provider',
    userId,
    franchiseId,
    distance
  );

  return result;
};

// 공지사항 목록 조회
export const selectNoticeList = async function () {
  const result = await connect_provider(
    userDao.selectNoticeList,
    'User-selectNoticeList Provider'
  );

  return result;
};

// 공지사항 세부페이지 조회
export const selectNotice = async function (noticeId: string) {
  const result = await connect_provider(
    userDao.selectNotice,
    'User-selectNotice Provider',
    noticeId
  );

  return result;
};

// 공지 존재 여부 check
export const checkNoticeExist = async function (noticeId: string) {
  const result = await connect_provider(
    userDao.checkNoticeExist,
    'User-checkNoticeExist Provider',
    noticeId
  );

  return result;
};

// 계정 정지 여부 check
export const checkUserBlocked = async function (userId: string) {
  const result = await connect_provider(
    userDao.checkUserBlocked,
    'User-checkUserBlocked Provider',
    userId
  );

  return result;
};

// 계정 탈퇴 여부 check
export const checkUserWithdrawn = async function (userId: string) {
  const result = await connect_provider(
    userDao.checkUserWithdrawn,
    'User-checkUserWithdrawn Provider',
    userId
  );

  return result;
};

// 유저 존재 여부 check - 아이디 찾기
export const checkMatchUserWithPhoneNum = async function (
  userName: string,
  phoneNum: string
) {
  const result = await connect_provider(
    userDao.checkMatchUserWithPhoneNum,
    'User-checkMatchUserWithPhoneNum Provider',
    userName,
    phoneNum
  );

  return result;
};

// 인증번호 일치여부 check - 아이디
export const checkAuthNumByPhoneNum = async function (
  phoneNum: string,
  authNum: number
) {
  const result = await connect_provider(
    userDao.checkAuthNumByPhoneNum,
    'User-checkAuthNumByPhoneNum Provider',
    phoneNum,
    authNum
  );

  return result;
};

// 아이디 찾기 - 인증번호 확인 및 이메일 제공
export const selectEmail = async function (phoneNum: string) {
  const result = await connect_provider(
    userDao.selectEmail,
    'User-selectEmail Provider',
    phoneNum
  );

  return result;
};

// 계정 정지 여부 check - 로그인
export const checkEmailBlocked = async function (email: string) {
  const result = await connect_provider(
    userDao.checkEmailBlocked,
    'User-checkEmailBlocked Provider',
    email
  );

  return result;
};

// 계정 탈퇴 여부 check - 로그인
export const checkEmailWithdrawn = async function (email: string) {
  const result = await connect_provider(
    userDao.checkEmailWithdrawn,
    'User-checkEmailWithdrawn Provider',
    email
  );

  return result;
};

// 유저 전화번호 조회 - 비밀번호 찾기
export const selectPhoneNum = async function (email: string) {
  const result = await connect_provider(
    userDao.selectPhoneNum,
    'User-selectPhoneNum Provider',
    email
  );

  return result;
};

// 유저 존재 여부 check - 비밀번호 찾기
export const checkMatchUserWithEmail = async function (
  userName: string,
  email: string
) {
  const result = await connect_provider(
    userDao.checkMatchUserWithEmail,
    'User-checkMatchUserWithEmail Provider',
    userName,
    email
  );

  return result;
};

// 인증번호 일치여부 check - 비밀번호
export const checkAuthNumByEmail = async function (
  email: string,
  authNum: string
) {
  const result = await connect_provider(
    userDao.checkAuthNumByEmail,
    'User-checkAuthNumByEmail Provider',
    email,
    authNum
  );

  return result;
};

// 유저 고유 아이디 조회
export const selectUserId = async function (email: string) {
  const result = await connect_provider(
    userDao.selectUserId,
    'User-selectUserId Provider',
    email
  );

  return result;
};
