// 음식 카테고리 조회
export const selectFoodCategory = async function (connection: any) {
  const query = `
                select id, categoryName, imageURL
                from StoreCategory;
                `;

  const row = await connection.query(query);

  return row[0];
};

// 유저 존재 여부 check
export const checkUserExist = async function (connection: any, userId: number) {
  const query = `
                select exists(select id from User where id = ?) as exist;
                `;

  const row = await connection.query(query, userId);

  return row[0][0]['exist'];
};

// 카테고리 존재 여부 check
export const checkCategoryExist = async function (
  connection: any,
  categoryId: string
) {
  const query = `
                select exists(select id from StoreCategory where id = ?) as exist;
                `;

  const row = await connection.query(query, categoryId);

  return row[0][0]['exist'];
};

// 새로 들어왔어요 목록 조회 by userId
export const selectNewStoreByUserId = async function (
  connection: any,
  userId: number,
  categoryId: string
) {
  const query = `
                select s.id as storeId, s.storeName, smi.imageURL,
                      ifnull(rc.count, 0) as reviewCount, round(ifnull(rc.point, 0.0), 1) as avgPoint,
                      concat(format(getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude), 1), 'km') as distance,
                      case
                          when sdp.price = 0
                              then '무료배달'
                          else
                              concat('배달비 ', format(sdp.price, 0), '원')
                      end as deliveryFee,
                      case
                          when c.discount is not null
                              then concat(format(c.discount, 0), '원 쿠폰')
                          else
                              '쿠폰 없음'
                      end as coupon
                from Store s
                    left join (select * from StoreMainImage where isDeleted = 1 and number = 1) as smi on s.id = smi.storeId
                    left join (select *, row_number() over (partition by storeId order by price) as rn
                              from StoreDeliveryPrice
                              where isDeleted = 1) as sdp on s.id = sdp.storeId
                    left join (select storeId, count(storeId) as count, avg(point) as point
                              from Review
                              where isDeleted = 1 group by storeId) as rc on s.id = rc.storeId
                    left join Franchise f on f.id = s.franchiseId
                    left join (select * from Coupon where status = 1) as c on c.franchiseId = f.id,
                    User u
                where u.id = ?
                and s.categoryId = ?
                and sdp.rn = 1
                and s.status = 1
                and s.isDeleted = 1
                and getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude) <= 4
                and timestampdiff(day, s.createdAt, now()) <= 30
                order by s.createdAt desc
                limit 10;
                `;

  const row = await connection.query(query, userId, categoryId);

  return row[0];
};

// 새로 들어왔어요 목록 조회 by address
export const selectNewStoreByAddress = async function (
  connection: any,
  lat: string,
  lng: string,
  categoryId: string
) {
  const query = `
                select s.id as storeId, s.storeName, smi.imageURL,
                      ifnull(rc.count, 0) as reviewCount, round(ifnull(rc.point, 0.0), 1) as avgPoint,
                      concat(format(getDistance(?, ?, s.storeLatitude, s.storeLongtitude), 1), 'km') as distance,
                      case
                          when sdp.price = 0
                              then '무료배달'
                          else
                              concat('배달비 ', format(sdp.price, 0), '원')
                      end as deliveryFee,
                      case
                          when c.discount is not null
                              then concat(format(c.discount, 0), '원 쿠폰')
                          else
                              '쿠폰 없음'
                      end as coupon
                from Store s
                    left join (select * from StoreMainImage where isDeleted = 1 and number = 1) as smi on s.id = smi.storeId
                    left join (select *, row_number() over (partition by storeId order by price) as rn
                              from StoreDeliveryPrice
                              where isDeleted = 1) as sdp on s.id = sdp.storeId
                    left join (select storeId, count(storeId) as count, avg(point) as point
                              from Review
                              where isDeleted = 1 group by storeId) as rc on s.id = rc.storeId
                    left join Franchise f on f.id = s.franchiseId
                    left join (select * from Coupon where status = 1) as c on c.franchiseId = f.id
                where s.categoryId = ?
                and sdp.rn = 1
                and s.status = 1
                and s.isDeleted = 1
                and getDistance(?, ?, s.storeLatitude, s.storeLongtitude) <= 4
                and timestampdiff(day, s.createdAt, now()) <= 30
                order by s.createdAt desc
                limit 10;
                `;

  const row = await connection.query(query, [lat, lng, categoryId, lat, lng]);

  return row[0];
};

