import * as paymentDao from './paymentDao';
import { connect_provider } from '../../../controllers/mysql';

// Provider: Read 비즈니스 로직 처리

// 유저 존재 여부 확인
export const checkUserExist = async function (userId: number) {
  const result = await connect_provider(
    paymentDao.checkUserExist,
    'Payment-checkUserExist Provider',
    userId
  );

  return result;
};

// 결제방식(계좌) 등록 - 입금주명(유저명) 조회
export const selectUserNameAtAccount = async function (userId: number) {
  const result = await connect_provider(
    paymentDao.selectUserNameAtAccount,
    'Payment-selectUserNameAtAccount Provider',
    userId
  );

  return result;
};

// 은행 존재 여부 check
export const checkBankExist = async function (bankId: string) {
  const result = await connect_provider(
    paymentDao.checkBankExist,
    'Payment-checkBankExist Provider',
    bankId
  );

  return result;
};

// 은행의 계좌번호 길이 check
export const checkAccountLength = async function (
  bankId: string,
  numLen: number
) {
  const result = await connect_provider(
    paymentDao.checkAccountLength,
    'Payment-checkAccountLength Provider',
    bankId,
    numLen
  );

  return result;
};

// 결제방식 존재 여부 check
export const checkPaymentExist = async function (paymentId: string) {
  const result = await connect_provider(
    paymentDao.checkPaymentExist,
    'Payment-checkPaymentExist Provider',
    paymentId
  );

  return result;
};

// 해당 유저의 결제방식이 맞는지 check
export const checkPaymentHost = async function (
  userId: number,
  paymentId: string
) {
  const result = await connect_provider(
    paymentDao.checkPaymentHost,
    'Payment-checkPaymentHost Provider',
    userId,
    paymentId
  );

  return result;
};

// 현금영수증 발급 정보 조회
export const selectCashReceiptInfo = async function (userId: number) {
  const result = await connect_provider(
    paymentDao.selectCashReceiptInfo,
    'Payment-selectCashReceiptInfo Provider',
    userId
  );

  return result;
};

// 결제 관리 페이지 조회
export const selectPayment = async function (userId: number) {
  const result = await connect_provider(
    paymentDao.selectPayment,
    'Payment-selectPayment Provider',
    userId
  );

  return result;
};

// 계정 정지 여부 확인
export const checkUserBlocked = async function (userId: number) {
  const result = await connect_provider(
    paymentDao.checkUserBlocked,
    'Payment-checkUserBlocked Provider',
    userId
  );

  return result;
};

// 계정 탈퇴 여부 확인
export const checkUserWithdrawn = async function (userId: number) {
  const result = await connect_provider(
    paymentDao.checkUserWithdrawn,
    'Payment-checkUserWithdrawn Provider',
    userId
  );

  return result;
};

// 계좌 은행 목록 조회
export const selectBankList = async function () {
  const result = await connect_provider(
    paymentDao.selectBankList,
    'Payment-selectBankList Provider'
  );

  return result;
};
