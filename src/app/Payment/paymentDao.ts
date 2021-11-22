// 유저 존재 여부 확인
export const checkUserExist = async function (connection: any, userId: number) {
  const query = `
                select exists(select id from User where id = ?) as exist;
                `;

  const row = await connection.query(query, userId);

  return row[0][0]['exist'];
};

// 결제방식(카드) 등록
export const createCard = async function (
  connection: any,
  userId: number,
  number: string,
  validMonth: string,
  validYear: string,
  cvc: string,
  pwd: string
) {
  const query1 = `
                update Payment
                set isChecked = 0
                where userId = ?;
                `;

  await connection.query(query1, userId);

  const query2 = `
                insert into Payment (userId, type, number, validMonth, validYear, cvc, pwd, isChecked)
                values (?, 1, ?, ?, ?, ?, ?, 1);
                `;

  const row2 = await connection.query(query2, [
    userId,
    number,
    validMonth,
    validYear,
    cvc,
    pwd,
  ]);

  return row2[0];
};

// 결제방식(계좌) 등록 - 입금주명(유저명) 조회
export const selectUserNameAtAccount = async function (
  connection: any,
  userId: number
) {
  const query = `
                select name
                from User
                where id = ?;
                `;

  const row = await connection.query(query, userId);

  return { userName: row[0][0]['name'] };
};

// 은행 존재 여부 check
export const checkBankExist = async function (connection: any, bankId: string) {
  const query = `
                select exists(select id
                              from AccountBank
                              where id = ?) as exist;
                `;

  const row = await connection.query(query, bankId);

  return row[0][0]['exist'];
};

// 은행의 계좌번호 길이 check
export const checkAccountLength = async function (
  connection: any,
  bankId: string,
  numLen: string
) {
  const query = `
                select exists(select id
                              from AccountBank
                              where id = ?
                              and accountLen = ?) as exist;                
                `;

  const row = await connection.query(query, [bankId, numLen]);

  return row[0][0]['exist'];
};

// 결제방식(계좌) 등록
export const createAccount = async function (
  connection: any,
  userId: number,
  bankId: string,
  number: string
) {
  const query1 = `
                update Payment
                set isChecked = 0
                where userId = ?;
                `;

  await connection.query(query1, userId);

  const query2 = `
                insert into Payment (userId, bankId, type, number, isChecked)
                values (?, ?, 2, ?, 1);
                `;

  const row2 = await connection.query(query2, [userId, bankId, number]);

  return row2[0];
};

// 결제방식 존재 여부 check
export const checkPaymentExist = async function (
  connection: any,
  paymentId: string
) {
  const query = `
                select exists(select id
                              from Payment
                              where id = ?
                              and isDeleted = 1) as exist;                
                `;

  const row = await connection.query(query, paymentId);

  return row[0][0]['exist'];
};

// 해당 유저의 결제방식이 맞는지 check
export const checkPaymentHost = async function (
  connection: any,
  userId: number,
  paymentId: string
) {
  const query = `
                select exists(select id
                              from Payment
                              where id = ?
                              and userId = ?) as exist;              
                `;

  const row = await connection.query(query, [paymentId, userId]);

  return row[0][0]['exist'];
};

// 결제방식 삭제
export const deletePayment = async function (
  connection: any,
  paymentId: string
) {
  const query = `
                update Payment
                set isDeleted = 0
                where id = ?;
                `;

  const row = await connection.query(query, paymentId);

  return row[0].info;
};

// 현금영수증 발급 정보 조회
export const selectCashReceiptInfo = async function (
  connection: any,
  userId: number
) {
  const query = `
                select isGet,
                case
                    when cashReceiptMethod = 1
                        then '개인소득공제 (휴대폰번호)'
                    when cashReceiptMethod = 2
                        then '개인소득공제 (현금영수증카드)'
                    when cashReceiptMethod = 3
                        then '사업자증빙 (현금영수증카드)'
                    when cashReceiptMethod = 4
                        then '사업자증빙 (사업자등록번호)'
                end as cashReceiptMethod, cashReceiptNum
                from User
                where id = ?;
                `;

  const row = await connection.query(query, userId);

  return row[0];
};

// 현금영수증 발급 정보 변경
export const modifyCashReceiptMethod = async function (
  connection: any,
  userId: number,
  isGet: number,
  cashReceiptMethod: number,
  cashReceiptNum: string
) {
  const query = `
                update User
                set isGet = ?, cashReceiptMethod = ?, cashReceiptNum = ?
                where id = ?;
                `;

  const row = await connection.query(query, [
    isGet,
    cashReceiptMethod,
    cashReceiptNum,
    userId,
  ]);

  return row[0].info;
};

// 결제 관리 페이지 조회
export const selectPayment = async function (connection: any, userId: number) {
  const query1 = `
                  select id as paymentId, 
                        concat('****', left(right(number, 4),3), '*') as number,
                        isChecked
                  from Payment
                  where type = 1
                  and isDeleted = 1
                  and userId = ?;
                `;

  const query2 = `
                  select p.id as paymentId, ab.bankName,
                        concat('****', right(p.number, 4)) as number,
                        isChecked
                  from Payment p
                      left join AccountBank ab on p.bankId = ab.id
                  where type = 2
                  and isDeleted = 1
                  and userId = ?;
                `;

  const query3 = `
                select cashReceiptNum
                from User
                where id = ?
                and isGet = 1;
                `;

  const row1 = await connection.query(query1, userId);
  const row2 = await connection.query(query2, userId);
  const row3 = await connection.query(query3, userId);

  return { card: row1[0], account: row2[0], cashReceipt: row3[0] };
};

// 계정 정지 여부 확인
export const checkUserBlocked = async function (
  connection: any,
  userId: number
) {
  const query = `
                select exists(select id
                              from User
                              where id = ?
                              and status = 2) as exist;
                `;

  const row = await connection.query(query, userId);

  return row[0][0]['exist'];
};

// 계정 탈퇴 여부 확인
export const checkUserWithdrawn = async function (
  connection: any,
  userId: number
) {
  const query = `
                select exists(select id
                              from User
                              where id = ?
                              and status = 0) as exist;
                `;

  const row = await connection.query(query, userId);

  return row[0][0]['exist'];
};

// 계좌 은행 목록 조회
export const selectBankList = async function (connection: any) {
  const query = `
                select id as bankId, bankName
                from AccountBank;
                `;

  const row = await connection.query(query);

  return row[0];
};