// 음식점 조회 by categoryId and userId
export const selectStoresByCategoryIdAndUserId = async function (
  connection: any,
  userId: number,
  categoryCondition: string,
  page: string,
  size: string,
  filterCondition: string,
  cheetahCondition: string,
  deliveryFeeCondition: string,
  minPriceCondition: string,
  couponCondition: string
) {
  const query = `
                select s.id as storeId, group_concat(smi.imageURL order by smi.number) as imageArray,
                      s.storeName, concat(s.deliveryTime, '-', s.deliveryTime + 10, '분') as deliveryTime,
                      round(ifnull(rc.point, 0.0), 1) as avgPoint, ifnull(rc.count, 0) as reviewCount,
                      concat(format(getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude), 1), 'km') as distance,
                      case
                          when sdp.price = 0
                              then '무료배달'
                          else
                              concat('배달비 ', format(sdp.price, 0), '원')
                      end as deliveryFee,
                      s.isCheetah,
                      case
                          when timestampdiff(day, s.createdAt, now()) <= 30
                              then 1
                          else
                              0
                      end as isNew,
                      case
                          when c.discount is not null
                              then concat(format(c.discount, 0), '원 쿠폰')
                          else
                              '쿠폰 없음'
                      end as coupon
                from Store s
                    left join (select *, row_number() over (partition by storeId order by price) as rn
                              from StoreDeliveryPrice
                              where isDeleted = 1) as sdp on s.id = sdp.storeId
                    left join (select storeId, count(storeId) as count, avg(point) as point
                              from Review
                              where isDeleted = 1 group by storeId) as rc on s.id = rc.storeId
                    left join (select storeId, count(storeId) as count
                              from OrderList
                              where status != 0 group by storeId) as oc on s.id = oc.storeId
                    left join (select * from StoreMainImage where isDeleted = 1) as smi on s.id = smi.storeId
                    left join Franchise f on f.id = s.franchiseId
                    left join (select * from Coupon where status = 1) as c on c.franchiseId = f.id,
                    User u
                where u.id = ?
                ${categoryCondition}
                and s.isDeleted = 1
                and sdp.rn = 1
                and getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude) <= 4
                ${cheetahCondition}
                ${deliveryFeeCondition}
                ${minPriceCondition}
                ${couponCondition}
                group by s.id
                ${filterCondition}
                limit ${page}, ${size};
                `;

  const row = await connection.query(query, userId);

  return row[0];
};

