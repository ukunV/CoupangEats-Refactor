// 유저 존재 여부 확인
export const checkUserExist = async function (connection: any, userId: number) {
  const query = `
                select exists(select id from User where id = ?) as exist;
                `;

  const row = await connection.query(query, userId);

  return row[0][0]['exist'];
};

// 주소 추가
export const insertAddress = async function (
  connection: any,
  userId: number,
  type: number,
  nickname: string,
  buildingName: string,
  address: string,
  detailAddress: string,
  information: string,
  lat: string,
  lng: string
) {
  const query1 = `
                  update Address
                  set isChecked = 0
                  where userId = ?
                  `;

  const row1 = await connection.query(query1, userId);

  let row2 = '';
  let row3 = '';

  if (type === 1) {
    const query2 = `
                      update Address
                      set type = 3
                      where type = 1
                      and userId = ?;
                      `;

    row2 = await connection.query(query2, userId)[0].info;
  } else if (type === 2) {
    const query3 = `
                      update Address
                      set type = 3
                      where type = 2
                      and userId = ?;
                      `;

    row3 = await connection.query(query3, userId)[0].info;
  }

  const query4 = `
                    update User
                    set userLatitude = ?, userLongtitude = ?
                    where id = ?
                    `;

  const row4 = await connection.query(query4, [lat, lng, userId]);

  const query5 = `
                  insert into Address(userId, type, nickname, buildingName,
                                      address, detailAddress, information,
                                      addressLatitude, addressLongtitude)
                  values (?, ?, ?, ?, ?, ?, ?, ?, ?);
                  `;

  const row5 = await connection.query(query5, [
    userId,
    type,
    nickname,
    buildingName,
    address,
    detailAddress,
    information,
    lat,
    lng,
  ]);

  return {
    isChecked: row1[0].info,
    type1: row2,
    type2: row3,
    userLocation: row4[0].info,
    insertedAddress: row5[0],
  };
};

// 주소 존재 여부 확인
export const checkAddressExist = async function (
  connection: any,
  addressId: string
) {
  const query = `
                select exists(select id
                              from Address
                              where id = ?
                              and isDeleted = 1) as exist;
                `;

  const row = await connection.query(query, addressId);

  return row[0][0]['exist'];
};

// 주소 수정
export const updateAddress = async function (
  connection: any,
  userId: number,
  type: number,
  nickname: string,
  buildingName: string,
  address: string,
  detailAddress: string,
  information: string,
  lat: string,
  lng: string,
  addressId: string
) {
  let row1 = '';
  let row2 = '';

  if (type === 1) {
    const query1 = `
                      update Address
                      set type = 3
                      where type = 1
                      and userId = ?;
                      `;

    row1 = await connection.query(query1, userId)[0].info;
  } else if (type === 2) {
    const query2 = `
                      update Address
                      set type = 3
                      where type = 2
                      and userId = ?;
                      `;

    row2 = await connection.query(query2, userId)[0].info;
  }

  const query3 = `
                update Address
                set type = ?, nickname = ?, buildingName = ?, address = ?, detailAddress = ?,
                    information = ?, addressLatitude = ?, addressLongtitude = ?
                where id = ?;
                `;

  const row3 = await connection.query(query3, [
    type,
    nickname,
    buildingName,
    address,
    detailAddress,
    information,
    lat,
    lng,
    addressId,
  ]);

  return { type1: row1, type2: row2, modifiedAddress: row3[0].info };
};

// 주소 삭제
export const deleteAddress = async function (
  connection: any,
  addressId: string
) {
  const query = `
                update Address
                set isDeleted = 0, type = 3, isChecked = 0
                where id = ?;
                `;

  const row = await connection.query(query, addressId);

  return row[0].info;
};

// 주소 목록 조회
export const selectAddress = async function (connection: any, userId: number) {
  const query = `
                select id as addressId,
                      case
                          when type = 1
                              then '집'
                          when type = 2
                              then '회사'
                          when nickname != '' and nickname is not null
                              then nickname
                          when buildingName != '' and nickname is not null
                              then buildingName
                      else
                        address
                      end as name, type, address, detailAddress, isChecked
                from Address
                where isDeleted = 1
                and userId= ?
                order by field(type, 2, 1) desc, createdAt desc;
                `;

  const row = await connection.query(query, userId);

  return row[0];
};

// 집/회사 주소 존재 여부 확인
export const checkHouseCompany = async function (
  connection: any,
  userId: number,
  type: number
) {
  const query = `
                select exists(select id
                              from Address
                              where userId = ?
                              and type = ?
                              and isDeleted = 1) as exist;
                `;

  const row = await connection.query(query, [userId, type]);

  return row[0][0]['exist'];
};

// 주소 목록에서 주소 선택
export const updateLocation = async function (
  connection: any,
  addressId: number,
  userId: number,
  lat: string,
  lng: string
) {
  const query1 = `
                  update Address
                  set isChecked = 0
                  where userId = ?
                  `;

  const row1 = await connection.query(query1, userId);

  const query2 = `
              update Address
              set isChecked = 1
              where id = ?
              `;

  const row2 = await connection.query(query2, addressId);

  const query3 = `
                  update User
                  set userLatitude = ?, userLongtitude = ?
                  where id = ?
                  `;

  const row3 = await connection.query(query3, [lat, lng, userId]);

  return {
    makeChecked_0: row1[0].info,
    makeChecked_1: row2[0].info,
    userLocation: row3[0].info,
  };
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
