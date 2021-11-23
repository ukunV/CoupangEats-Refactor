// 유저 존재 여부 확인
export const checkUserExist = async function (connection: any, userId: number) {
  const query = `
                select exists(select id from User where id = ?) as exist;
                `;

  const row = await connection.query(query, userId);

  return row[0][0]['exist'];
};

// 음식점 존재 여부 check
export const checkStoreExist = async function (
  connection: any,
  storeId: string
) {
  const query = `
                select exists(select id
                              from Store
                              where id = ?
                              and isDeleted = 1) as exist;
                `;

  const row = await connection.query(query, storeId);

  return row[0][0]['exist'];
};

// My 이츠에서 쿠폰 목록 조회
export const selectMyEatsCoupons = async function (
  connection: any,
  userId: number
) {
  const query = `
            select co.id as couponObtainedId, c.couponName,
                  concat(format(c.discount, 0), '원 할인') as discount,
                  concat(format(c.orderPrice, 0), '원 이상 주문 시') as orderPrice,
                  case
                      when c.status = 0
                          then '기간만료'
                      else
                          date_format(endDate, '%m/%d 까지')
                  end as endDate
            from Coupon c
                left join (select * from CouponObtained where status = 1) as co on c.id = co.couponId
            where co.userId = ?
            and c.status = 1
            order by co.createdAt desc;
            `;

  const row = await connection.query(query, userId);

  return row[0];
};

// 카트에서 쿠폰 목록 조회
export const selectCartCoupons = async function (
  connection: any,
  userId: number,
  storeId: string,
  totalPrice: string
) {
  const query = `
            select co.id as couponObtainedId, c.couponName,
                  concat(format(c.discount, 0), '원 할인') as discount,
                  concat(format(c.orderPrice, 0), '원 이상 주문 시') as orderPrice,
                  case
                      when c.status = 0
                          then '기간만료'
                      else
                          date_format(endDate, '%m/%d 까지')
                  end as endDate,
                  case
                      when c.orderPrice <= ?
                          then 1
                      else
                          0
                  end as priceAvailable,
                  c.franchiseId as couponFranchiseId,
                  case
                      when c.franchiseId = 0
                          then 0
                      else
                          s.franchiseId
                  end as storeFranchiseId, co.isChecked
            from Coupon c
                left join (select * from CouponObtained where status = 1) as co on c.id = co.couponId
                left join Franchise f on c.franchiseId = f.id
                left join (select * from Store where id = ?) as s on s.franchiseId = f.id
            where co.userId = ?
            and c.status = 1
            group by co.createdAt
            order by co.createdAt desc;
            `;

  const row = await connection.query(query, [totalPrice, storeId, userId]);

  return row[0];
};

// 쿠폰 존재 여부 check
export const checkCouponExist = async function (
  connection: any,
  number: string
) {
  const query = `
                select exists(select id from Coupon where number = ?) as exist;
                `;

  const row = await connection.query(query, number);

  return row[0][0]['exist'];
};

// 쿠폰 만료 여부 check
export const checkCouponAlive = async function (
  connection: any,
  number: string
) {
  const query = `
                select status
                from Coupon
                where number = ?;
                `;

  const row = await connection.query(query, number);

  return row[0][0]['status'];
};

// 쿠폰 소지 여부 check
export const checkCouponObtained = async function (
  connection: any,
  userId: number,
  number: string
) {
  const query1 = `
                  select id
                  from Coupon
                  where number = ?;
                  `;

  const row1 = await connection.query(query1, number);

  const couponId = row1[0][0]['id'];

  const query2 = `
                select exists(select id
                              from CouponObtained
                              where userId = ?
                              and couponId = ?) as exist;
                `;

  const row2 = await connection.query(query2, [userId, couponId]);

  return row2[0][0]['exist'];
};

// 쿠폰 등록
export const createCoupons = async function (
  connection: any,
  userId: number,
  number: string
) {
  const query1 = `
                  select id
                  from Coupon
                  where number = ?
                  `;

  const row1 = await connection.query(query1, number);

  const couponId = row1[0][0]['id'];

  const query2 = `
                insert into CouponObtained (userId, couponId)
                values (?, ?)
                `;

  const row2 = await connection.query(query2, [userId, couponId]);

  return row2[0];
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