// 음식점 조회 by categoryId and address
export const selectStoresByCategoryIdAndAddress = async function (
  connection: any,
  lat: string,
  lng: string,
  categoryCondition: string,
  page: string,
  size: string,
  filterCondition: string,
  cheetahCondition: string,
  deliveryFeeCondition: string,
  minPriceCondition: string,
  couponCondition: string
) {
  const query = `
                select s.id as storeId, group_concat(smi.imageURL order by smi.number) as imageArray,
                      s.storeName, concat(s.deliveryTime, '-', s.deliveryTime + 10, '분') as deliveryTime,
                      round(ifnull(rc.point, 0.0), 1) as avgPoint, ifnull(rc.count, 0) as reviewCount,
                      concat(format(getDistance(?, ?, s.storeLatitude, s.storeLongtitude), 1), 'km') as distance,
                      case
                          when sdp.price = 0
                              then '무료배달'
                          else
                              concat('배달비 ', format(sdp.price, 0), '원')
                      end as deliveryFee,
                      s.isCheetah,
                      case
                          when timestampdiff(day, s.createdAt, now()) <= 30
                              then 1
                          else
                              0
                      end as isNew,
                      case
                          when c.discount is not null
                              then concat(format(c.discount, 0), '원 쿠폰')
                          else
                              '쿠폰 없음'
                      end as coupon
                from Store s
                    left join (select *, row_number() over (partition by storeId order by price) as rn
                              from StoreDeliveryPrice
                              where isDeleted = 1) as sdp on s.id = sdp.storeId
                    left join (select storeId, count(storeId) as count, avg(point) as point
                              from Review
                              where isDeleted = 1 group by storeId) as rc on s.id = rc.storeId
                    left join (select storeId, count(storeId) as count
                              from OrderList
                              where status != 0 group by storeId) as oc on s.id = oc.storeId
                    left join (select * from StoreMainImage where isDeleted = 1) as smi on s.id = smi.storeId
                    left join Franchise f on f.id = s.franchiseId
                    left join (select * from Coupon where status = 1) as c on c.franchiseId = f.id
                where sdp.rn = 1
                ${categoryCondition}
                and s.isDeleted = 1
                and getDistance(?, ?, s.storeLatitude, s.storeLongtitude) <= 4
                ${cheetahCondition}
                ${deliveryFeeCondition}
                ${minPriceCondition}
                ${couponCondition}
                group by s.id
                ${filterCondition}
                limit ${page}, ${size};
                `;

  const row = await connection.query(query, [lat, lng, lat, lng]);

  return row[0];
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

// 음식점 상세페이지 조회
export const selectStore = async function (connection: any, storeId: string) {
  const query1 = `
                  select s.id as storeId, group_concat(smi.imageURL order by smi.number) as imageArray, s.storeName,
                        case
                            when c.discount is not null
                                then concat(format(c.discount, 0), '원 쿠폰 받기')
                            else
                                '쿠폰 없음'
                        end as coupon, c.number,
                        round(ifnull(rc.point, 0.0), 1) as avgPoint, ifnull(rc.count, 0) as reviewCount,
                        concat(s.deliveryTime, '-', s.deliveryTime + 10, '분') as deliveryTime, s.isCheetah,
                        case
                            when sdp.price = 0
                                then '무료배달'
                            else
                                concat('배달비 ', format(sdp.price, 0), '원')
                        end as deliveryFee,
                        concat(format(sdp.orderPrice, 0), '원') as minPrice
                  from Store s
                      left join (select * from StoreMainImage where isDeleted = 1) as smi on s.id = smi.storeId
                      left join (select *, row_number() over (partition by storeId order by price) as rn
                              from StoreDeliveryPrice
                              where isDeleted = 1) as sdp on s.id = sdp.storeId
                      left join (select storeId, count(storeId) as count, avg(point) as point
                                from Review
                            where isDeleted = 1 group by storeId) as rc on s.id = rc.storeId
                      left join Franchise f on f.id = s.franchiseId
                      left join (select * from Coupon where status = 1) as c on c.franchiseId = f.id
                  where s.id = ?
                  and sdp.rn = 1
                  and s.isDeleted = 1
                  group by s.id;
                  `;

  const query2 = `
                  select sm.id as menuId, sm.menuCategoryName, sm.menuCategoryNumber,
                        sm.menuName, sm.menuNumber, concat(format(sm.price, 0), '원') as price,
                        smi.imageURL, sm.description, sm.isSoldOut
                  from StoreMenu sm
                      left join StoreMenuImage smi on sm.id = smi.menuId
                  where sm.storeId = ?
                  and sm.rootId = sm.id
                  and (smi.number = 1 or smi.number is null)
                  order by sm.menuCategoryNumber, sm.menuNumber;
                  `;

  const row1 = await connection.query(query1, storeId);
  const row2 = await connection.query(query2, storeId);

  const result = {
    info: row1[0],
    mainMenu: row2[0],
  };

  return result;
};

// 음식점 배달비 자세히
export const selectStoreDelivery = async function (
  connection: any,
  storeId: string
) {
  const query = `
                select concat(format(orderPrice, 0), '원') as minPrice,
                      case
                          when price = 0
                              then '무료배달'
                          else
                              concat('배달비 ', format(price, 0), '원')
                      end as deliveryFee
                from StoreDeliveryPrice
                where storeId = ?
                order by minPrice;
                `;

  const row = await connection.query(query, storeId);

  return row[0];
};

// 음식점 매장/원산지 정보 조회
export const selectStoreInfo = async function (
  connection: any,
  storeId: string
) {
  const query = `
                select storeName,
                      concat('전화번호: ', storePhoneNum) as phoneNum,
                      concat('주소: ', storeAddress) as address,
                      concat('대표자명: ', chiefName) as chief,
                      concat('사업자등록번호: ', businessNum) as businessNumber,
                      concat('상호명: ', businessName) as businessName,
                      businessHours, storeIntro, notice, originInfo
                from Store
                where id = ?;
                `;

  const row = await connection.query(query, storeId);

  return row[0];
};

// 메뉴 존재 여부 check
export const checkMenuExist = async function (connection: any, menuId: string) {
  const query = `
                select exists(select id
                              from StoreMenu
                              where id = ?
                              and isDeleted = 1
                              and rootId = id) as exist;
                `;

  const row = await connection.query(query, menuId);

  return row[0][0]['exist'];
};

// 메인 메뉴 조회
export const selectMainMenu = async function (connection: any, menuId: string) {
  const query1 = `
                  select group_concat(smi.imageURL order by smi.number) as imageArray, sm.menuName, sm.description,
                        concat(format(sm.price, 0), '원') as price
                  from StoreMenu sm
                      left join StoreMenuImage smi on sm.id = smi.menuId
                  where smi.isDeleted = 1
                  and sm.id = ?;
                `;

  const query2 = `
                  select id as subMenuId, subMenuName, isRequired, subMenuNumber, menuName, menuNumber,
                        case
                            when price = 0
                                then ''
                            else
                                concat('(+ ', price, ')')
                        end as price, isSoldOut
                  from StoreMenu
                  where isDeleted = 1
                  and subMenuNumber is not null
                  and rootId = ?
                  order by subMenuNumber, menuNumber;
                  `;

  const row1 = await connection.query(query1, menuId);
  const row2 = await connection.query(query2, menuId);

  const result = { mainMenu: row1[0], subMenu: row2[0] };

  return result;
};

// 이미 좋아요 클릭 여부 check
export const checkStoreLike = async function (
  connection: any,
  userId: number,
  storeId: string
) {
  const query = `
                select exists(select id
                              from StoreLike
                              where userId = ?
                              and storeId = ?
                              and isDeleted = 1) as exist;
                `;

  const row = await connection.query(query, [userId, storeId]);

  return row[0];
};

// 음식점 즐겨찾기 추가
export const createStoreLike = async function (
  connection: any,
  userId: number,
  storeId: string
) {
  const checkExistQuery = `
                  select exists(select id
                                from StoreLike
                                where userId = ?
                                and storeId = ?) as exist;
                  `;

  const checkExistRow = await connection.query(checkExistQuery, [
    userId,
    storeId,
  ]);

  if (checkExistRow[0][0]['exist'] === 0) {
    const query = `
                  insert into StoreLike (userId, storeId)
                  values (?, ?);
                  `;

    const row = await connection.query(query, [userId, storeId]);

    return row[0];
  } else {
    const query = `
                  update StoreLike
                  set isDeleted = 1
                  where userId = ?
                  and storeId = ?;
                  `;

    const row = await connection.query(query, [userId, storeId]);

    return row[0].info;
  }
};

// 음식점 즐겨찾기 삭제
export const deleteStoreLike = async function (
  connection: any,
  userId: number,
  storeIdArr: number[]
) {
  let deleteCount = 0;

  for (let i = 0; i < storeIdArr.length; i++) {
    const query = `
                update StoreLike
                set isDeleted = 0
                where userId = ?
                and storeId = ?;
                `;

    const row = await connection.query(query, [userId, storeIdArr[i]]);

    if (row[0].affectedRows === 1) {
      deleteCount += 1;
    }
  }

  return { deleteCount };
};

// 즐겨찾기 목록 조회
export const selectStoreLike = async function (
  connection: any,
  userId: number,
  filterCondition: string
) {
  const query = `
                select s.id as storeId, smi.imageURL, s.storeName, s.isCheetah,
                      concat(s.deliveryTime, '-', s.deliveryTime + 10, '분') as deliveryTime,
                      round(ifnull(rc.point, 0.0), 1) as avgPoint, ifnull(rc.count, 0) as reviewCount,
                      case
                          when getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude) > 4
                              then '현재 위치에서 주문 불가'
                          else
                              concat(format(getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude), 1), 'km')
                      end as distance,
                      case
                          when sdp.price = 0
                              then '무료배달'
                          else
                              concat('배달비 ', format(sdp.price, 0), '원')
                      end as deliveryFee,
                      case
                          when c.discount is not null
                              then concat(format(c.discount, 0), '원 쿠폰')
                          else
                              '쿠폰 없음'
                      end as coupon
                from StoreLike sl
                    left join Store s on sl.storeId = s.id
                    left join (select * from StoreMainImage where isDeleted = 1 and number = 1) as smi on s.id = smi.storeId
                    left join (select storeId, count(storeId) as count, avg(point) as point
                              from Review
                              where isDeleted = 1 group by storeId) as rc on s.id = rc.storeId
                    left join User u on sl.userId = u.id
                    left join (select storeId, min(price) as price
                                from StoreDeliveryPrice
                                where isDeleted = 1
                                group by storeId) as sdp on sl.storeId = sdp.storeId
                    left join Franchise f on f.id = s.franchiseId
                    left join (select * from Coupon where status = 1 or status is null) as c on c.franchiseId = f.id
                    left join (select storeId, max(createdAt) as recentOrder, count(storeId) as orderCount
                              from OrderList
                              where status != 0
                              and userId = ?
                              group by storeId) as ol on ol.storeId = sl.storeId
                where sl.userId = ?
                and s.isDeleted = 1
                and sl.isDeleted = 1
                group by s.id
                ${filterCondition};
                `;

  const row = await connection.query(query, [userId, userId]);

  return { count: `총 ${row[0].length}개`, result: row[0] };
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
