import { connect_service } from '../../../controllers/mysql';
import * as paymentDao from './paymentDao';

// Service: Create, Update, Delete 비즈니스 로직 처리

// 결제방식(카드) 등록
export const createCard = async function (
  userId: number,
  number: string,
  validMonth: string,
  validYear: string,
  cvc: string,
  pwd: string
) {
  const result = connect_service(
    paymentDao.createCard,
    'Payment-createCard Service',
    userId,
    number,
    validMonth,
    validYear,
    cvc,
    pwd
  );

  return result;
};

// 결제방식(계좌) 등록
export const createAccount = async function (
  userId: number,
  bankId: string,
  number: string
) {
  const result = connect_service(
    paymentDao.createAccount,
    'Payment-createAccount Service',
    userId,
    bankId,
    number
  );

  return result;
};

// 결제방식 삭제
export const deletePayment = async function (paymentId: string) {
  const result = connect_service(
    paymentDao.deletePayment,
    'Payment-deletePayment Service',
    paymentId
  );

  return result;
};

// 현금영수증 발급 정보 변경
export const modifyCashReceiptMethod = async function (
  userId: number,
  isGet: number,
  cashReceiptMethod: number,
  cashReceiptNum: string
) {
  const result = connect_service(
    paymentDao.modifyCashReceiptMethod,
    'Payment-modifyCashReceiptMethod Service',
    userId,
    isGet,
    cashReceiptMethod,
    cashReceiptNum
  );

  return result;
};
